import { supabaseAdmin } from '../../../lib/supabaseAdmin'

function normalizarId(rawId) {
  const id = Number(rawId)
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function GET(_request, { params }) {
  const { id: rawId } = await params
  const id = normalizarId(rawId)

  if (!id) {
    return Response.json({ erro: 'Presente invalido.' }, { status: 400 })
  }

  const { data: presente, error } = await supabaseAdmin
    .from('presentes')
    .select('id, created_at, nome_remetente, nome_destinatario, data_relacionamento, mensagem, musica_url, fotos_urls, pago')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Erro ao buscar presente:', error)
    return Response.json({ erro: 'Erro ao buscar presente.' }, { status: 500 })
  }

  if (!presente) {
    return Response.json({ erro: 'Presente nao encontrado.' }, { status: 404 })
  }

  return Response.json({ presente })
}
