'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

function getBrowserGiftUrl() {
  if (typeof window === 'undefined') return ''

  return `${window.location.origin}${window.location.pathname}`
}

export default function GiftQrCode({ url }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [erro, setErro] = useState('')
  const finalUrl = url || getBrowserGiftUrl()

  useEffect(() => {
    let ativo = true

    async function gerarQrCode() {
      if (!finalUrl) return

      try {
        const dataUrl = await QRCode.toDataURL(finalUrl, {
          errorCorrectionLevel: 'M',
          margin: 2,
          width: 280,
          color: {
            dark: '#251629',
            light: '#ffffff',
          },
        })

        if (ativo) {
          setQrDataUrl(dataUrl)
          setErro('')
        }
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error)
        if (ativo) setErro('Não foi possível gerar o QR Code agora.')
      }
    }

    gerarQrCode()

    return () => {
      ativo = false
    }
  }, [finalUrl])

  return (
    <section className="mx-auto mb-8 max-w-3xl rounded-[2rem] border border-rose-100 bg-white/90 p-7 text-center shadow-xl shadow-rose-100 sm:p-9">
      <p className="text-xs font-black uppercase tracking-[0.32em] text-pink-500">Compartilhe</p>
      <h2 className="mt-4 text-3xl font-black sm:text-4xl">QR Code do presente</h2>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
        Escaneie para abrir esta retrospectiva pelo link público.
      </p>

      <div className="mx-auto mt-7 grid w-fit place-items-center rounded-[1.5rem] border border-rose-100 bg-white p-4 shadow-lg shadow-rose-100">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code do presente Lovelink" className="h-56 w-56 rounded-xl" />
        ) : (
          <div className="grid h-56 w-56 place-items-center rounded-xl bg-rose-50 text-sm font-bold text-pink-600">
            {erro || 'Gerando QR Code...'}
          </div>
        )}
      </div>

      <p className="mx-auto mt-5 max-w-xl break-all rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-slate-500">
        {finalUrl || 'Preparando link do presente...'}
      </p>

      {qrDataUrl && (
        <a
          href={qrDataUrl}
          download="lovelink-qrcode.png"
          className="lovelink-gradient-button mt-6 inline-flex rounded-full px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
        >
          Baixar QR Code
        </a>
      )}
    </section>
  )
}
