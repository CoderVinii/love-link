'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { getPlano, parseMensagemPayload } from '../lib/presentePayload'

function PagamentoContent() {
  const params = useSearchParams()
  const id = params.get('id')
  const erro = params.get('erro')

  const [carregando, setCarregando] = useState(false)
  const [presente, setPresente] = useState(null)

  useEffect(() => {
    async function carregarPresente() {
      if (!id) return

      const { data } = await supabase
        .from('presentes')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      setPresente(data)
    }

    carregarPresente()
  }, [id])

  const plano = useMemo(() => {
    const payload = parseMensagemPayload(presente?.mensagem)
    return getPlano(payload.plano)
  }, [presente])

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
    <main className="grid min-h-screen place-items-center bg-[#fff7f7] px-5 py-10 text-[#201629]">
      <div className="w-full max-w-lg text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-pink-600">
          <span>💌</span>
          <span>Lovelink</span>
        </Link>

        <section className="mt-10 rounded-3xl border border-rose-100 bg-white p-10 shadow-xl shadow-rose-100/70">
          <div className="text-6xl">{erro ? '😔' : '💳'}</div>
          <h1 className="mt-5 text-3xl font-black">
            {erro ? 'Pagamento não concluído' : 'Quase lá! 🎉'}
          </h1>
          <p className="mt-3 leading-7 text-slate-500">
            {erro ? 'Não se preocupe! Sua retrospectiva foi salva. Tente pagar novamente.' : 'Sua retrospectiva foi criada. Pague agora para liberar o link final.'}
          </p>

          <Link href={`/preview/${id}`} className="mt-8 block rounded-full border border-rose-100 px-5 py-4 font-bold text-pink-600">
            👁️ Ver preview da retrospectiva
          </Link>

          <div className="my-5 rounded-2xl bg-rose-50 p-6">
            <p className="text-sm text-slate-500">Plano {plano.nome}</p>
            <p className="mt-2 text-5xl font-black text-pink-600">
              R$ {plano.preco.toFixed(2).replace('.', ',')}
            </p>
            <p className="mt-2 text-sm text-slate-500">{plano.acesso}</p>
          </div>

          <button
            onClick={handlePagamento}
            disabled={carregando}
            className="w-full rounded-full bg-[#009ee3] px-6 py-5 font-black text-white shadow-lg disabled:opacity-60"
          >
            {carregando ? 'Aguarde...' : '💳 Pagar com Mercado Pago'}
          </button>

          <p className="mt-5 text-sm text-slate-500">🔒 Pagamento 100% seguro via Mercado Pago</p>
        </section>

        <p className="mt-6 text-xs text-slate-300">Retrospectiva #{id}</p>
      </div>
    </main>
  )
}

export default function Pagamento() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PagamentoContent />
    </Suspense>
  )
}
