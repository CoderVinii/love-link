import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

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

export async function GET(_request, { params }) {
  const { id: rawId } = await params
  const lookup = getLookup(rawId)

  if (!lookup) {
    return Response.json({ erro: 'Presente invalido.' }, { status: 400 })
  }

  const { data: presente, error } = await supabaseAdmin
    .from('presentes')
    .select('id, public_slug, created_at, nome_remetente, nome_destinatario, data_relacionamento, mensagem, musica_url, fotos_urls, pago')
    .eq(lookup.tipo, lookup.valor)
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
