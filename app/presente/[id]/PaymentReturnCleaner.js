'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const MERCADO_PAGO_PARAMS = [
  'collection_id',
  'collection_status',
  'payment_id',
  'status',
  'external_reference',
  'payment_type',
  'merchant_order_id',
  'preference_id',
]

export default function PaymentReturnCleaner({ presenteSlug }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const hasMercadoPagoParams = MERCADO_PAGO_PARAMS.some((param) => searchParams.has(param))

    if (!hasMercadoPagoParams) return

    router.replace(`/presente/${presenteSlug}`, { scroll: false })
  }, [presenteSlug, router, searchParams])

  return null
}
