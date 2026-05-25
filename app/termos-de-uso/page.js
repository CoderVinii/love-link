import Link from 'next/link'
import { PLANOS } from '../lib/presentePayload'

const secoes = [
  {
    titulo: '1. O que é o Lovelink',
    texto: 'O Lovelink é um serviço digital para criar uma retrospectiva romântica personalizada com nomes, data, mensagem e fotos enviadas pelo usuário.',
  },
  {
    titulo: '2. Como funciona o presente digital',
    texto: 'Você escolhe um plano, preenche as informações, adiciona fotos, revisa o conteúdo e realiza o pagamento. Após a confirmação, o link final do presente é liberado.',
  },
  {
    titulo: '3. Planos disponíveis',
    texto: `O plano ${PLANOS.basico.nome} inclui até ${PLANOS.basico.fotos} fotos e ${PLANOS.basico.acesso}. O plano ${PLANOS.premium.nome} inclui até ${PLANOS.premium.fotos} fotos, ${PLANOS.premium.acesso} e os recursos premium descritos na página de planos.`,
  },
  {
    titulo: '4. Pagamento',
    texto: 'Os pagamentos são processados pelo Mercado Pago. O acesso ao presente final depende da aprovação do pagamento. Tentativas recusadas, pendentes ou canceladas não liberam o link final.',
  },
  {
    titulo: '5. Responsabilidade pelo conteúdo',
    texto: 'O usuário é responsável por todos os textos, nomes, datas e imagens enviados. Não envie conteúdo ofensivo, ilegal, sem autorização ou que viole direitos de terceiros.',
  },
  {
    titulo: '6. Uso das imagens',
    texto: 'As imagens enviadas são usadas para montar, armazenar e exibir a retrospectiva digital criada pelo usuário. O Lovelink não utiliza essas imagens para outros fins comerciais independentes.',
  },
  {
    titulo: '7. Suporte',
    texto: 'Em caso de dúvidas ou problemas com criação, pagamento ou acesso ao presente, entre em contato pelo canal de suporte informado pelo Lovelink.',
  },
]

export default function TermosDeUso() {
  return (
    <main className="min-h-screen bg-[#fff7f7] px-5 py-10 text-[#201629]">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-pink-600">
          <span aria-hidden="true">♡</span>
          <span>Lovelink</span>
        </Link>

        <section className="mt-10 rounded-2xl border border-rose-100 bg-white p-6 shadow-xl shadow-rose-100/70 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Legal</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Termos de Uso</h1>
          <p className="mt-4 leading-7 text-slate-600">
            Estes termos resumem as regras básicas para usar o Lovelink. Ao criar uma retrospectiva, você confirma que leu e concorda com estas condições.
          </p>

          <div className="mt-8 space-y-6">
            {secoes.map((secao) => (
              <article key={secao.titulo} className="rounded-2xl border border-rose-100 bg-[#fffafa] p-5">
                <h2 className="font-black">{secao.titulo}</h2>
                <p className="mt-3 leading-7 text-slate-600">{secao.texto}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-rose-50 p-5 text-sm leading-6 text-slate-600">
            <p className="font-bold text-[#201629]">Observação</p>
            <p className="mt-2">
              Este texto é uma versão inicial e objetiva dos termos. Ele pode ser atualizado conforme o Lovelink evoluir.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
