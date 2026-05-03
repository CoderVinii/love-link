import { MercadoPagoConfig, MerchantOrder, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'
import { getPlano, parseMensagemPayload } from '../../lib/presentePayload'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function readPayload(request) {
  const text = await request.text()

  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

function parseExternalReference(reference) {
  if (!reference) return null

  try {
    return JSON.parse(reference)
  } catch {
    return null
  }
}

function valoresIguais(a, b) {
  return Math.round(Number(a) * 100) === Math.round(Number(b) * 100)
}

async function validarPagamentoMercadoPago({ pagamentoId, presenteId, payment }) {
  if (!pagamentoId || !presenteId) return false
  if (payment.status !== 'approved') return false
  if (payment.currency_id !== 'BRL') return false

  const { data: pagamento, error: erroPagamento } = await supabaseAdmin
    .from('pagamentos')
    .select('id, presente_id, mercadopago_id')
    .eq('id', pagamentoId)
    .maybeSingle()

  if (erroPagamento || !pagamento || Number(pagamento.presente_id) !== Number(presenteId)) {
    console.error('Pagamento local inválido:', erroPagamento)
    return false
  }

  if (payment.preference_id && pagamento.mercadopago_id && payment.preference_id !== pagamento.mercadopago_id) {
    console.error('Preference divergente no webhook:', payment.preference_id, pagamento.mercadopago_id)
    return false
  }

  const { data: presente, error: erroPresente } = await supabaseAdmin
    .from('presentes')
    .select('id, mensagem')
    .eq('id', presenteId)
    .maybeSingle()

  if (erroPresente || !presente) {
    console.error('Presente não encontrado no webhook:', erroPresente)
    return false
  }

  const payload = parseMensagemPayload(presente.mensagem)
  const plano = getPlano(payload.plano)

  if (!valoresIguais(payment.transaction_amount, plano.preco)) {
    console.error('Valor divergente no webhook:', payment.transaction_amount, plano.preco)
    return false
  }

  return true
}

async function atualizarStatus({ pagamentoId, presenteId, status, aprovado }) {
  await supabaseAdmin
    .from('pagamentos')
    .update({ status })
    .eq('id', pagamentoId)

  if (aprovado) {
    await supabaseAdmin
      .from('presentes')
      .update({ pago: true })
      .eq('id', presenteId)
  }
}

async function processarPagamento(paymentId) {
  const paymentClient = new Payment(client)
  const payment = await paymentClient.get({ id: paymentId })
  const status = payment.status || 'unknown'
  const ids = parseExternalReference(payment.external_reference)

  console.log('Webhook payment recebido:', {
    paymentId,
    status,
    statusDetail: payment.status_detail,
    preferenceId: payment.preference_id,
    transactionAmount: payment.transaction_amount,
    currency: payment.currency_id,
  })

  if (!ids?.pagamentoId || !ids?.presenteId) {
    return { status, aprovado: false, motivo: 'referencia_invalida' }
  }

  const aprovado = await validarPagamentoMercadoPago({
    pagamentoId: ids.pagamentoId,
    presenteId: ids.presenteId,
    payment,
  })

  await atualizarStatus({
    pagamentoId: ids.pagamentoId,
    presenteId: ids.presenteId,
    status,
    aprovado,
  })

  return { status, aprovado }
}

async function buscarPagamentoPorPreference(preferenceId) {
  if (!preferenceId) return null

  const { data, error } = await supabaseAdmin
    .from('pagamentos')
    .select('id, presente_id')
    .eq('mercadopago_id', preferenceId)
    .maybeSingle()

  if (error) {
    console.error('Erro ao buscar pagamento por preference:', error)
  }

  return data
}

async function processarMerchantOrder(merchantOrderId) {
  const merchantOrder = new MerchantOrder(client)
  const order = await merchantOrder.get({ merchantOrderId })
  const pagamentos = order.payments || []
  const pagamentoAprovado = pagamentos.find((pagamento) => pagamento.status === 'approved')
  const ultimoPagamento = pagamentoAprovado || pagamentos[pagamentos.length - 1]

  if (!ultimoPagamento) {
    return { status: order.order_status || order.status || 'without_payment', aprovado: false }
  }

  const idsReferencia = parseExternalReference(order.external_reference)
  const pagamentoLocal = idsReferencia?.pagamentoId
    ? { id: idsReferencia.pagamentoId, presente_id: idsReferencia.presenteId }
    : await buscarPagamentoPorPreference(order.preference_id)

  if (!pagamentoLocal) {
    return { status: ultimoPagamento.status || 'unknown', aprovado: false, motivo: 'pagamento_local_nao_encontrado' }
  }

  const paymentClient = new Payment(client)
  const payment = await paymentClient.get({ id: ultimoPagamento.id })

  console.log('Webhook merchant_order recebido:', {
    merchantOrderId,
    paymentId: ultimoPagamento.id,
    status: payment.status || ultimoPagamento.status || 'unknown',
    statusDetail: payment.status_detail,
    preferenceId: order.preference_id,
    transactionAmount: payment.transaction_amount,
    currency: payment.currency_id,
  })

  const aprovado = await validarPagamentoMercadoPago({
    pagamentoId: pagamentoLocal.id,
    presenteId: pagamentoLocal.presente_id,
    payment,
  })

  await atualizarStatus({
    pagamentoId: pagamentoLocal.id,
    presenteId: pagamentoLocal.presente_id,
    status: payment.status || ultimoPagamento.status || 'unknown',
    aprovado,
  })

  return { status: payment.status || ultimoPagamento.status || 'unknown', aprovado }
}

export async function POST(request) {
  try {
    const payload = await readPayload(request)
    const searchParams = request.nextUrl.searchParams

    const topic = payload.type || payload.topic || searchParams.get('topic')
    const id = payload.data?.id || payload.id || searchParams.get('id')

    if (!topic || !id) {
      return Response.json({ ok: true, ignored: true })
    }

    if (topic === 'payment') {
      const result = await processarPagamento(id)
      return Response.json({ ok: true, topic, ...result })
    }

    if (topic === 'merchant_order') {
      const result = await processarMerchantOrder(id)
      return Response.json({ ok: true, topic, ...result })
    }

    return Response.json({ ok: true, ignored: true, topic })
  } catch (erro) {
    console.error('Erro no webhook:', erro)
    return Response.json({ erro: 'Erro interno' }, { status: 500 })
  }
}
