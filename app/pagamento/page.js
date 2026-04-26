'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PagamentoContent() {
  const params = useSearchParams()
  const id = params.get('id')
  const erro = params.get('erro')

  const [carregando, setCarregando] = useState(false)

  async function handlePagamento() {
    if (carregando) return

    setCarregando(true)

    try {
      const res = await fetch('/api/criar-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presenteId: id,
          timestamp: Date.now()
        })
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erro ao criar pagamento. Tente novamente.')
      }
    } catch (e) {
      console.error('Erro ao criar pagamento:', e)
      alert('Erro de conexão. Tente novamente.')
    }

    setCarregando(false)
  }

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
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '22px' }}>💌</span>
          <span style={{
            fontWeight: '800',
            fontSize: '22px',
            color: '#e91e8c',
            marginLeft: '8px'
          }}>
            Lovelink
          </span>
        </Link>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid #fce7f3',
          boxShadow: '0 4px 24px rgba(233,30,140,0.08)',
          marginTop: '40px'
        }}>
          {erro ? (
            <>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>😔</div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#1a1a2e',
                marginBottom: '8px'
              }}>
                Pagamento não concluído
              </h2>
              <p style={{
                color: '#9ca3af',
                fontSize: '15px',
                marginBottom: '32px'
              }}>
                Não se preocupe! Seu presente foi salvo. Tente pagar novamente.
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>💳</div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#1a1a2e',
                marginBottom: '8px'
              }}>
                Quase lá! 🎉
              </h2>
              <p style={{
                color: '#9ca3af',
                fontSize: '15px',
                marginBottom: '32px'
              }}>
                Seu presente foi criado! Pague agora para liberar o link.
              </p>
            </>
          )}

          <Link
            href={`/preview/${id}`}
            style={{
              display: 'block',
              padding: '14px',
              borderRadius: '999px',
              border: '2px solid #fce7f3',
              color: '#e91e8c',
              fontWeight: '600',
              fontSize: '15px',
              textDecoration: 'none',
              marginBottom: '12px'
            }}
          >
            👁️ Ver preview do presente
          </Link>

          <div style={{
            backgroundColor: '#fff5f7',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Total a pagar</p>
            <p style={{
              fontSize: '40px',
              fontWeight: '800',
              color: '#e91e8c',
              margin: '4px 0'
            }}>
              R$ 19,90
            </p>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>
              pagamento único • acesso vitalício
            </p>
          </div>

          <button
            onClick={handlePagamento}
            disabled={carregando}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: carregando ? '#7dd3fc' : '#009ee3',
              color: 'white',
              fontWeight: '700',
              fontSize: '16px',
              cursor: carregando ? 'not-allowed' : 'pointer',
              marginBottom: '16px'
            }}
          >
            {carregando ? 'Aguarde...' : '💳 Pagar com Mercado Pago'}
          </button>

          <p style={{ color: '#9ca3af', fontSize: '13px' }}>
            🔒 Pagamento 100% seguro via Mercado Pago
          </p>
        </div>

        <p style={{
          color: '#d1d5db',
          fontSize: '12px',
          marginTop: '16px'
        }}>
          Presente #{id}
        </p>
      </div>
    </div>
  )
}

export default function Pagamento() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PagamentoContent />
    </Suspense>
  )
}
