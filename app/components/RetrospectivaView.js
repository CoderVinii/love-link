'use client'

import Link from 'next/link'
import { calcularTempoJuntos, formatarData, getPlano, parseMensagemPayload } from '../lib/presentePayload'

function Watermark({ preview }) {
  if (!preview) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-10 opacity-20">
      <div className="grid h-full grid-cols-4 gap-10 overflow-hidden text-3xl font-black text-white">
        {Array.from({ length: 32 }).map((_, index) => (
          <span key={index} className="-rotate-45">Prévia</span>
        ))}
      </div>
    </div>
  )
}

function Numero({ valor, label }) {
  return (
    <div>
      <p className="font-serif text-5xl text-white">{valor}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
    </div>
  )
}

export default function RetrospectivaView({ presente, preview = false }) {
  const payload = parseMensagemPayload(presente.mensagem)
  const fotos = presente.fotos_urls
    ? presente.fotos_urls.split(',').map((url) => url.trim()).filter(Boolean)
    : []
  const momentos = fotos.map((url, index) => ({
    url,
    titulo: payload.momentos[index]?.titulo || `Momento ${index + 1}`,
    descricao: payload.momentos[index]?.descricao || 'Uma memória especial da nossa história.',
  }))
  const tempo = calcularTempoJuntos(presente.data_relacionamento)
  const plano = getPlano(payload.plano)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070d] text-white">
      <Watermark preview={preview} />

      {preview && (
        <div className="sticky top-0 z-20 bg-pink-600 px-4 py-3 text-center text-sm font-bold">
          Você está vendo uma prévia. A marca d&apos;água sai após o pagamento.
          <Link href={`/pagamento?id=${presente.id}`} className="ml-2 underline">Liberar agora</Link>
        </div>
      )}

      <section className="relative z-0 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 py-24 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.45em] text-pink-300">Nossa história</p>
        <h1 className="font-serif text-6xl leading-tight md:text-8xl">
          {presente.nome_remetente} & {presente.nome_destinatario}
        </h1>
        <p className="mt-6 max-w-2xl text-xl italic leading-9 text-slate-300">
          Uma jornada de amor e momentos inesquecíveis.
        </p>

        <div className="my-16 grid w-full max-w-3xl grid-cols-2 gap-6 border-y border-white/10 py-10 md:grid-cols-4">
          <Numero valor={tempo.dias} label="Dias" />
          <Numero valor={tempo.horas} label="Horas" />
          <Numero valor={tempo.minutos} label="Minutos" />
          <Numero valor={tempo.segundos} label="Segundos" />
        </div>

        <p className="rounded-full bg-white/10 px-5 py-3 text-sm text-slate-300">
          Começamos em {formatarData(presente.data_relacionamento) || 'uma data especial'}
        </p>
      </section>

      <section className="relative z-0 mx-auto max-w-4xl px-5 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-pink-300">Mensagem</p>
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 shadow-2xl shadow-black/40">
          <p className="text-2xl italic leading-10 text-slate-100">
            “{payload.texto || presente.mensagem || 'Eu te amo em cada detalhe da nossa história.'}”
          </p>
          <p className="mt-8 font-bold text-pink-300">- {presente.nome_remetente}</p>
        </div>
      </section>

      {momentos.map((momento, index) => (
        <section key={momento.url} className="relative z-0 mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-24 md:grid-cols-2">
          <div className={index % 2 === 0 ? 'md:order-1' : 'md:order-2'}>
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-pink-300">Capítulo {index + 1}</p>
            <h2 className="font-serif text-5xl leading-tight md:text-7xl">{momento.titulo}</h2>
            <p className="mt-8 text-xl leading-9 text-slate-300">{momento.descricao}</p>
          </div>
          <div className={index % 2 === 0 ? 'md:order-2' : 'md:order-1'}>
            <img
              src={momento.url}
              alt={momento.titulo}
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl shadow-black/60"
            />
          </div>
        </section>
      ))}

      <section className="relative z-0 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-5 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-pink-300">Nossa história continua</p>
        <h2 className="mt-6 font-serif text-6xl leading-tight md:text-8xl">E isso é só o começo...</h2>
        <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-300">
          Cada dia ao seu lado é uma nova oportunidade de escrever mais um capítulo juntos.
        </p>
        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Plano escolhido</p>
          <p className="mt-3 text-3xl font-black text-pink-300">{plano.nome}</p>
          <p className="mt-2 text-slate-400">{plano.acesso}</p>
        </div>
      </section>
    </main>
  )
}
