// app/api/criar-pagamento/route.js

import { MercadoPagoConfig, Preference } from 'mercadopago'

// Cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
})

export async function POST(request) {
  try {
    const { presenteId } = await request.json()

    // URL base segura
    const baseUrl =
      process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    console.log('BASE URL:', baseUrl)
    console.log('PRESENTE ID:', presenteId)

    const preference = new Preference(client)

    const resultado = await preference.create({
      body: {
        items: [
          {
            title: 'Lovelink — Presente Personalizado',
            quantity: 1,
            unit_price: 19.9,
          },
        ],

        // 🔥 URLs funcionando
        back_urls: {
          success: `${baseUrl}/presente/${presenteId}`,
          failure: `${baseUrl}/pagamento?id=${presenteId}&erro=1`,
          pending: `${baseUrl}/pagamento?id=${presenteId}&pendente=1`,
        },

        // ❌ REMOVIDO (causava o erro)
        // auto_return: 'approved',

        notification_url: `${baseUrl}/api/webhook-pagamento`,

        external_reference: `${presenteId}-${Date.now()}`,
      },
    })

    return Response.json({
      url: resultado.init_point,
    })
  } catch (erro) {
    console.error('🔥 ERRO REAL:', erro)

    return Response.json(
      { erro: 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}