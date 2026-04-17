// app/api/criar-pagamento/route.js

import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'

// 🔐 Supabase client (server)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ IMPORTANTE (não usar anon aqui)
)

// 💳 Mercado Pago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
})

export async function POST(request) {
  try {
    const body = await request.json()
    const { presenteId } = body

    console.log('📥 Recebido presenteId:', presenteId)

    // 🔒 Validação básica
    if (!presenteId) {
      return Response.json({ erro: 'presenteId obrigatório' }, { status: 400 })
    }

    // 🌍 URL base
    const baseUrl =
      process.env.BASE_URL || 'http://localhost:3000'

    // 🧱 1. Criar pagamento no banco (pending)
    const { data: pagamento, error: erroInsert } = await supabase
      .from('pagamentos')
      .insert([
        {
          presente_id: presenteId,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (erroInsert) {
      console.error('❌ Erro ao criar pagamento:', erroInsert)
      return Response.json({ erro: 'Erro ao criar pagamento' }, { status: 500 })
    }

    console.log('✅ Pagamento criado no banco:', pagamento.id)

    // 💳 2. Criar preferência no Mercado Pago
    const preference = new Preference(client)

    const resultado = await preference.create({
  body: {
    payer: {
      email: 'test_user_123@testuser.com',
    },
        items: [
          {
            title: 'Lovelink — Presente Personalizado',
            quantity: 1,
            unit_price: 19.9,
          },
        ],

        back_urls: {
          success: `${baseUrl}/presente/${presenteId}`,
          failure: `${baseUrl}/pagamento?id=${presenteId}&erro=1`,
          pending: `${baseUrl}/pagamento?id=${presenteId}&pendente=1`,
        },

        auto_return: 'approved',

        notification_url: `${baseUrl}/api/webhook-pagamento`,

        // 🔥 AGORA USAMOS O ID DO PAGAMENTO
        external_reference: String(pagamento.id),
      },
    })

    console.log('💳 Preference criada:', resultado.id)

    // 🧱 3. Atualizar pagamento com ID do Mercado Pago
    const { error: erroUpdate } = await supabase
      .from('pagamentos')
      .update({
        mercadopago_id: resultado.id,
      })
      .eq('id', pagamento.id)

    if (erroUpdate) {
      console.error('⚠️ Erro ao atualizar pagamento:', erroUpdate)
    }

    // 🚀 Retorno final
    return Response.json({
      url: resultado.init_point,
    })
  } catch (erro) {
    console.error('🔥 ERRO GERAL:', erro)

    return Response.json(
      { erro: 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}