import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'
import { getPlano, parseMensagemPayload } from '../../lib/presentePayload'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const mercadoPagoAccessToken = process.env.MP_ACCESS_TOKEN

const client = new MercadoPagoConfig({
  accessToken: mercadoPagoAccessToken,
})

function getBaseUrl() {
  return process.env.BASE_URL || 'http://localhost:3000'
}

function getCheckoutUrl(preference) {
  if (mercadoPagoAccessToken?.startsWith('TEST-')) {
    return preference.sandbox_init_point || preference.init_point
  }

  return preference.init_point
}

export async function POST(request) {
  try {
    const body = await request.json()
    const presenteId = Number(body.presenteId)

    if (!Number.isInteger(presenteId) || presenteId <= 0) {
      return Response.json({ erro: 'presenteId inválido' }, { status: 400 })
    }

    const baseUrl = getBaseUrl()

    const { data: presente, error: erroPresente } = await supabase
      .from('presentes')
      .select('id, nome_remetente, nome_destinatario, mensagem')
      .eq('id', presenteId)
      .maybeSingle()

    if (erroPresente || !presente) {
      console.error('Erro ao buscar presente:', erroPresente)
      return Response.json({ erro: 'Presente não encontrado' }, { status: 404 })
    }

    const { data: pagamento, error: erroInsert } = await supabase
      .from('pagamentos')
      .insert({
        presente_id: presenteId,
        status: 'pending',
      })
      .select()
      .single()

    if (erroInsert) {
      console.error('Erro ao criar pagamento:', erroInsert)
      return Response.json({ erro: 'Erro ao criar pagamento' }, { status: 500 })
    }

    const externalReference = JSON.stringify({
      pagamentoId: pagamento.id,
      presenteId,
    })

    const preference = new Preference(client)
    const dadosPresente = parseMensagemPayload(presente.mensagem)
    const plano = getPlano(dadosPresente.plano)
    const resultado = await preference.create({
      body: {
        items: [
          {
            id: String(presenteId),
            title: `Lovelink - Presente para ${presente.nome_destinatario || 'alguém especial'}`,
            description: 'Carta digital personalizada com fotos e música',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: plano.preco,
          },
        ],
        back_urls: {
          success: `${baseUrl}/presente/${presenteId}`,
          failure: `${baseUrl}/pagamento?id=${presenteId}&erro=1`,
          pending: `${baseUrl}/pagamento?id=${presenteId}&pendente=1`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhook-pagamento`,
        external_reference: externalReference,
        metadata: {
          pagamento_id: pagamento.id,
          presente_id: presenteId,
        },
      },
    })

    const { error: erroUpdate } = await supabase
      .from('pagamentos')
      .update({
        mercadopago_id: resultado.id,
        status: 'pending',
      })
      .eq('id', pagamento.id)

    if (erroUpdate) {
      console.error('Erro ao atualizar pagamento:', erroUpdate)
    }

    return Response.json({
      url: getCheckoutUrl(resultado),
      preferenceId: resultado.id,
    })
  } catch (erro) {
    console.error('Erro geral ao criar pagamento:', erro)

    return Response.json(
      { erro: 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}
