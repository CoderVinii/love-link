import Link from 'next/link'
import FallingHearts from './components/FallingHearts'
import { PLANOS } from './lib/presentePayload'

const passos = [
  ['01', 'Escolha o plano', 'Defina se a surpresa será essencial ou completa antes de começar.'],
  ['02', 'Conte a história', 'Adicione nomes, data e uma mensagem que tenha a cara de vocês.'],
  ['03', 'Monte os momentos', 'Envie de 3 a 8 fotos e ajuste cada capítulo da retrospectiva.'],
  ['04', 'Libere o presente', 'Pague com Mercado Pago e receba um link exclusivo para compartilhar.'],
]

const beneficios = [
  ['Feito para emocionar', 'Uma página íntima, com fotos, texto e memória em uma experiência só.'],
  ['Rápido de criar', 'O fluxo guia tudo em poucos minutos, sem depender de design ou código.'],
  ['Link exclusivo', 'Depois do pagamento, você recebe um link público e bonito para enviar.'],
  ['Prévia antes de pagar', 'Confira a retrospectiva com marca d’água antes de liberar o presente final.'],
  ['Fotos organizadas', 'Cada imagem vira um capítulo com título e descrição editáveis.'],
  ['Seguro e simples', 'Pagamento via Mercado Pago e liberação automática após aprovação.'],
]

const depoimentos = [
  ['“Ela abriu e ficou lendo cada parte com um sorriso enorme.”', 'Pedro S.'],
  ['“Parecia um presente caro, mas eu fiz tudo pelo celular.”', 'Ana L.'],
  ['“As fotos viraram uma história de verdade. Ficou lindo.”', 'Marina C.'],
]

const perguntas = [
  ['Quantas fotos posso usar?', 'O plano Básico aceita até 5 fotos. O Premium aceita até 8 fotos. O mínimo para finalizar é 3 fotos.'],
  ['A música já funciona?', 'Ainda não. A etapa aparece no fluxo, mas permanece como recurso em breve.'],
  ['O presente abre antes do pagamento?', 'A prévia abre com marca d’água. O link final é liberado depois do pagamento aprovado.'],
  ['Qual é a diferença entre os planos?', 'O Básico tem 1 dia de acesso. O Premium mantém a promessa atual de acesso vitalício ao QR Code e mais fotos.'],
]

function PlanoHome({ id, plano }) {
  const premium = id === 'premium'

  return (
    <article className={`lovelink-soft-card relative flex h-full flex-col rounded-[1.75rem] p-6 transition hover:-translate-y-1 ${premium ? 'ring-2 ring-pink-300/70' : ''}`}>
      {premium && (
        <span className="absolute right-5 top-5 rounded-full bg-pink-600 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
          Mais escolhido
        </span>
      )}
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-pink-500">{premium ? 'Completo' : 'Essencial'}</p>
      <h3 className="mt-3 text-2xl font-black">{plano.nome}</h3>
      <p className="mt-4 text-5xl font-black text-pink-600">
        R$ {plano.preco.toFixed(2).replace('.', ',')}
      </p>
      <div className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
        <p>✓ Até {plano.fotos} fotos</p>
        <p>✓ {plano.acesso}</p>
        <p>✓ {plano.musica}</p>
      </div>
      <Link href={`/criar/plano?plano=${id}`} className="lovelink-gradient-button mt-8 inline-flex justify-center rounded-full px-6 py-4 font-black text-white transition hover:-translate-y-0.5">
        Escolher {plano.nome}
      </Link>
    </article>
  )
}

