import Link from 'next/link'
import { PLANOS } from './lib/presentePayload'

const passos = [
  ['01', 'Escolha o plano', 'Básico ou Premium, antes de iniciar o formulário.'],
  ['02', 'Conte a história', 'Adicione nomes, data e uma dedicatória para a pessoa especial.'],
  ['03', 'Monte os momentos', 'Envie de 3 a 8 fotos e ajuste os capítulos da retrospectiva.'],
  ['04', 'Libere o link', 'Pague com Mercado Pago e compartilhe o presente final.'],
]

const beneficios = [
  ['Emocional', 'Um presente digital com ritmo de retrospectiva, feito para abrir no celular.'],
  ['Personalizado', 'Nomes, data, mensagem, fotos e plano ficam salvos em uma página única.'],
  ['Prático', 'O fluxo guia a criação e leva direto para o pagamento quando tudo estiver pronto.'],
]

const perguntas = [
  ['Quantas fotos posso usar?', 'O plano Básico aceita até 5 fotos. O Premium aceita até 8 fotos. O mínimo para finalizar é 3 fotos.'],
  ['A música já funciona?', 'Ainda não. A etapa está no fluxo, mas permanece sem funcionalidade por enquanto.'],
  ['O presente abre antes do pagamento?', 'A prévia abre com marca d’água. O link final só é liberado depois do pagamento aprovado.'],
  ['Posso enviar pelo WhatsApp?', 'Sim. Depois do pagamento, você compartilha o link público da retrospectiva.'],
]

function PlanoHome({ id, plano }) {
  return (
    <article className={`flex h-full flex-col rounded-2xl border bg-white p-7 shadow-lg shadow-rose-100/60 ${id === 'premium' ? 'border-pink-200' : 'border-rose-100'}`}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-black">{plano.nome}</h3>
        {id === 'premium' && (
          <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-pink-600">
            Popular
          </span>
        )}
      </div>
      <p className="mt-4 text-4xl font-black text-pink-600">
        R$ {plano.preco.toFixed(2).replace('.', ',')}
      </p>
      <div className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
        <p>Até {plano.fotos} fotos</p>
        <p>{plano.acesso}</p>
        <p>{plano.musica}</p>
      </div>
      <Link href={`/criar/plano?plano=${id}`} className="mt-7 inline-flex justify-center rounded-xl bg-[#d85f7a] px-5 py-3 font-bold text-white shadow-lg shadow-rose-100">
        Escolher {plano.nome}
      </Link>
    </article>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff7f7] text-[#201629]">
      <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-black text-pink-600">
            <span aria-hidden="true">♡</span>
            <span>Lovelink</span>
          </Link>
          <Link href="/criar/plano" className="rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-100">
            Criar retrospectiva
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:pb-20 md:pt-20">
        <div className="text-center md:text-left">
          <p className="mx-auto mb-5 w-fit rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-pink-600 shadow-sm md:mx-0">
            Presente digital romântico
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:mx-0 md:text-6xl">
            Surpreenda quem você ama com uma retrospectiva feita só para vocês
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 md:mx-0 md:text-lg">
            Crie uma página personalizada com fotos, mensagem, data do relacionamento e um link final liberado após o pagamento.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link href="/criar/plano" className="rounded-full bg-[#d85f7a] px-7 py-4 font-bold text-white shadow-xl shadow-rose-100">
              Começar agora
            </Link>
            <a href="#planos" className="rounded-full border border-rose-100 bg-white px-7 py-4 font-bold text-slate-600">
              Ver planos
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-2xl border border-rose-100 bg-white p-4 shadow-2xl shadow-rose-100">
          <div className="rounded-2xl bg-[#0a0811] px-7 py-9 text-center text-white">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-300">Nossa história</p>
            <div className="mx-auto my-8 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-fuchsia-500 text-5xl shadow-inner">
              ♡
            </div>
            <p className="font-serif text-4xl">183 dias</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Cada foto vira um capítulo. Cada frase vira memória.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 px-2 py-5 text-center text-[11px] font-bold text-slate-500">
            <span>FOTOS</span>
            <span>TEXTO</span>
            <span>PREVIEW</span>
            <span>LINK</span>
          </div>
        </div>
      </section>

      <section className="border-y border-rose-100 bg-white/75 px-5 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
          {[
            ['3+', 'fotos mínimas'],
            ['8', 'fotos no Premium'],
            ['100%', 'online'],
            ['MP', 'pagamento seguro'],
          ].map(([numero, label]) => (
            <div key={label}>
              <p className="text-2xl font-black">{numero}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="planos" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Planos</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Escolha antes de criar</h2>
          <p className="mt-4 leading-7 text-slate-600">
            O fluxo já começa com o plano selecionado e aplica automaticamente o limite de fotos.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {Object.entries(PLANOS).map(([id, plano]) => (
            <PlanoHome key={id} id={id} plano={plano} />
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Como funciona</p>
          <h2 className="mt-3 text-center text-3xl font-black sm:text-4xl">Crie em 4 passos</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {passos.map(([numero, titulo, texto]) => (
              <article key={numero} className="rounded-2xl border border-rose-100 bg-[#fffafa] p-6">
                <p className="text-3xl font-black text-pink-200">{numero}</p>
                <h3 className="mt-4 font-black">{titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {beneficios.map(([titulo, texto]) => (
            <article key={titulo} className="rounded-2xl border border-rose-100 bg-white p-7 text-center shadow-lg shadow-rose-100/50">
              <h3 className="font-black">{titulo}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fff0ed] px-5 py-16 md:py-20">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Dúvidas</p>
        <h2 className="mt-3 text-center text-3xl font-black sm:text-4xl">Perguntas frequentes</h2>
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {perguntas.map(([pergunta, resposta]) => (
            <details key={pergunta} className="rounded-xl border border-rose-100 bg-white p-5">
              <summary className="cursor-pointer font-bold">{pergunta}</summary>
              <p className="mt-3 leading-7 text-slate-600">{resposta}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 text-center md:py-20">
        <h2 className="text-3xl font-black sm:text-4xl">
          Pronto para emocionar <span className="text-pink-600">quem você ama?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-600">
          Comece pelo plano, preencha as etapas e receba um link exclusivo após o pagamento.
        </p>
        <Link href="/criar/plano" className="mt-8 inline-flex rounded-full bg-[#d85f7a] px-8 py-4 font-bold text-white shadow-xl shadow-rose-100">
          Criar minha retrospectiva
        </Link>
      </section>

      <footer className="border-t border-rose-100 px-5 py-10 text-center text-sm text-slate-500">
        <p className="font-black text-pink-600">Lovelink</p>
        <p className="mt-2">Feito com amor © 2026</p>
      </footer>
    </main>
  )
}
