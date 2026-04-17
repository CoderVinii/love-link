import { createClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'

export default async function Presente({ params, searchParams }) {

  // 🔥 ID LIMPO (ESSENCIAL)
  const id = Number(params.id)

  // 🔒 Supabase (CORRETO)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // 🔍 BUSCA
  const { data: presente, error } = await supabase
    .from('presentes')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  console.log('ID:', id)
  console.log('ERRO:', error)
  console.log('PRESENTE:', presente)

  // ❌ NÃO achou → 404
  if (!presente) {
    notFound()
  }

  // 🔒 BLOQUEIO
  if (!presente.pago) {
    redirect(`/pagamento?id=${id}`)
  }

  return (
    <div>
      <h1>FUNCIONOU</h1>
      <p>{presente.nome_remetente} → {presente.nome_destinatario}</p>
    </div>
  )
}