'use client'

import { useEffect, useState, use } from 'react'
import RetrospectivaView from '../../components/RetrospectivaView'

export default function Preview({ params }) {
  const { id } = use(params)
  const [presente, setPresente] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscarPresente() {
      try {
        const res = await fetch(`/api/presente/${id}`, { cache: 'no-store' })
        const data = await res.json()

        setPresente(res.ok ? data.presente : null)
      } catch (error) {
        console.error('Erro ao buscar preview:', error)
        setPresente(null)
      } finally {
        setCarregando(false)
      }
    }

    buscarPresente()
  }, [id])

  if (carregando) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07070d] text-pink-300">
        Carregando sua retrospectiva...
      </div>
    )
  }

  if (!presente) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07070d] px-5 text-center text-white">
        Retrospectiva não encontrada.
      </div>
    )
  }

  return <RetrospectivaView presente={presente} preview />
}
