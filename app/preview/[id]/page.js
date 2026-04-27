'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '../../lib/supabase'
import RetrospectivaView from '../../components/RetrospectivaView'

export default function Preview({ params }) {
  const { id } = use(params)
  const [presente, setPresente] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscarPresente() {
      const { data } = await supabase
        .from('presentes')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      setPresente(data)
      setCarregando(false)
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
      <div className="grid min-h-screen place-items-center bg-[#07070d] text-white">
        Retrospectiva não encontrada.
      </div>
    )
  }

  return <RetrospectivaView presente={presente} preview />
}
