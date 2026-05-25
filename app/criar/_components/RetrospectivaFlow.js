'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { buildMensagemPayload, formatarData, getPlano, PLANOS } from '../../lib/presentePayload'

const STORAGE_KEY = 'lovelink-retrospectiva'
const PHOTO_DB_NAME = 'lovelink-retrospectiva-fotos'
const PHOTO_STORE_NAME = 'fotos'
const MIN_FOTOS = 3
const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const etapas = [
  ['plano', 'Plano'],
  ['informacoes', 'Informações'],
  ['fotos', 'Fotos'],
  ['musica', 'Música'],
  ['revisao', 'Revisão'],
]

const estadoInicial = {
  email: '',
  sexo: 'masculino',
  destinatarioTipo: 'Namorada',
  nomeRemetente: '',
  nomeDestinatario: '',
  dataRelacionamento: '',
  ocultarSigno: false,
  mensagem: '',
  musica: '',
  plano: '',
  fotos: [],
  termos: false,
}

function normalizarEstado(valor) {
  return {
    ...estadoInicial,
    ...(valor || {}),
    fotos: Array.isArray(valor?.fotos) ? valor.fotos : [],
    plano: PLANOS[valor?.plano] ? valor.plano : '',
  }
}

function serializarEstado(valor) {
  return {
    ...normalizarEstado(valor),
    fotos: (valor?.fotos || []).map(({ preview, ...foto }) => foto),
  }
}

function lerEstado() {
  if (typeof window === 'undefined') return estadoInicial

  try {
    const salvo = window.localStorage.getItem(STORAGE_KEY)
    return salvo ? normalizarEstado(JSON.parse(salvo)) : estadoInicial
  } catch {
    return estadoInicial
  }
}

function abrirBancoFotos() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null)
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(PHOTO_DB_NAME, 1)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(PHOTO_STORE_NAME)) {
        db.createObjectStore(PHOTO_STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function usarBancoFotos(mode, callback) {
  const db = await abrirBancoFotos()
  if (!db) return null

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PHOTO_STORE_NAME, mode)
    const store = transaction.objectStore(PHOTO_STORE_NAME)
    const request = callback(store)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => db.close()
    transaction.onerror = () => {
      db.close()
      reject(transaction.error)
    }
  })
}

function salvarPreviewFoto(id, preview) {
  return usarBancoFotos('readwrite', (store) => store.put(preview, id))
}

function lerPreviewFoto(id) {
  return usarBancoFotos('readonly', (store) => store.get(id))
}

function apagarPreviewFoto(id) {
  return usarBancoFotos('readwrite', (store) => store.delete(id))
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function dataUrlToBlob(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.includes(',')) {
    throw new Error('Uma das fotos nao foi carregada corretamente. Remova e adicione a imagem novamente.')
  }

  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return new Blob([bytes], { type: mime })
}

function gerarTitulo(index) {
  const titulos = [
    'O começo de tudo',
    'Nosso jeito de ser',
    'Um dia que ficou guardado',
    'A memória que sempre volta',
    'Entre risos e abraços',
    'O nosso lugar no mundo',
    'Quando tudo fez sentido',
    'Nossa história continua',
  ]

  return titulos[index] || `Momento ${index + 1}`
}

function gerarDescricao(index) {
  const descricoes = [
    'Foi aqui que uma parte bonita da nossa história começou.',
    'Esse momento mostra um pouco do carinho que existe entre nós.',
    'Uma lembrança simples, mas cheia de significado.',
    'Tem fotos que guardam mais do que imagem: guardam sentimento.',
    'Cada detalhe desse dia ainda mora no meu coração.',
    'Com você, até os dias comuns viram memória especial.',
    'Esse capítulo é só uma parte do quanto você é importante para mim.',
    'E que venham muitos outros momentos para guardar assim.',
  ]

  return descricoes[index] || 'Um momento especial da nossa história.'
}

