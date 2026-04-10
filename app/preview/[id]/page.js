'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function Preview({ params }) {
  const { id } = use(params)

  const [presente, setPresente] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscarPresente() {
      const { data, error } = await supabase
        .from('presentes')
        .select('*')
        .eq('id', id)
        .single()

      if (!error) setPresente(data)
      setCarregando(false)
    }

    buscarPresente()
  }, [id])

  if (carregando) return <div>Carregando...</div>

  if (!presente) return <div>Presente não encontrado</div>

  return (
    <div>
      <h1>Preview do Presente</h1>
      <p>{presente.mensagem}</p>

      <Link href={`/pagamento?id=${id}`}>
        Ir para pagamento
      </Link>
    </div>
  )
}