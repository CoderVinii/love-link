import { notFound, redirect } from 'next/navigation'
import RetrospectivaView from '../../components/RetrospectivaView'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import PaymentReturnCleaner from './PaymentReturnCleaner'

export default async function Presente({ params }) {
  const { id: rawId } = await params
  const id = Number(rawId)

  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }

  const { data: presente, error } = await supabaseAdmin
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

  return (
    <>
      <PaymentReturnCleaner presenteId={id} />
      <RetrospectivaView presente={presente} />
    </>
  )
}
