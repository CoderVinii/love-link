'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Pagamento() {
  // useSearchParams lê os parâmetros da URL
  // ex: /pagamento?id=4 → params.get('id') retorna "4"
  const params = useSearchParams()
  const id = params.get('id')

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff5f7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '22px' }}>💌</span>
          <span style={{
            fontWeight: '800', fontSize: '22px',
            color: '#e91e8c', marginLeft: '8px'
          }}>
            Lovelink
          </span>
        </Link>

        {/* Card principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid #fce7f3',
          boxShadow: '0 4px 24px rgba(233,30,140,0.08)',
          marginTop: '40px'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>💳</div>

          <h2 style={{
            fontSize: '24px', fontWeight: '800',
            color: '#1a1a2e', marginBottom: '8px'
          }}>
            Quase lá! 🎉
          </h2>

          <p style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '32px' }}>
            Seu presente foi criado com sucesso. Agora é só pagar para liberar o link!
          </p>

          {/* Resumo do valor */}
          <div style={{
            backgroundColor: '#fff5f7',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px'
          }}>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Total a pagar</p>
            <p style={{
              fontSize: '40px', fontWeight: '800',
              color: '#e91e8c', margin: '4px 0'
            }}>
              R$ 19,90
            </p>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>pagamento único • acesso vitalício</p>
          </div>

          {/* Botão do Mercado Pago — por enquanto simulado */}
          <button
            onClick={() => alert('Em breve: integração com Mercado Pago! ID do presente: ' + id)}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: '#009ee3', // cor oficial do Mercado Pago
              color: 'white',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            💳 Pagar com Mercado Pago
          </button>

          <p style={{ color: '#9ca3af', fontSize: '13px' }}>
            🔒 Pagamento 100% seguro via Mercado Pago
          </p>

        </div>

        {/* ID do presente para debug */}
        <p style={{ color: '#d1d5db', fontSize: '12px', marginTop: '16px' }}>
          Presente #{id}
        </p>

      </div>
    </div>
  )
}