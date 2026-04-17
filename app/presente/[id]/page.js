import { createClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'

export default async function Presente({ params }) {

  // 🔥 ID garantido como número
  const id = Number(params.id)

  // ❌ proteção básica
  if (!id || isNaN(id)) {
    notFound()
  }

  // 🔒 cliente correto (ANON KEY)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // 🔍 busca no banco
  const { data: presente, error } = await supabase
    .from('presentes')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  // 🧠 debug (opcional)
  console.log('ID:', id)
  console.log('ERRO:', error)
  console.log('PRESENTE:', presente)

  // ❌ não achou
  if (!presente) {
    notFound()
  }

  // 🔒 bloqueio se não pago
  if (!presente.pago) {
    redirect(`/pagamento?id=${id}`)
  }

  // 📸 fotos
  const fotos = presente.fotos_urls
    ? presente.fotos_urls.split(',').filter(url => url.trim() !== '')
    : []

  return (
    <div style={{ padding: 40 }}>
      <h1>Presente</h1>

      <h2>{presente.nome_remetente} → {presente.nome_destinatario}</h2>

      <p>{presente.mensagem}</p>

      {fotos.map((url, i) => (
        <img key={i} src={url} width={200} />
      ))}
    </div>
  )
}