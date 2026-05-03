import { Suspense } from 'react'
import RetrospectivaFlow from '../_components/RetrospectivaFlow'

export default function InformacoesPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#fff7f7] text-pink-600">Carregando...</main>}>
      <RetrospectivaFlow etapa="informacoes" />
    </Suspense>
  )
}
