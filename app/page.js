import Link from 'next/link'

const passos = [
  ['01', 'Escolha o plano', 'Básico ou Premium, de acordo com a surpresa que você quer criar.'],
  ['02', 'Conte a história', 'Adicione nomes, data, dedicatória e detalhes que tornam tudo pessoal.'],
  ['03', 'Monte os momentos', 'Envie de 3 a 8 fotos e escreva uma frase especial para cada lembrança.'],
  ['04', 'Compartilhe', 'Receba uma retrospectiva digital com link exclusivo após o pagamento.'],
]

const beneficios = [
  ['Emoção garantida', 'Uma experiência pensada para transformar fotos simples em uma lembrança inesquecível.'],
  ['100% personalizada', 'Nomes, data, mensagem, momentos e plano adaptados para a história de vocês.'],
  ['Memórias eternizadas', 'Uma página bonita, responsiva e pronta para enviar pelo WhatsApp.'],
]

const depoimentos = [
  ['Pedro Silva', 'Quando ela abriu, ficou olhando cada foto e chorou no final. Foi diferente de qualquer presente.'],
  ['Ana Santos', 'Achei que seria só uma página bonita, mas virou uma lembrança que a gente vai guardar.'],
  ['Lucas Oliveira', 'Consegui montar rápido e ficou com cara de presente caro. Valeu muito.'],
  ['Marina Costa', 'A retrospectiva deixou nossa história muito mais emocionante do que eu imaginava.'],
]

const perguntas = [
  ['Quanto tempo leva para criar?', 'Você consegue montar a retrospectiva em poucos minutos. A parte mais importante é escolher boas fotos e escrever mensagens sinceras.'],
  ['Quantas fotos posso usar?', 'O plano Básico aceita até 5 fotos. O Premium aceita até 8 fotos. Para criar, pedimos pelo menos 3 fotos.'],
  ['A música já funciona?', 'A etapa de música está preparada visualmente, mas ficará sem funcionalidade por enquanto para manter o produto estável.'],
  ['Posso enviar pelo WhatsApp?', 'Sim. Depois do pagamento, você recebe um link exclusivo da página para compartilhar.'],
  ['Qual a diferença entre Básico e Premium?', 'O Básico é uma surpresa mais simples. O Premium libera mais fotos, acesso vitalício e a base para música personalizada no futuro.'],
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff7f7] text-[#201629]">
      <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-black text-pink-600">
            <span>💌</span>
            <span>Lovelink</span>
          </Link>
          <Link href="/criar/informacoes" className="rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200">
            Criar minha retrospectiva
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center md:text-left">
          <p className="mx-auto mb-5 w-fit rounded-full bg-pink-50 px-4 py-2 text-xs font-bold text-pink-600 md:mx-0">
            ✨ Mais de 26.500 casais já eternizaram momentos
          </p>
          <h1 className="text-5xl font-black leading-tight tracking-normal md:text-7xl">
            Surpreenda quem você ama com uma retrospectiva inesquecível
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:mx-0">
            Uma experiência digital personalizada com fotos, textos, planos de acesso e uma apresentação emocionante para transformar lembranças em presente.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <Link href="/criar/informacoes" className="rounded-full bg-[#d85f7a] px-7 py-4 font-bold text-white shadow-xl shadow-rose-200">
              Criar minha retrospectiva
            </Link>
            <a href="#exemplo" className="rounded-full border border-rose-100 bg-white px-7 py-4 font-bold text-slate-600">
              Ver exemplo
            </a>
          </div>
        </div>

        <div id="exemplo" className="mx-auto w-full max-w-sm rounded-[2rem] border border-rose-100 bg-white p-4 shadow-2xl shadow-rose-100">
          <div className="rounded-[1.5rem] bg-[#0a0811] px-7 py-10 text-center text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Nossa história</p>
            <div className="my-10 rounded-full bg-gradient-to-br from-pink-300 to-fuchsia-500 p-10 text-6xl shadow-inner">
              💞
            </div>
            <p className="font-serif text-4xl">183 dias</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Cada foto vira um capítulo. Cada frase vira memória.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 px-2 py-5 text-center text-xs text-slate-500">
            <span>FOTOS</span>
            <span>MÚSICA</span>
            <span>QR CODE</span>
            <span>LINK</span>
          </div>
        </div>
      </section>

      <section className="border-y border-rose-100 bg-white/70 px-5 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
          {[
            ['26.540', 'histórias criadas'],
            ['4.9/5', 'avaliação média'],
            ['5 min', 'para criar'],
            ['100%', 'online'],
          ].map(([numero, label]) => (
            <div key={label}>
              <p className="text-2xl font-black">{numero}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Como funciona</p>
        <h2 className="mt-3 text-center text-4xl font-black">Crie em 4 passos simples</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {passos.map(([numero, titulo, texto]) => (
            <article key={numero} className="rounded-2xl border border-rose-100 bg-white p-7 shadow-lg shadow-rose-50">
              <p className="text-3xl font-black text-pink-200">{numero}</p>
              <h3 className="mt-4 text-lg font-black">{titulo}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fff0ed] px-5 py-20">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Por que escolher?</p>
        <h2 className="mt-3 text-center text-4xl font-black">Mais do que um presente</h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {beneficios.map(([titulo, texto]) => (
            <article key={titulo} className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-lg shadow-rose-100/50">
              <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-pink-50 text-pink-500">✦</div>
              <h3 className="font-black">{titulo}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Depoimentos</p>
        <h2 className="mt-3 text-center text-4xl font-black">O que nossos clientes dizem</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {depoimentos.map(([nome, texto]) => (
            <article key={nome} className="rounded-2xl border border-rose-100 bg-white p-7 shadow-lg shadow-rose-50">
              <p className="text-amber-400">★★★★★</p>
              <p className="mt-4 leading-7 text-slate-700">“{texto}”</p>
              <p className="mt-5 font-bold text-pink-600">{nome}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fff0ed] px-5 py-20">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Dúvidas</p>
        <h2 className="mt-3 text-center text-4xl font-black">Perguntas frequentes</h2>
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {perguntas.map(([pergunta, resposta]) => (
            <details key={pergunta} className="rounded-xl border border-rose-100 bg-white p-5">
              <summary className="cursor-pointer font-bold">{pergunta}</summary>
              <p className="mt-3 leading-7 text-slate-600">{resposta}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 text-center">
        <h2 className="text-4xl font-black">
          Pronto para emocionar <span className="text-pink-600">quem você ama?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-600">
          Comece agora e monte uma retrospectiva com começo, momentos marcantes, plano escolhido e link exclusivo.
        </p>
        <Link href="/criar/informacoes" className="mt-8 inline-block rounded-full bg-[#d85f7a] px-8 py-4 font-bold text-white shadow-xl shadow-rose-200">
          Criar minha retrospectiva
        </Link>
      </section>

      <footer className="border-t border-rose-100 px-5 py-10 text-center text-sm text-slate-500">
        <p className="font-black text-pink-600">💌 Lovelink</p>
        <p className="mt-2">Feito com amor © 2026</p>
      </footer>
    </main>
  )
}
