'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getPlano, parseMensagemPayload } from '../lib/presentePayload'

function PagamentoContent() {
  const params = useSearchParams()
  const id = params.get('id')
  const erroRetorno = params.get('erro')
  const pendente = params.get('pendente')

  const [carregando, setCarregando] = useState(false)
  const [carregandoPresente, setCarregandoPresente] = useState(true)
  const [erro, setErro] = useState('')
  const [presente, setPresente] = useState(null)

  useEffect(() => {
    async function carregarPresente() {
      if (!id) {
        setCarregandoPresente(false)
        return
      }

      let data = null
      let error = null

      try {
        const res = await fetch(`/api/presente/${id}`, { cache: 'no-store' })
        const body = await res.json()

        if (!res.ok) {
          throw new Error(body.erro || 'Nao foi possivel carregar a retrospectiva.')
        }

        data = body.presente
      } catch (err) {
        error = err
      }

      if (error) {
        setErro('Não foi possível carregar a retrospectiva.')
      }

      setPresente(data)
      setCarregandoPresente(false)
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
    setErro('')

    try {
      const res = await fetch('/api/criar-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presenteId: id }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.erro || 'Erro ao criar pagamento.')
      }

      window.location.href = data.url
    } catch (e) {
      console.error('Erro ao criar pagamento:', e)
      setErro(e.message || 'Erro de conexão. Tente novamente.')
      setCarregando(false)
    }
  }

  if (carregandoPresente) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fff7f7] px-5 text-pink-600">
        Carregando pagamento...
      </main>
    )
  }

  if (!id || !presente) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fff7f7] px-5 text-center text-[#201629]">
        <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 shadow-xl shadow-rose-100">
          <h1 className="text-2xl font-black">Retrospectiva não encontrada</h1>
          <p className="mt-3 text-slate-600">Crie uma nova surpresa e tente novamente.</p>
          <Link href="/criar/plano" className="mt-6 inline-flex rounded-xl bg-[#d85f7a] px-5 py-3 font-bold text-white">
            Criar uma nova
          </Link>
        </div>
      </main>
    )
  }

  const estado = erroRetorno ? 'erro' : pendente ? 'pendente' : 'normal'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff7f7] px-5 py-10 text-[#201629]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(216,95,122,0.16),transparent_26%),radial-gradient(circle_at_85%_28%,rgba(244,114,182,0.13),transparent_28%),linear-gradient(180deg,#fff7f7_0%,#fff1f3_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-pink-600">
              <span aria-hidden="true">♡</span>
              <span>Lovelink</span>
            </Link>

            <p className="mt-10 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">
              {estado === 'erro' ? 'Pagamento não concluído' : estado === 'pendente' ? 'Pagamento pendente' : 'Checkout seguro'}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              {estado === 'erro' ? 'Sua retrospectiva continua salva' : estado === 'pendente' ? 'Estamos aguardando a confirmação' : 'Falta só liberar o presente'}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 lg:mx-0">
              {estado === 'erro'
                ? 'O Mercado Pago não confirmou essa tentativa. Você pode abrir a prévia ou tentar pagar novamente com outro meio.'
                : estado === 'pendente'
                  ? 'Assim que o Mercado Pago aprovar, o link final ficará disponível automaticamente.'
                  : 'Pague pelo Mercado Pago para remover a marca d’água e liberar o link final da retrospectiva.'}
            </p>

            {(erro || erroRetorno) && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-white px-5 py-4 text-sm font-semibold text-red-700 shadow-sm">
                {erro || 'O checkout não confirmou o pagamento. Tente novamente ou escolha outro meio.'}
              </div>
            )}
          </section>

          <section className="rounded-[1.75rem] border border-rose-100 bg-white p-5 shadow-2xl shadow-rose-100/80 sm:p-8">
            <div className="rounded-2xl bg-[#201629] p-6 text-center text-white">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-3xl">
                <span aria-hidden="true">{estado === 'erro' ? '!' : 'R$'}</span>
              </div>
              <h2 className="mt-5 text-2xl font-black">
                {estado === 'erro' ? 'Tentar novamente' : 'Pagamento da retrospectiva'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Retrospectiva #{id} · Plano {plano.nome}
              </p>
            </div>

            <div className="my-5 rounded-2xl bg-rose-50 p-6 text-center">
              <p className="text-sm font-semibold text-slate-500">Total</p>
              <p className="mt-2 text-5xl font-black text-pink-600">
                R$ {plano.preco.toFixed(2).replace('.', ',')}
              </p>
              <p className="mt-2 text-sm text-slate-500">{plano.acesso}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link href={`/preview/${id}`} className="rounded-xl border border-rose-100 px-5 py-4 text-center font-bold text-pink-600">
                Ver prévia
              </Link>
              <button
                type="button"
                onClick={handlePagamento}
                disabled={carregando}
                className="rounded-xl bg-[#009ee3] px-6 py-4 font-black text-white shadow-lg disabled:opacity-60"
              >
                {carregando ? 'Abrindo...' : 'Pagar agora'}
              </button>
            </div>

            <p className="mt-5 text-center text-sm text-slate-500">Pagamento seguro via Mercado Pago</p>
          </section>
        </div>
      </div>
    </main>
  )
}

export default function Pagamento() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#fff7f7] text-pink-600">Carregando...</main>}>
      <PagamentoContent />
    </Suspense>
  )
}
