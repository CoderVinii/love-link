'use client'

import { useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'lovelink-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.localStorage.getItem(STORAGE_KEY)
  })

  function escolher(valor) {
    try {
      window.localStorage.setItem(STORAGE_KEY, valor)
    } catch {
      // Se o navegador bloquear localStorage, apenas fecha o aviso nesta sessão.
    }

    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-rose-100 bg-white/95 p-4 text-sm text-slate-600 shadow-2xl shadow-rose-200/70 backdrop-blur md:flex-row md:items-center md:justify-between">
        <p className="leading-6">
          Usamos cookies essenciais para lembrar suas escolhas e melhorar sua experiência no Lovelink.
          <Link
            href="/politica-de-privacidade"
            className="ml-1 font-bold text-pink-600 underline underline-offset-4"
          >
            Saiba mais
          </Link>
        </p>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => escolher('recusado')}
            className="rounded-full border border-rose-100 px-4 py-2 font-bold text-slate-600 transition hover:bg-rose-50"
          >
            Recusar
          </button>

          <button
            type="button"
            onClick={() => escolher('aceito')}
            className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 font-bold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  )
}