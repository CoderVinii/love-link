export const PLANOS = {
  basico: {
    nome: 'Básico',
    preco: 25.9,
    fotos: 5,
    acesso: '1 ano de acesso',
    musica: 'Sem música',
  },
  premium: {
    nome: 'Premium',
    preco: 29.9,
    fotos: 8,
    acesso: 'Acesso vitalício ao QR Code',
    musica: 'Música de fundo quando disponível',
  },
}

export function parseMensagemPayload(mensagem) {
  if (!mensagem) {
    return {
      versao: 1,
      texto: '',
      momentos: [],
      plano: 'premium',
      extras: {},
    }
  }

  try {
    const parsed = JSON.parse(mensagem)
    if (parsed && parsed.tipo === 'retrospectiva') {
      return {
        versao: parsed.versao || 1,
        texto: parsed.texto || '',
        momentos: Array.isArray(parsed.momentos) ? parsed.momentos : [],
        plano: parsed.plano || 'premium',
        extras: parsed.extras || {},
      }
    }
  } catch {
    // Presentes antigos guardavam apenas texto puro.
  }

  return {
    versao: 1,
    texto: mensagem,
    momentos: [],
    plano: 'premium',
    extras: {},
  }
}

export function buildMensagemPayload({ texto, momentos, plano, extras }) {
  return JSON.stringify({
    tipo: 'retrospectiva',
    versao: 2,
    texto: texto || '',
    momentos: momentos || [],
    plano: plano || 'premium',
    extras: extras || {},
  })
}

export function getPlano(plano) {
  return PLANOS[plano] || PLANOS.premium
}

export function formatarData(data) {
  if (!data) return ''

  const date = new Date(`${data}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString('pt-BR')
}

export function calcularTempoJuntos(data) {
  const inicio = data ? new Date(`${data}T00:00:00`) : null

  if (!inicio || Number.isNaN(inicio.getTime())) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0 }
  }

  const diff = Math.max(0, Date.now() - inicio.getTime())
  const totalSeconds = Math.floor(diff / 1000)

  return {
    dias: Math.floor(totalSeconds / 86400),
    horas: Math.floor((totalSeconds % 86400) / 3600),
    minutos: Math.floor((totalSeconds % 3600) / 60),
    segundos: totalSeconds % 60,
  }
}