function Progresso({ etapaAtual }) {
  const atualIndex = Math.max(0, etapas.findIndex(([key]) => key === etapaAtual))
  const progresso = ((atualIndex + 1) / etapas.length) * 100

  return (
    <div className="mx-auto mb-8 max-w-5xl">
      <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-2 text-2xl font-black text-pink-600">
        <span aria-hidden="true">♡</span>
        <span>Lovelink</span>
      </Link>
      <div className="h-2 overflow-hidden rounded-full bg-rose-100">
        <div className="h-full rounded-full bg-[#d85f7a] transition-all" style={{ width: `${progresso}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-5 gap-1 text-center text-[11px] font-bold text-slate-400 sm:text-xs">
        {etapas.map(([key, label], index) => (
          <span key={key} className={index <= atualIndex ? 'text-pink-600' : ''}>{label}</span>
        ))}
      </div>
    </div>
  )
}

function Card({ children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-rose-100 bg-white p-5 shadow-lg shadow-rose-100/50 sm:p-7 ${className}`}>
      {children}
    </section>
  )
}

function Opcao({ ativo, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition sm:text-base ${ativo ? 'border-[#d85f7a] bg-rose-50 text-[#d85f7a]' : 'border-slate-200 bg-white hover:border-rose-200'}`}
    >
      {children}
    </button>
  )
}

function PlanoCard({ id, item, ativo, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full flex-col rounded-2xl border p-6 text-left transition ${ativo ? 'border-[#d85f7a] bg-rose-50 shadow-lg shadow-rose-100' : 'border-rose-100 bg-white hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-black">{item.nome}</p>
          <p className="mt-2 text-4xl font-black text-[#d85f7a]">
            R$ {item.preco.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <span className={`mt-1 h-5 w-5 rounded-full border ${ativo ? 'border-[#d85f7a] bg-[#d85f7a]' : 'border-slate-300'}`} />
      </div>
      <div className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
        <p>Até {item.fotos} fotos na retrospectiva</p>
        <p>{item.acesso}</p>
        <p>{item.musica}</p>
      </div>
      <span className="mt-6 inline-flex w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-pink-600">
        {id === 'premium' ? 'Mais completo' : 'Essencial'}
      </span>
    </button>
  )
}

export default function RetrospectivaFlow({ etapa }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planoQuery = searchParams.get('plano')
  const [form, setForm] = useState(estadoInicial)
  const [hidratado, setHidratado] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [arrastandoFotos, setArrastandoFotos] = useState(false)
  const [termosDestacados, setTermosDestacados] = useState(false)

  useEffect(() => {
    let ativo = true

    async function carregarEstado() {
      const salvo = lerEstado()
      const fotosComPreview = await Promise.all(
        salvo.fotos.map(async (foto) => ({
          ...foto,
          preview: foto.preview || await lerPreviewFoto(foto.id) || '',
        }))
      )
      const planoInicial = PLANOS[planoQuery] ? planoQuery : salvo.plano

      if (ativo) {
        setForm({ ...salvo, fotos: fotosComPreview.filter((foto) => foto.preview), plano: planoInicial })
        setHidratado(true)
      }
    }

    carregarEstado().catch(() => {
      const salvo = lerEstado()
      const planoInicial = PLANOS[planoQuery] ? planoQuery : salvo.plano
      if (ativo) {
        setForm({ ...salvo, fotos: [], plano: planoInicial })
        setErro('Nao foi possivel restaurar as fotos salvas. Adicione as imagens novamente para continuar.')
        setHidratado(true)
      }
    })

    return () => {
      ativo = false
    }
  }, [planoQuery])

  useEffect(() => {
    if (hidratado) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializarEstado(form)))
      } catch (err) {
        console.error('Erro ao salvar rascunho:', err)
        setErro('Nao foi possivel salvar o rascunho neste navegador. Voce ainda pode continuar nesta tela.')
      }
    }
  }, [form, hidratado])

  useEffect(() => {
    if (hidratado && etapa !== 'plano' && !PLANOS[form.plano]) {
      router.replace('/criar/plano')
    }
  }, [etapa, form.plano, hidratado, router])

  const plano = useMemo(() => getPlano(form.plano || 'premium'), [form.plano])
  const limiteFotos = plano.fotos
  const etapaIndex = etapas.findIndex(([key]) => key === etapa)
  const etapaAnterior = etapaIndex > 0 ? etapas[etapaIndex - 1][0] : null
  const proximaEtapa = etapaIndex >= 0 && etapaIndex < etapas.length - 1 ? etapas[etapaIndex + 1][0] : null

  function atualizar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))

    if (campo === 'termos' && valor) {
      setTermosDestacados(false)
      setErro('')
    }
  }

  function escolherPlano(planoEscolhido) {
    setErro('')
    setForm((atual) => ({
      ...atual,
      plano: planoEscolhido,
      fotos: atual.fotos.slice(0, PLANOS[planoEscolhido].fotos),
    }))
  }

  function irPara(destino) {
    setErro('')
    router.push(`/criar/${destino}`)
  }

  function validarPlano() {
    if (!PLANOS[form.plano]) {
      setErro('Escolha um plano para iniciar sua retrospectiva.')
      return false
    }

    return true
  }

  function validarInformacoes() {
    if (!form.email || !form.nomeRemetente || !form.nomeDestinatario || !form.dataRelacionamento) {
      setErro('Preencha email, nomes e data para continuar.')
      return false
    }

    return true
  }

  function validarFotos() {
    if (form.fotos.length < MIN_FOTOS) {
      setErro(`Adicione pelo menos ${MIN_FOTOS} fotos para continuar.`)
      return false
    }

    if (form.fotos.length > limiteFotos) {
      setErro(`O plano ${plano.nome} permite até ${limiteFotos} fotos.`)
      return false
    }

    return true
  }

  async function adicionarFotos(files) {
    const arquivos = Array.from(files || [])
    const espacoDisponivel = limiteFotos - form.fotos.length

    if (!validarPlano()) return
    if (arquivos.length === 0) return

    if (espacoDisponivel <= 0) {
      setErro(`Você já atingiu o limite de ${limiteFotos} fotos do plano ${plano.nome}.`)
      return
    }

    const selecionadas = arquivos.slice(0, espacoDisponivel)
    const invalida = selecionadas.find((file) => !ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE)

    if (invalida) {
      setErro('Use apenas imagens JPG, PNG ou WEBP com até 8 MB cada.')
      return
    }

    if (arquivos.length > espacoDisponivel) {
      setErro(`Adicionamos ${espacoDisponivel} foto(s). O plano ${plano.nome} permite até ${limiteFotos}.`)
    } else {
      setErro('')
    }

    try {
      const novasFotos = await Promise.all(
        selecionadas.map(async (file, index) => {
          const ordem = form.fotos.length + index
          const id = `${Date.now()}-${file.name}-${index}`
          const preview = await fileToDataUrl(file)

          await salvarPreviewFoto(id, preview)

          return {
            id,
            name: file.name,
            type: file.type,
            size: file.size,
            preview,
            title: gerarTitulo(ordem),
            description: gerarDescricao(ordem),
          }
        })
      )

      setForm((atual) => ({ ...atual, fotos: [...atual.fotos, ...novasFotos] }))
    } catch (err) {
      console.error('Erro ao adicionar fotos:', err)
      setErro('Nao foi possivel carregar as fotos. Tente imagens menores ou em JPG, PNG ou WEBP.')
    }
  }

  function removerFoto(id) {
    setErro('')
    apagarPreviewFoto(id).catch((err) => console.error('Erro ao apagar foto local:', err))
    setForm((atual) => ({ ...atual, fotos: atual.fotos.filter((foto) => foto.id !== id) }))
  }

  function atualizarFoto(id, campo, valor) {
    setForm((atual) => ({
      ...atual,
      fotos: atual.fotos.map((foto) => (
        foto.id === id ? { ...foto, [campo]: valor } : foto
      )),
    }))
  }

  async function enviarFotosParaStorage(uploadTargets) {
    const paths = []

    for (let i = 0; i < uploadTargets.length; i++) {
      const target = uploadTargets[i]
      const foto = form.fotos[i]

      if (!target || !foto) {
        throw new Error('Nao foi possivel preparar todas as fotos para envio. Tente novamente.')
      }

      const blob = dataUrlToBlob(foto.preview)

      const { error } = await supabase.storage
        .from('fotos')
        .uploadToSignedUrl(target.path, target.token, blob, {
          contentType: foto.type || blob.type,
        })

      if (error) throw error

      paths.push(target.path)
    }

    return paths
  }

  async function finalizar() {
    setErro('')

    if (!validarPlano() || !validarInformacoes() || !validarFotos()) return
    if (!form.termos) {
      setTermosDestacados(true)
      setErro('Você precisa aceitar os termos para continuar.')
      return
    }

    setCarregando(true)

    try {
      const payload = buildMensagemPayload({
        texto: form.mensagem || `Uma retrospectiva especial para ${form.nomeDestinatario}.`,
        plano: form.plano,
        momentos: form.fotos.map((foto, index) => ({
          titulo: foto.title || gerarTitulo(index),
          descricao: foto.description || gerarDescricao(index),
        })),
        extras: {
          email: form.email,
          sexo: form.sexo,
          destinatarioTipo: form.destinatarioTipo,
          ocultarSigno: form.ocultarSigno,
        },
      })

      const criarRes = await fetch('/api/criar-presente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeRemetente: form.nomeRemetente,
          nomeDestinatario: form.nomeDestinatario,
          dataRelacionamento: form.dataRelacionamento,
          plano: form.plano,
          mensagem: payload,
          fotos: form.fotos.map((foto) => ({
            name: foto.name,
            type: foto.type,
            size: foto.size,
          })),
        }),
      })

      const criado = await criarRes.json()

      if (!criarRes.ok) {
        throw new Error(criado.erro || 'Erro ao criar retrospectiva')
      }

      const paths = await enviarFotosParaStorage(criado.uploads)

      const finalizarRes = await fetch('/api/criar-presente/fotos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presenteId: criado.presenteId,
          paths,
        }),
      })

      const finalizado = await finalizarRes.json()

      if (!finalizarRes.ok) {
        throw new Error(finalizado.erro || 'Erro ao salvar fotos')
      }

      await Promise.all(form.fotos.map((foto) => apagarPreviewFoto(foto.id).catch(() => null)))
      window.localStorage.removeItem(STORAGE_KEY)
      router.push(`/pagamento?id=${criado.presenteId}`)
    } catch (err) {
      console.error('Erro ao finalizar retrospectiva:', err)
      setErro(err.message || 'Não foi possível finalizar agora. Confira sua conexão e tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  function avancar() {
    if (etapa === 'plano' && !validarPlano()) return
    if (etapa === 'informacoes' && !validarInformacoes()) return
    if (etapa === 'fotos' && !validarFotos()) return

    if (proximaEtapa) irPara(proximaEtapa)
  }

  function bloquearDrop(event) {
    event.preventDefault()
    event.stopPropagation()
  }

  async function soltarFotos(event) {
    bloquearDrop(event)
    setArrastandoFotos(false)

    const arquivos = Array.from(event.dataTransfer?.files || [])

    if (arquivos.length === 0) return

    if (arquivos.some((file) => !ALLOWED_TYPES.includes(file.type))) {
      setErro('Arraste apenas imagens JPG, PNG ou WEBP.')
      return
    }

    await adicionarFotos(arquivos)
  }

  if (!hidratado) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fff7f7] px-5 text-pink-600">
        Carregando seu rascunho...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fff7f7] px-4 py-8 text-[#201629] sm:px-5 sm:py-10">
      <Progresso etapaAtual={etapa} />

      <div className="mx-auto max-w-5xl space-y-6">
        {erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {erro}
          </div>
        )}

        {etapa === 'plano' && (
          <>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-pink-500">Primeiro passo</p>
              <h1 className="mt-3 text-3xl font-black sm:text-4xl">Escolha o plano da retrospectiva</h1>
              <p className="mt-4 leading-7 text-slate-600">
                O plano define o limite de fotos e o tempo de acesso. Você pode trocar antes de finalizar.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {Object.entries(PLANOS).map(([key, item]) => (
                <PlanoCard key={key} id={key} item={item} ativo={form.plano === key} onClick={() => escolherPlano(key)} />
              ))}
            </div>
          </>
        )}

        {etapa === 'informacoes' && (
          <>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-pink-500">Detalhes principais</p>
              <h1 className="mt-3 text-3xl font-black sm:text-4xl">Informações básicas</h1>
            </div>

            <Card>
              <label className="text-lg font-black">Seu email *</label>
              <input className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-pink-300" placeholder="voce@email.com" value={form.email} onChange={(e) => atualizar('email', e.target.value)} />
            </Card>

            <Card>
              <h2 className="text-lg font-black">Selecione seu sexo *</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {['masculino', 'feminino', 'outro'].map((sexo) => (
                  <Opcao key={sexo} ativo={form.sexo === sexo} onClick={() => atualizar('sexo', sexo)}>
                    {sexo[0].toUpperCase() + sexo.slice(1)}
                  </Opcao>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-black">Para quem é a retrospectiva?</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {['Namorada', 'Namorado', 'Esposa', 'Esposo', 'Mãe', 'Pai', 'Amigo', 'Outro'].map((tipo) => (
                  <Opcao key={tipo} ativo={form.destinatarioTipo === tipo} onClick={() => atualizar('destinatarioTipo', tipo)}>
                    {tipo}
                  </Opcao>
                ))}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input className="rounded-xl border border-slate-200 px-4 py-3 outline-pink-300" placeholder="Seu nome" value={form.nomeRemetente} onChange={(e) => atualizar('nomeRemetente', e.target.value)} />
                <input className="rounded-xl border border-slate-200 px-4 py-3 outline-pink-300" placeholder="Nome da pessoa especial" value={form.nomeDestinatario} onChange={(e) => atualizar('nomeDestinatario', e.target.value)} />
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-black">Data de início do relacionamento</h2>
              <input className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-pink-300" type="date" value={form.dataRelacionamento} onChange={(e) => atualizar('dataRelacionamento', e.target.value)} />
            </Card>

            <Card className="flex items-center gap-3">
              <input id="ocultarSigno" type="checkbox" checked={form.ocultarSigno} onChange={(e) => atualizar('ocultarSigno', e.target.checked)} />
              <label htmlFor="ocultarSigno" className="text-sm text-slate-700">Ocultar signo do zodíaco na retrospectiva</label>
            </Card>
          </>
        )}

        {etapa === 'fotos' && (
          <>
            <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-500">Momentos</p>
                <h1 className="mt-2 text-2xl font-black sm:text-3xl">Adicione suas fotos favoritas</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Plano {plano.nome}: de {MIN_FOTOS} até {limiteFotos} fotos. Cada imagem vira um capítulo editável.
                </p>
              </div>
              <label className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-5 py-3 text-sm font-bold ${form.fotos.length >= limiteFotos ? 'pointer-events-none bg-slate-100 text-slate-400' : 'bg-[#d85f7a] text-white shadow-lg shadow-rose-100'}`}>
                Adicionar fotos
                <input
                  id="fotos-upload-input"
                  type="file"
                  accept={ALLOWED_TYPES.join(',')}
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    adicionarFotos(e.target.files)
                    e.target.value = ''
                  }}
                />
              </label>
            </Card>

            <div className="overflow-x-auto pb-3">
              <div className="flex gap-4">
                {form.fotos.length === 0 && (
                  <label
                    htmlFor="fotos-upload-input"
                    onDragEnter={(event) => {
                      bloquearDrop(event)
                      setArrastandoFotos(true)
                    }}
                    onDragOver={bloquearDrop}
                    onDragLeave={(event) => {
                      bloquearDrop(event)
                      setArrastandoFotos(false)
                    }}
                    onDrop={soltarFotos}
                    className={`block min-w-full cursor-pointer rounded-2xl border bg-white p-5 text-center shadow-lg shadow-rose-100/50 transition sm:p-7 ${arrastandoFotos ? 'border-pink-400 bg-rose-50' : 'border-rose-100 hover:border-pink-200 hover:bg-rose-50/50'}`}
                  >
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-50 text-3xl text-pink-500">+</div>
                    <h2 className="mt-5 text-2xl font-black">Comece adicionando 3 fotos</h2>
                    <p className="mx-auto mt-3 max-w-xl text-slate-600">Escolha imagens especiais e depois ajuste título e descrição de cada momento.</p>
                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                      Clique ou arraste imagens aqui
                    </p>
                  </label>
                )}

                {form.fotos.map((foto, index) => (
                  <article key={foto.id} className="relative w-[82vw] max-w-[340px] shrink-0 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-lg shadow-rose-100/60">
                    <button
                      type="button"
                      onClick={() => removerFoto(foto.id)}
                      aria-label="Remover foto"
                      className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-lg font-black text-red-500 shadow-md"
                    >
                      ×
                    </button>
                    <img src={foto.preview} alt={foto.title} className="aspect-[4/3] w-full object-cover" />
                    <div className="space-y-4 p-5">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-[#d85f7a]">{index + 1}</span>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Momento</span>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500">Título ({foto.title.length}/80)</label>
                        <textarea className="mt-2 h-20 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-pink-300" maxLength={80} value={foto.title} onChange={(e) => atualizarFoto(foto.id, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500">Descrição ({foto.description.length}/250)</label>
                        <textarea className="mt-2 h-28 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-pink-300" maxLength={250} value={foto.description} onChange={(e) => atualizarFoto(foto.id, 'description', e.target.value)} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <p className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-semibold text-slate-600 shadow-sm">
              {form.fotos.length}/{limiteFotos} fotos adicionadas. Mínimo para finalizar: {MIN_FOTOS}.
            </p>
          </>
        )}

        {etapa === 'musica' && (
          <>
            <Card className="bg-slate-50">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-500">Música</p>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">Trilha sonora em breve</h1>
              <p className="mt-3 leading-7 text-slate-600">
                A etapa de música já está preparada no fluxo, mas ficará sem funcionalidade por enquanto para manter a entrega estável.
              </p>
            </Card>
            <Card>
              <label className="block text-sm font-bold text-slate-700">Buscar música no YouTube</label>
              <input disabled className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-400" placeholder="Funcionalidade em breve" />
              <div className="mt-5 rounded-2xl bg-blue-50 p-5 text-sm leading-6 text-blue-700">
                <p className="font-bold">Você pode continuar sem música.</p>
                <p>Quando essa integração for ativada, a base visual já estará pronta.</p>
              </div>
            </Card>
          </>
        )}

        {etapa === 'revisao' && (
          <>
            <Card className="bg-slate-50">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-500">Revisão</p>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">Confira e finalize</h1>
              <p className="mt-3 leading-7 text-slate-600">Depois de criar a retrospectiva, você será direcionado para o pagamento.</p>
            </Card>

            <Card>
              <h2 className="text-xl font-black">Resumo</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <p><span className="block text-sm text-slate-500">Plano</span><strong>{plano.nome} - R$ {plano.preco.toFixed(2).replace('.', ',')}</strong></p>
                <p><span className="block text-sm text-slate-500">Acesso</span><strong>{plano.acesso}</strong></p>
                <p><span className="block text-sm text-slate-500">Email</span><strong>{form.email || 'Não informado'}</strong></p>
                <p><span className="block text-sm text-slate-500">Casal</span><strong>{form.nomeRemetente || 'Você'} & {form.nomeDestinatario || 'Pessoa especial'}</strong></p>
                <p><span className="block text-sm text-slate-500">Data de início</span><strong>{formatarData(form.dataRelacionamento) || 'Não informada'}</strong></p>
                <p><span className="block text-sm text-slate-500">Fotos</span><strong>{form.fotos.length} de {limiteFotos}</strong></p>
                <p><span className="block text-sm text-slate-500">Música</span><strong>Sem música por enquanto</strong></p>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-black">Mensagem principal</h2>
              <textarea className="mt-4 h-32 w-full rounded-xl border border-slate-200 px-4 py-3 outline-pink-300" placeholder="Escreva uma dedicatória final..." value={form.mensagem} onChange={(e) => atualizar('mensagem', e.target.value)} />
            </Card>

            <Card className={`flex items-start gap-3 ${termosDestacados ? 'border-red-300 bg-red-50 shadow-red-100/60' : ''}`}>
              <input id="termos" type="checkbox" checked={form.termos} onChange={(e) => atualizar('termos', e.target.checked)} />
              <div>
                <label htmlFor="termos" className="text-sm text-slate-700">
                  Eu li e concordo com os{' '}
                  <Link href="/termos-de-uso" target="_blank" className="font-bold text-pink-600 underline underline-offset-4">
                    termos de uso
                  </Link>.
                </label>
                {termosDestacados && (
                  <p className="mt-2 text-sm font-semibold text-red-600">Você precisa aceitar os termos para continuar.</p>
                )}
              </div>
            </Card>

            <Card className="text-center">
              <h2 className="text-2xl font-black">Finalizar criação</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600">Vamos criar sua retrospectiva, salvar as fotos e abrir o checkout do Mercado Pago.</p>
              <button
                type="button"
                disabled={carregando}
                aria-disabled={!form.termos}
                onClick={finalizar}
                className={`mt-7 w-full rounded-xl px-8 py-4 font-bold text-white shadow-lg transition sm:w-auto ${form.termos ? 'bg-[#d85f7a] shadow-rose-200 hover:bg-pink-600' : 'cursor-not-allowed bg-slate-300 shadow-slate-100'}`}
              >
                {carregando ? 'Finalizando...' : 'Finalizar e pagar'}
              </button>
            </Card>
          </>
        )}

        <div className="flex items-center justify-between gap-4 pb-10">
          {etapaAnterior ? (
            <button type="button" onClick={() => irPara(etapaAnterior)} className="rounded-xl bg-white px-5 py-3 font-bold text-slate-600 shadow-sm">
              Voltar
            </button>
          ) : <span />}

          {etapa !== 'revisao' && (
            <button
              type="button"
              onClick={avancar}
              className="rounded-xl bg-[#d85f7a] px-7 py-3 font-bold text-white shadow-lg shadow-rose-200"
            >
              Próximo
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
