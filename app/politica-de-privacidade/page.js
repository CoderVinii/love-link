import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidade | Lovelink',
  description: 'Política de privacidade inicial do Lovelink.',
}

export default function PoliticaDePrivacidade() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7f8_0%,#fff1f4_100%)] px-5 py-10 text-[#251629]">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl shadow-rose-100 sm:p-10">
        <Link href="/" className="text-sm font-black text-pink-600">← Voltar para Lovelink</Link>
        <h1 className="mt-8 text-3xl font-black sm:text-4xl">Política de Privacidade</h1>
        <p className="mt-4 leading-8 text-slate-600">
          Esta é uma versão inicial e objetiva da política do Lovelink. Coletamos apenas os dados necessários para criar,
          armazenar, liberar e exibir a retrospectiva digital escolhida pelo usuário.
        </p>

        <div className="mt-8 space-y-6 leading-8 text-slate-700">
          <section>
            <h2 className="text-xl font-black text-[#251629]">Dados usados</h2>
            <p className="mt-2">Podemos usar nomes, email, data, mensagem, plano escolhido e imagens enviadas para montar o presente digital.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#251629]">Fotos e conteúdo</h2>
            <p className="mt-2">As imagens enviadas são usadas para criar e exibir a retrospectiva. O usuário é responsável pelo conteúdo enviado.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#251629]">Pagamentos</h2>
            <p className="mt-2">Os pagamentos são processados pelo Mercado Pago. O Lovelink recebe apenas informações necessárias para liberar o presente após aprovação.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#251629]">Cookies</h2>
            <p className="mt-2">O banner de cookies salva apenas sua preferência localmente no navegador. Nenhum rastreamento adicional foi implementado nesta etapa.</p>
          </section>
        </div>
      </article>
    </main>
  )
}
