import { createClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'
import RetrospectivaView from '../../components/RetrospectivaView'

export default async function Presente({ params }) {
  const { id: rawId } = await params
  const id = Number(rawId)

  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: presente, error } = await supabase
    .from('presentes')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao buscar presente: ${error.message}`)
  }

  if (!presente) {
    notFound()
  }

  if (!presente.pago) {
    redirect(`/pagamento?id=${id}`)
  }

  return <RetrospectivaView presente={presente} />
}
