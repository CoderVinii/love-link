'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { calcularTempoJuntos, formatarData, getPlano, parseMensagemPayload } from '../lib/presentePayload'

function Watermark({ preview }) {
  if (!preview) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-20 opacity-20">
      <div className="grid h-full grid-cols-3 gap-10 overflow-hidden text-3xl font-black text-white sm:grid-cols-4">
        {Array.from({ length: 28 }).map((_, index) => (
          <span key={index} className="-rotate-45">Prévia</span>
        ))}
      </div>
    </div>
  )
}

function FloatingHearts() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="lovelink-floating-heart"
          style={{
            left: `${(index * 17) % 100}%`,
            top: `${8 + ((index * 23) % 78)}%`,
            animationDelay: `${index * -1.7}s`,
            animationDuration: `${14 + (index % 6) * 2}s`,
            opacity: 0.08 + (index % 5) * 0.018,
            '--heart-scale': 0.7 + (index % 5) * 0.18,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}

function Numero({ valor, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-lg shadow-black/20 backdrop-blur">
      <p className="font-serif text-3xl text-white sm:text-4xl">{valor}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
    </div>
  )
}

function Carousel({ momentos, activeIndex, setActiveIndex }) {
  if (momentos.length === 0) return null

  const ativo = momentos[activeIndex] || momentos[0]

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="grid items-center gap-8 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/40 backdrop-blur md:grid-cols-[0.92fr_1.08fr] md:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-pink-300">Galeria automática</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            {ativo.titulo}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
            {ativo.descricao}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {momentos.map((momento, index) => (
              <button
                key={`${momento.url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver momento ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-10 bg-pink-300' : 'w-2.5 bg-white/25 hover:bg-white/45'}`}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -inset-4 rounded-[2rem] bg-pink-500/10 blur-2xl" />
          <img
            src={ativo.url}
            alt={ativo.titulo}
            className="relative aspect-[4/5] max-h-[620px] w-full rounded-[1.5rem] object-cover shadow-2xl shadow-black/70"
          />
        </div>
      </div>
    </section>
  )
}

export default function RetrospectivaView({ presente, preview = false }) {
  const [agora, setAgora] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
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

  const tempo = calcularTempoJuntos(presente.data_relacionamento, agora)
  const plano = getPlano(payload.plano)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAgora(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (momentos.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % momentos.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [momentos.length])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070d] text-white">
      <FloatingHearts />
      <Watermark preview={preview} />

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_15%,rgba(216,95,122,0.14),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(244,114,182,0.09),transparent_26%),linear-gradient(180deg,#090911_0%,#05050a_52%,#09070e_100%)]" />

      {preview && (
        <div className="sticky top-0 z-30 bg-pink-600 px-4 py-3 text-center text-sm font-bold">
          Você está vendo uma prévia. A marca d&apos;água sai após o pagamento.
          <Link href={`/pagamento?id=${presente.id}`} className="ml-2 underline">Liberar agora</Link>
        </div>
      )}

      <section className="relative z-10 mx-auto flex min-h-[88vh] max-w-5xl flex-col items-center justify-center px-5 py-20 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.45em] text-pink-300">Nossa história</p>
        <h1 className="font-serif text-5xl leading-tight sm:text-6xl md:text-7xl">
          {presente.nome_remetente} & {presente.nome_destinatario}
        </h1>
        <p className="mt-6 max-w-2xl text-lg italic leading-8 text-slate-300">
          Uma jornada de amor e momentos inesquecíveis.
        </p>

        <div className="my-12 grid w-full max-w-3xl grid-cols-2 gap-3 border-y border-white/10 py-8 md:grid-cols-4">
          <Numero valor={tempo.dias} label="Dias" />
          <Numero valor={tempo.horas} label="Horas" />
          <Numero valor={tempo.minutos} label="Minutos" />
          <Numero valor={tempo.segundos} label="Segundos" />
        </div>

        <p className="rounded-full bg-white/10 px-5 py-3 text-sm text-slate-300 backdrop-blur">
          Começamos em {formatarData(presente.data_relacionamento) || 'uma data especial'}
        </p>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-5 py-12 text-center md:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-pink-300">Mensagem</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-9">
          <p className="text-xl italic leading-9 text-slate-100 sm:text-2xl">
            “{payload.texto || presente.mensagem || 'Eu te amo em cada detalhe da nossa história.'}”
          </p>
          <p className="mt-8 font-bold text-pink-300">- {presente.nome_remetente}</p>
        </div>
      </section>

      <Carousel momentos={momentos} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-14 md:py-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-pink-300">Capítulos</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Momentos que contam tudo</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {momentos.map((momento, index) => (
            <article key={`${momento.url}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-xl shadow-black/30 backdrop-blur">
              <img
                src={momento.url}
                alt={momento.titulo}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-pink-300">Capítulo {index + 1}</p>
                <h3 className="mt-3 font-serif text-3xl leading-tight">{momento.titulo}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{momento.descricao}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-5 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-pink-300">Nossa história continua</p>
        <h2 className="mt-6 font-serif text-5xl leading-tight sm:text-6xl md:text-7xl">E isso é só o começo...</h2>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
          Cada dia ao seu lado é uma nova oportunidade de escrever mais um capítulo juntos.
        </p>
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.055] p-7 shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Plano escolhido</p>
          <p className="mt-3 text-3xl font-black text-pink-300">{plano.nome}</p>
          <p className="mt-2 text-slate-400">{plano.acesso}</p>
        </div>
      </section>
    </main>
  )
}
