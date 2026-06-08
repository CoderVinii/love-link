import { notFound, redirect } from 'next/navigation'
import GiftQrCode from '../../components/GiftQrCode'
import RetrospectivaView from '../../components/RetrospectivaView'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import PaymentReturnCleaner from './PaymentReturnCleaner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getLookup(rawId) {
  const valor = decodeURIComponent(String(rawId || '')).trim()
  const idNumerico = Number(valor)

  if (Number.isInteger(idNumerico) && idNumerico > 0 && String(idNumerico) === valor) {
    return { tipo: 'id', valor: idNumerico }
  }

  if (valor.length >= 3 && valor.length <= 120) {
    return { tipo: 'public_slug', valor: valor.toLowerCase() }
  }

  return null
}

function getPublicBaseUrl() {
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''

  return (process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || vercelUrl || 'http://localhost:3000').replace(/\/$/, '')
}

export default async function Presente({ params }) {
  const { id: rawId } = await params
  const lookup = getLookup(rawId)

  if (!lookup) {
    notFound()
  }

  const { data: presente, error } = await supabaseAdmin
    .from('presentes')
    .select('*')
    .eq(lookup.tipo, lookup.valor)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao buscar presente: ${error.message}`)
  }

  if (!presente) {
    notFound()
  }

  if (!presente.pago) {
    redirect(`/pagamento?id=${presente.id}`)
  }

  if (lookup.tipo === 'id' && presente.public_slug) {
    redirect(`/presente/${presente.public_slug}`)
  }

  const publicGiftUrl = `${getPublicBaseUrl()}/presente/${presente.public_slug || presente.id}`

  return (
    <>
      <PaymentReturnCleaner presenteSlug={presente.public_slug || String(presente.id)} />
      <RetrospectivaView presente={presente} />
      <div className="bg-[linear-gradient(180deg,#fff8f8_0%,#ffe8ee_100%)] px-5 pb-12 pt-2">
        <GiftQrCode url={publicGiftUrl} />
      </div>
    </>
  )
}
