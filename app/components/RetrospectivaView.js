'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { calcularSigno, calcularTempoJuntos, formatarData, getPlano, parseMensagemPayload } from '../lib/presentePayload'
import FallingHearts from './FallingHearts'

function Watermark({ preview }) {
  if (!preview) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-20 opacity-20">
      <div className="grid h-full grid-cols-3 gap-10 overflow-hidden text-3xl font-black text-pink-900 sm:grid-cols-4">
        {Array.from({ length: 28 }).map((_, index) => (
          <span key={index} className="-rotate-45">Prévia</span>
        ))}
      </div>
    </div>
  )
}

function Numero({ valor, label }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-4 text-center shadow-sm">
      <p className="font-serif text-3xl text-[#251629] sm:text-4xl">{valor}</p>
      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{label}</p>
    </div>
  )
}

function IntroOverlay({ aberto, onOpen, remetente }) {
  if (aberto) return null

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-rose-950/20 px-5 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-2xl shadow-rose-200">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-4xl text-white shadow-xl shadow-rose-200">
          ♥
        </div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-pink-500">Presente especial</p>
        <h1 className="mt-3 text-3xl font-black leading-tight text-[#251629]">Você recebeu um presente</h1>
        <p className="mt-4 leading-7 text-slate-600">
          {remetente} preparou uma retrospectiva romântica só para você.
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="lovelink-gradient-button mt-7 w-full rounded-full px-6 py-4 font-black text-white transition hover:-translate-y-0.5"
        >
          Abrir presente
        </button>
      </div>
    </div>
  )
}

export default function RetrospectivaView({ presente, preview = false }) {
  const [agora, setAgora] = useState(0)
  const [aberto, setAberto] = useState(preview)
  const payload = useMemo(() => parseMensagemPayload(presente.mensagem), [presente.mensagem])
  const fotos = useMemo(() => (
    presente.fotos_urls
      ? presente.fotos_urls.split(',').map((url) => url.trim()).filter(Boolean)
      : []
  ), [presente.fotos_urls])

  const momentos = useMemo(() => fotos.map((url, index) => ({
    url,
    titulo: payload.momentos[index]?.titulo || `Momento ${index + 1}`,
    descricao: payload.momentos[index]?.descricao || 'Uma memória especial da nossa história.',
  })), [fotos, payload.momentos])
  const signo = useMemo(() => {
    if (payload.extras?.ocultarSigno) return ''
    return calcularSigno(presente.data_relacionamento)
  }, [payload.extras?.ocultarSigno, presente.data_relacionamento])

  const tempo = calcularTempoJuntos(presente.data_relacionamento, agora)
  const plano = getPlano(payload.plano)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAgora(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_8%,rgba(244,114,182,0.2),transparent_30%),linear-gradient(180deg,#fff7f8_0%,#ffe8ee_45%,#fff8f8_100%)] text-[#251629]">
      <FallingHearts count={18} />
      <Watermark preview={preview} />
      {!preview && <IntroOverlay aberto={aberto} remetente={presente.nome_remetente} onOpen={() => setAberto(true)} />}

      {preview && (
        <div className="sticky top-0 z-30 bg-pink-600 px-4 py-3 text-center text-sm font-bold text-white">
          Você está vendo uma prévia. A marca d&apos;água sai após o pagamento.
          <Link href={`/pagamento?id=${presente.id}`} className="ml-2 underline">Liberar agora</Link>
        </div>
      )}

      <div className={`relative z-10 mx-auto max-w-5xl px-5 py-10 transition ${!preview && !aberto ? 'scale-[0.98] opacity-40' : 'scale-100 opacity-100'}`}>
        <section className="rounded-[2rem] border border-rose-100 bg-white/90 p-5 shadow-2xl shadow-rose-200/70 backdrop-blur sm:p-8 md:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-pink-500">Nossa história</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              {presente.nome_remetente}
              <span className="block text-pink-600">&</span>
              {presente.nome_destinatario}
            </h1>
            <p className="mt-5 text-sm font-semibold text-slate-500">
              Desde {formatarData(presente.data_relacionamento) || 'uma data especial'}
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            <Numero valor={tempo.dias} label="Dias" />
            <Numero valor={tempo.horas} label="Horas" />
            <Numero valor={tempo.minutos} label="Minutos" />
            <Numero valor={tempo.segundos} label="Segundos" />
          </div>

          {!preview && signo && (
            <div className="mx-auto mt-6 max-w-3xl rounded-[1.5rem] border border-pink-100 bg-white/90 p-5 text-center shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-pink-500">Signo do começo</p>
              <p className="mt-2 text-xl font-black text-[#251629]">{signo}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Este é o signo associado à data de início do relacionamento.
              </p>
            </div>
          )}

          <div className="mx-auto mt-8 max-w-3xl rounded-[1.5rem] bg-rose-50 p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-pink-500">Mensagem</p>
            <p className="mt-4 text-xl italic leading-9 text-[#251629] sm:text-2xl">
              “{payload.texto || presente.mensagem || 'Eu te amo em cada detalhe da nossa história.'}”
            </p>
            <p className="mt-6 font-black text-pink-600">- {presente.nome_remetente}</p>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mb-7 text-center">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-pink-500">Momentos</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Capítulos que viraram presente</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {momentos.map((momento, index) => (
              <article key={`${momento.url}-${index}`} className="overflow-hidden rounded-[1.5rem] border border-rose-100 bg-white shadow-xl shadow-rose-100/70">
                <img
                  src={momento.url}
                  alt={momento.titulo}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-pink-500">Capítulo {index + 1}</p>
                  <h3 className="mt-3 text-2xl font-black leading-tight">{momento.titulo}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{momento.descricao}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mb-8 max-w-3xl rounded-[2rem] border border-rose-100 bg-white/90 p-7 text-center shadow-xl shadow-rose-100 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-pink-500">Nossa história continua</p>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl">E isso é só o começo...</h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
            Cada dia ao seu lado é uma nova oportunidade de escrever mais um capítulo juntos.
          </p>
          <div className="mx-auto mt-7 w-fit rounded-2xl bg-rose-50 px-6 py-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Plano escolhido</p>
            <p className="mt-2 text-xl font-black text-pink-600">{plano.nome}</p>
            <p className="mt-1 text-sm text-slate-500">{plano.acesso}</p>
          </div>
        </section>
      </div>
    </main>
  )
}
