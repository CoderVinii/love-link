import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function Presente({ params }) {
  const { id } = await params

  const { data: presente } = await supabaseServer
    .from('presentes')
    .select('*')
    .eq('id', id)
    .single()

  if (!presente) notFound()
  if (!presente.pago) redirect(`/pagamento?id=${id}`)

  const fotos = presente.fotos_urls
    ? presente.fotos_urls.split(',')
    : []

  return (
    <div>
      <h1>Presente</h1>

      <p>{presente.mensagem}</p>

      {fotos.map((foto, index) => (
        <img key={index} src={foto} alt="" width={200} />
      ))}

      <Link href="/">Voltar</Link>
    </div>
  )
}