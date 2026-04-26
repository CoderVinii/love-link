import { MercadoPagoConfig, MerchantOrder, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'

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

async function liberarPresente({ pagamentoId, presenteId, status = 'approved' }) {
  if (pagamentoId) {
    await supabaseAdmin
      .from('pagamentos')
      .update({ status })
      .eq('id', pagamentoId)
  }

  if (presenteId && status === 'approved') {
    await supabaseAdmin
      .from('presentes')
      .update({ pago: true })
      .eq('id', presenteId)
  }
}

async function liberarPorReferencia(reference, status) {
  const ids = parseExternalReference(reference)

  if (!ids?.pagamentoId || !ids?.presenteId) {
    return false
  }

  await liberarPresente({
    pagamentoId: ids.pagamentoId,
    presenteId: ids.presenteId,
    status,
  })

  return true
}

async function liberarPorPreferenceId(preferenceId, status) {
  if (!preferenceId) return false

  const { data: pagamento, error } = await supabaseAdmin
    .from('pagamentos')
    .select('id, presente_id')
    .eq('mercadopago_id', preferenceId)
    .maybeSingle()

  if (error || !pagamento) {
    console.error('Pagamento não encontrado para preferenceId:', preferenceId, error)
    return false
  }

  await liberarPresente({
    pagamentoId: pagamento.id,
    presenteId: pagamento.presente_id,
    status,
  })

  return true
}

async function processarPagamento(paymentId) {
  const payment = new Payment(client)
  const pagamento = await payment.get({ id: paymentId })
  const status = pagamento.status || 'unknown'

  await liberarPorReferencia(
    pagamento.external_reference,
    status
  )

  return { status }
}

async function processarMerchantOrder(merchantOrderId) {
  const merchantOrder = new MerchantOrder(client)
  const order = await merchantOrder.get({ merchantOrderId })
  const pagamentos = order.payments || []
  const pagamentoAprovado = pagamentos.find((pagamento) => pagamento.status === 'approved')
  const ultimoPagamento = pagamentoAprovado || pagamentos[pagamentos.length - 1]

  if (!ultimoPagamento) {
    return { status: order.order_status || order.status || 'without_payment' }
  }

  const status = ultimoPagamento.status || 'unknown'
  const liberouPorReferencia = await liberarPorReferencia(
    order.external_reference,
    status
  )

  if (!liberouPorReferencia) {
    await liberarPorPreferenceId(order.preference_id, status)
  }

  return { status }
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