function Mockup() {
  return (
    <div className="lovelink-soft-card relative mx-auto w-full max-w-[390px] rounded-[2rem] p-4">
      <div className="rounded-[1.6rem] bg-gradient-to-b from-[#2a1122] via-[#160b16] to-[#fff7f7] p-5 shadow-inner">
        <div className="rounded-[1.25rem] bg-white p-5 text-center shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-pink-500">Nossa história</p>
          <div className="mx-auto my-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-rose-500 text-5xl text-white shadow-xl shadow-pink-200">
            ♥
          </div>
          <p className="font-serif text-4xl text-[#241527]">183 dias</p>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">
            Cada foto vira um capítulo. Cada frase vira memória.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-white/85">
          <span>Fotos</span>
          <span>Mensagem</span>
          <span>Link</span>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ffe4ec_0%,transparent_34%),linear-gradient(180deg,#fff7f7_0%,#fff0f4_44%,#fffaf7_100%)] text-[#241527]">
      <FallingHearts count={22} />

      <header className="sticky top-0 z-40 border-b border-rose-100/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-black text-pink-600">
            <span aria-hidden="true">♥</span>
            <span>Lovelink</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-600 md:flex">
            <a href="#planos">Planos</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <Link href="/criar/plano" className="lovelink-gradient-button rounded-full px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
            Criar retrospectiva
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-20">
        <div className="text-center md:text-left">
          <p className="mx-auto mb-5 w-fit rounded-full border border-pink-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600 shadow-sm md:mx-0">
            Presente digital romântico
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.05] sm:text-5xl md:mx-0 md:text-6xl">
            Surpreenda quem você ama com uma retrospectiva feita só para vocês
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 md:mx-0 md:text-lg">
            Transforme fotos, datas e palavras em uma página romântica pronta para emocionar no celular.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link href="/criar/plano" className="lovelink-gradient-button rounded-full px-7 py-4 font-black text-white transition hover:-translate-y-0.5">
              Começar agora
            </Link>
            <a href="#planos" className="rounded-full border border-rose-100 bg-white px-7 py-4 font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5">
              Ver planos
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3 text-center md:max-w-xl">
            {[
              ['3+', 'fotos mínimas'],
              ['5 min', 'para criar'],
              ['100%', 'online'],
            ].map(([numero, label]) => (
              <div key={label} className="rounded-2xl border border-rose-100 bg-white/75 p-4 shadow-sm">
                <p className="text-2xl font-black text-pink-600">{numero}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <Mockup />
      </section>

      <section id="planos" className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-pink-500">Planos</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Escolha a intensidade da surpresa</h2>
          <p className="mt-4 leading-7 text-slate-600">O plano define o limite de fotos e o tempo de acesso. Você pode revisar tudo antes de pagar.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {Object.entries(PLANOS).map(([id, plano]) => (
            <PlanoHome key={id} id={id} plano={plano} />
          ))}
        </div>
      </section>

      <section id="como-funciona" className="relative z-10 bg-white/70 px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs font-black uppercase tracking-[0.28em] text-pink-500">Como funciona</p>
          <h2 className="mt-3 text-center text-3xl font-black sm:text-4xl">Do rascunho ao presente em 4 passos</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {passos.map(([numero, titulo, texto]) => (
              <article key={numero} className="rounded-[1.5rem] border border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/50">
                <p className="text-3xl font-black text-pink-200">{numero}</p>
                <h3 className="mt-4 font-black">{titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.map(([titulo, texto]) => (
            <article key={titulo} className="lovelink-soft-card rounded-[1.5rem] p-6">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-pink-100 text-pink-600">✦</div>
              <h3 className="mt-5 font-black">{titulo}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 bg-[#fff0f4] px-5 py-16 md:py-20">
        <p className="text-center text-xs font-black uppercase tracking-[0.28em] text-pink-500">Depoimentos</p>
        <h2 className="mt-3 text-center text-3xl font-black sm:text-4xl">Quem criou, guardou como memória</h2>
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {depoimentos.map(([texto, nome]) => (
            <article key={nome} className="rounded-[1.5rem] border border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/60">
              <p className="text-pink-500">★★★★★</p>
              <p className="mt-4 leading-7 text-slate-700">{texto}</p>
              <p className="mt-5 font-black text-pink-600">{nome}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="duvidas" className="relative z-10 mx-auto max-w-3xl px-5 py-16 md:py-20">
        <p className="text-center text-xs font-black uppercase tracking-[0.28em] text-pink-500">Dúvidas</p>
        <h2 className="mt-3 text-center text-3xl font-black sm:text-4xl">Perguntas frequentes</h2>
        <div className="mt-10 space-y-3">
          {perguntas.map(([pergunta, resposta]) => (
            <details key={pergunta} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-black">{pergunta}</summary>
              <p className="mt-3 leading-7 text-slate-600">{resposta}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-5 py-16 text-center md:py-20">
        <div className="lovelink-soft-card mx-auto max-w-4xl rounded-[2rem] p-8 sm:p-12">
          <h2 className="text-3xl font-black sm:text-5xl">
            Pronto para emocionar <span className="text-pink-600">quem você ama?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-600">
            Comece pelo plano, preencha as etapas e receba um link exclusivo após o pagamento.
          </p>
          <Link href="/criar/plano" className="lovelink-gradient-button mt-8 inline-flex rounded-full px-8 py-4 font-black text-white transition hover:-translate-y-0.5">
            Criar minha retrospectiva
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-rose-100 bg-white/70 px-5 py-10 text-center text-sm text-slate-500">
        <p className="font-black text-pink-600">♥ Lovelink</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 font-bold">
          <Link href="/termos-de-uso">Termos de Uso</Link>
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>
          <Link href="/criar/plano">Criar retrospectiva</Link>
        </div>
        <p className="mt-4">Feito com amor © 2026</p>
      </footer>
    </main>
  )
}
