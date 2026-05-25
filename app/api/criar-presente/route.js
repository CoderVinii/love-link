import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'node:crypto'
import { getPlano, PLANOS } from '../../lib/presentePayload'

const MIN_FOTOS = 3
const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function limparNomeArquivo(nome = 'foto.jpg') {
  const partes = nome.split('.')
  const extensao = partes.length > 1 ? partes.pop().toLowerCase() : 'jpg'
  const base = partes.join('.')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50) || 'foto'

  return `${base}.${extensao}`
}

function limparSlugParte(valor = '') {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 18)
}

function gerarPublicSlug(body) {
  const remetente = limparSlugParte(body.nomeRemetente)
  const destinatario = limparSlugParte(body.nomeDestinatario)
  const prefixo = [remetente, destinatario].filter(Boolean).join('-').slice(0, 24)
  const aleatorio = randomBytes(5).toString('hex')

  return `${prefixo || 'lv'}-${aleatorio}`
}

function validarBody(body) {
  if (!body?.nomeRemetente || !body?.nomeDestinatario || !body?.dataRelacionamento) {
    return 'Preencha nomes e data do relacionamento.'
  }

  if (!PLANOS[body.plano]) {
    return 'Plano inválido.'
  }

  if (!Array.isArray(body.fotos)) {
    return 'Fotos inválidas.'
  }

  const plano = getPlano(body.plano)

  if (body.fotos.length < MIN_FOTOS || body.fotos.length > plano.fotos) {
    return `O plano ${plano.nome} aceita de ${MIN_FOTOS} até ${plano.fotos} fotos.`
  }

  const fotoInvalida = body.fotos.find((foto) => (
    !ALLOWED_TYPES.includes(foto.type) ||
    !Number.isFinite(Number(foto.size)) ||
    Number(foto.size) <= 0 ||
    Number(foto.size) > MAX_FILE_SIZE
  ))

  if (fotoInvalida) {
    return 'Use apenas imagens JPG, PNG ou WEBP com até 8 MB cada.'
  }

  return null
}

export async function POST(request) {
  try {
    const body = await request.json()
    const erroValidacao = validarBody(body)

    if (erroValidacao) {
      return Response.json({ erro: erroValidacao }, { status: 400 })
    }

    let presente = null
    let erroInsert = null

    for (let tentativa = 0; tentativa < 3; tentativa++) {
      const resultado = await supabaseAdmin
        .from('presentes')
        .insert({
          public_slug: gerarPublicSlug(body),
          nome_remetente: String(body.nomeRemetente).trim(),
          nome_destinatario: String(body.nomeDestinatario).trim(),
          data_relacionamento: body.dataRelacionamento,
          mensagem: body.mensagem,
          musica_url: '',
          fotos_urls: '',
          pago: false,
        })
        .select('id, public_slug')
        .single()

      presente = resultado.data
      erroInsert = resultado.error

      if (!erroInsert || erroInsert.code !== '23505') break
    }

    if (erroInsert) {
      console.error('Erro ao criar presente:', erroInsert)
      return Response.json({ erro: 'Erro ao criar retrospectiva.' }, { status: 500 })
    }

    const uploads = []

    for (let index = 0; index < body.fotos.length; index++) {
      const foto = body.fotos[index]
      const path = `${presente.id}/foto-${index + 1}-${Date.now()}-${limparNomeArquivo(foto.name)}`
      const { data, error } = await supabaseAdmin.storage
        .from('fotos')
        .createSignedUploadUrl(path)

      if (error) {
        console.error('Erro ao criar upload assinado:', error)
        return Response.json({ erro: 'Erro ao preparar upload das fotos.' }, { status: 500 })
      }

      uploads.push({
        path,
        token: data.token,
      })
    }

    return Response.json({
      presenteId: presente.id,
      publicSlug: presente.public_slug,
      uploads,
    })
  } catch (erro) {
    console.error('Erro geral ao criar presente:', erro)
    return Response.json({ erro: 'Erro ao criar retrospectiva.' }, { status: 500 })
  }
}
