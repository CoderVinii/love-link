import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function pathsValidos(presenteId, paths) {
  return Array.isArray(paths) &&
    paths.length >= 3 &&
    paths.length <= 8 &&
    paths.every((path) => typeof path === 'string' && path.startsWith(`${presenteId}/foto-`))
}

export async function POST(request) {
  try {
    const body = await request.json()
    const presenteId = Number(body.presenteId)

    if (!Number.isInteger(presenteId) || presenteId <= 0 || !pathsValidos(presenteId, body.paths)) {
      return Response.json({ erro: 'Dados das fotos inválidos.' }, { status: 400 })
    }

    const urls = body.paths.map((path) => {
      const { data } = supabaseAdmin.storage
        .from('fotos')
        .getPublicUrl(path)

      return data.publicUrl
    })

    const { error } = await supabaseAdmin
      .from('presentes')
      .update({ fotos_urls: urls.join(',') })
      .eq('id', presenteId)
      .eq('pago', false)

    if (error) {
      console.error('Erro ao salvar URLs das fotos:', error)
      return Response.json({ erro: 'Erro ao salvar fotos.' }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (erro) {
    console.error('Erro geral ao finalizar fotos:', erro)
    return Response.json({ erro: 'Erro ao salvar fotos.' }, { status: 500 })
  }
}
