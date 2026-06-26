export const PLANOS = {
  basico: {
    nome: 'Básico',
    preco: 15.9,
    fotos: 5,
    acesso: '1 dia de acesso',
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
        plano: PLANOS[parsed.plano] ? parsed.plano : 'premium',
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
    momentos: Array.isArray(momentos) ? momentos : [],
    plano: PLANOS[plano] ? plano : 'premium',
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

export function calcularTempoJuntos(data, agora = Date.now()) {
  const inicio = data ? new Date(`${data}T00:00:00`) : null

  if (!inicio || Number.isNaN(inicio.getTime())) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0 }
  }

  const diff = Math.max(0, agora - inicio.getTime())
  const totalSeconds = Math.floor(diff / 1000)

  return {
    dias: Math.floor(totalSeconds / 86400),
    horas: Math.floor((totalSeconds % 86400) / 3600),
    minutos: Math.floor((totalSeconds % 3600) / 60),
    segundos: totalSeconds % 60,
  }
}

export function calcularSigno(data) {
  if (!data) return ''

  const date = new Date(`${data}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''

  const mes = date.getMonth() + 1
  const dia = date.getDate()

  const tabela = [
    ['Capricórnio', dia >= 22 || mes === 1],
    ['Aquário', (mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)],
    ['Peixes', (mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)],
    ['Áries', (mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)],
    ['Touro', (mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)],
    ['Gêmeos', (mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)],
    ['Câncer', (mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)],
    ['Leão', (mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)],
    ['Virgem', (mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)],
    ['Libra', (mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)],
    ['Escorpião', (mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)],
    ['Sagitário', (mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)],
  ]

  const encontrado = tabela.find(([, condicao]) => condicao)
  return encontrado ? encontrado[0] : 'Capricórnio'
}
