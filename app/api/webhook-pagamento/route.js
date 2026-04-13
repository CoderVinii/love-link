// app/api/webhook-pagamento/route.js
// O Mercado Pago chama essa URL automaticamente quando um pagamento é confirmado
// Aqui atualizamos o banco de dados para liberar o presente

import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
})

// Usamos a service_role aqui pois é servidor — tem permissão total
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()

    // O Mercado Pago envia vários tipos de notificação
    // Só nos interessa quando um pagamento é aprovado
    if (body.type !== 'payment') {
      return Response.json({ ok: true })
    }

    const payment = new Payment(client)
    const pagamento = await payment.get({ id: body.data.id })

    if (pagamento.status === 'approved') {
     const presenteId = parseInt(pagamento.external_reference)

      // Atualiza o campo "pago" para true no Supabase
     await supabaseAdmin
        .from('presentes')
        .update({ pago: true })
        .eq('id', presenteId)
    }

    return Response.json({ ok: true })

  } catch (erro) {
    console.error('Erro no webhook:', erro)
    return Response.json({ erro: 'Erro interno' }, { status: 500 })
  }
}