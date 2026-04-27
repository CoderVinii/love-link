'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { buildMensagemPayload, getPlano, PLANOS } from '../../lib/presentePayload'

const STORAGE_KEY = 'lovelink-retrospectiva'
const etapas = [
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
  plano: 'premium',
  fotos: [],
  termos: false,
}

function lerEstado() {
  if (typeof window === 'undefined') return estadoInicial

  try {
    const salvo = window.localStorage.getItem(STORAGE_KEY)
    return salvo ? { ...estadoInicial, ...JSON.parse(salvo) } : estadoInicial
  } catch {
    return estadoInicial
  }
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return new Blob([bytes], { type: mime })
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
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
  const atualIndex = etapas.findIndex(([key]) => key === etapaAtual)
  const progresso = ((atualIndex + 1) / etapas.length) * 100

  return (
    <div className="mx-auto mb-10 max-w-4xl">
      <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-2 text-2xl font-black text-pink-600">
        <span>💌</span>
        <span>Lovelink</span>
      </Link>
      <div className="h-2 overflow-hidden rounded-full bg-rose-100">
        <div className="h-full rounded-full bg-[#d85f7a] transition-all" style={{ width: `${progresso}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs font-bold text-slate-400">
        {etapas.map(([key, label], index) => (
          <span key={key} className={index <= atualIndex ? 'text-pink-600' : ''}>{label}</span>
        ))}
      </div>
    </div>
  )
}

function Card({ children, className = '' }) {
  return (
    <section className={`rounded-3xl border border-rose-100 bg-white p-8 shadow-xl shadow-rose-100/60 ${className}`}>
      {children}
    </section>
  )
}

function Opcao({ ativo, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-5 py-4 font-semibold transition ${ativo ? 'border-[#d85f7a] bg-rose-50 text-[#d85f7a]' : 'border-slate-200 bg-white hover:border-rose-200'}`}
    >
      {children}
    </button>
  )
}

export default function RetrospectivaFlow({ etapa }) {
  const router = useRouter()
  const [form, setForm] = useState(estadoInicial)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    setForm(lerEstado())
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    }
  }, [form])

  const plano = useMemo(() => getPlano(form.plano), [form.plano])

  function atualizar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function irPara(proximaEtapa) {
    setErro('')
    router.push(`/criar/${proximaEtapa}`)
  }

  function validarInformacoes() {
    if (!form.email || !form.nomeRemetente || !form.nomeDestinatario || !form.dataRelacionamento) {
      setErro('Preencha email, nomes e data para continuar.')
      return false
    }
    return true
  }

  async function adicionarFotos(files) {
    const arquivos = Array.from(files || [])
    const limite = 8 - form.fotos.length

    if (arquivos.length > limite) {
      setErro(`Você pode adicionar no máximo 8 fotos. Ainda cabem ${limite}.`)
      return
    }

    const novasFotos = await Promise.all(
      arquivos.map(async (file, index) => {
        const ordem = form.fotos.length + index
        return {
          id: `${Date.now()}-${file.name}-${index}`,
          name: file.name,
          preview: await fileToDataUrl(file),
          title: gerarTitulo(ordem),
          description: gerarDescricao(ordem),
        }
      })
    )

    setErro('')
    setForm((atual) => ({ ...atual, fotos: [...atual.fotos, ...novasFotos] }))
  }

  function removerFoto(id) {
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

  async function uploadFotos(idPresente) {
    const urls = []

    for (let i = 0; i < form.fotos.length; i++) {
      const foto = form.fotos[i]
      const blob = dataUrlToBlob(foto.preview)
      const nomeArquivo = `${idPresente}/foto-${i}-${Date.now()}-${foto.name || 'foto.jpg'}`

      const { error } = await supabase.storage
        .from('fotos')
        .upload(nomeArquivo, blob, { contentType: blob.type })

      if (error) throw error

      const { data } = supabase.storage
        .from('fotos')
        .getPublicUrl(nomeArquivo)

      urls.push(data.publicUrl)
    }

    return urls
  }

  async function finalizar() {
    setErro('')

    if (!validarInformacoes()) return
    if (form.fotos.length < 3) {
      setErro('Adicione pelo menos 3 fotos para criar a retrospectiva.')
      return
    }
    if (!form.termos) {
      setErro('Confirme os termos para finalizar.')
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

      const { data: presente, error: erroInsert } = await supabase
        .from('presentes')
        .insert({
          nome_remetente: form.nomeRemetente,
          nome_destinatario: form.nomeDestinatario,
          data_relacionamento: form.dataRelacionamento,
          mensagem: payload,
          musica_url: '',
          fotos_urls: '',
          pago: false,
        })
        .select()
        .single()

      if (erroInsert) throw erroInsert

      const urlsFotos = await uploadFotos(presente.id)

      const { error: erroUpdate } = await supabase
        .from('presentes')
        .update({ fotos_urls: urlsFotos.join(',') })
        .eq('id', presente.id)

      if (erroUpdate) throw erroUpdate

      window.localStorage.removeItem(STORAGE_KEY)
      router.push(`/pagamento?id=${presente.id}`)
    } catch (err) {
      console.error('Erro ao finalizar retrospectiva:', err)
      setErro('Não foi possível finalizar agora. Confira sua conexão e tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff7f7] px-5 py-10 text-[#201629]">
      <Progresso etapaAtual={etapa} />

      <div className="mx-auto max-w-4xl space-y-8">
        {erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {erro}
          </div>
        )}

        {etapa === 'informacoes' && (
          <>
            <h1 className="text-center text-4xl font-black">Informações básicas</h1>
            <Card>
              <label className="text-xl font-black">✉️ Digite seu email *</label>
              <input className="mt-5 w-full rounded-xl border border-slate-200 px-5 py-4 text-lg outline-pink-300" placeholder="Digite seu email" value={form.email} onChange={(e) => atualizar('email', e.target.value)} />
            </Card>

            <Card>
              <h2 className="text-xl font-black">Selecione seu sexo *</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {['masculino', 'feminino', 'outro'].map((sexo) => (
                  <Opcao key={sexo} ativo={form.sexo === sexo} onClick={() => atualizar('sexo', sexo)}>
                    {sexo[0].toUpperCase() + sexo.slice(1)}
                  </Opcao>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-black">Para quem é a retrospectiva?</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {['Namorada', 'Namorado', 'Esposa', 'Esposo', 'Mãe', 'Pai', 'Amigo', 'Outro'].map((tipo) => (
                  <Opcao key={tipo} ativo={form.destinatarioTipo === tipo} onClick={() => atualizar('destinatarioTipo', tipo)}>
                    {tipo}
                  </Opcao>
                ))}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input className="rounded-xl border border-slate-200 px-5 py-4 outline-pink-300" placeholder="Seu nome" value={form.nomeRemetente} onChange={(e) => atualizar('nomeRemetente', e.target.value)} />
                <input className="rounded-xl border border-slate-200 px-5 py-4 outline-pink-300" placeholder="Nome da pessoa especial" value={form.nomeDestinatario} onChange={(e) => atualizar('nomeDestinatario', e.target.value)} />
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-black">Data de início do relacionamento</h2>
              <input className="mt-5 w-full rounded-xl border border-slate-200 px-5 py-4 outline-pink-300" type="date" value={form.dataRelacionamento} onChange={(e) => atualizar('dataRelacionamento', e.target.value)} />
            </Card>

            <Card className="flex items-center gap-3">
              <input type="checkbox" checked={form.ocultarSigno} onChange={(e) => atualizar('ocultarSigno', e.target.checked)} />
              <span>Ocultar signo do zodíaco na retrospectiva</span>
            </Card>
          </>
        )}

        {etapa === 'fotos' && (
          <>
            <Card className="flex gap-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rose-50 text-2xl">🖼️</div>
              <div>
                <h1 className="text-2xl font-black">Vamos começar a criar sua retrospectiva!</h1>
                <p className="mt-2 text-slate-600">Adicione de 3 a 8 fotos. Cada foto vira um capítulo com título e descrição editáveis.</p>
              </div>
            </Card>

            {form.fotos.length === 0 && (
              <Card className="text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-rose-50 text-5xl">🖼️</div>
                <h2 className="mt-6 text-2xl font-black">Comece adicionando uma foto</h2>
                <p className="mx-auto mt-3 max-w-xl text-slate-600">Escolha fotos especiais e escreva uma frase para cada momento.</p>
                <label className="mt-8 inline-block cursor-pointer rounded-xl bg-[#d85f7a] px-7 py-4 font-bold text-white">
                  + Escolher fotos
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => adicionarFotos(e.target.files)} />
                </label>
              </Card>
            )}

            {form.fotos.map((foto, index) => (
              <Card key={foto.id}>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black">
                    <span className="mr-3 rounded-full bg-rose-50 px-3 py-2 text-sm text-[#d85f7a]">{index + 1}</span>
                    {foto.title || `Momento ${index + 1}`}
                  </h2>
                  <button type="button" onClick={() => removerFoto(foto.id)} className="text-sm font-bold text-red-500">Remover</button>
                </div>
                <label className="mt-6 block text-sm font-bold text-slate-600">Título ({foto.title.length}/80)</label>
                <textarea className="mt-2 w-full rounded-xl border border-slate-200 px-5 py-4 outline-pink-300" maxLength={80} value={foto.title} onChange={(e) => atualizarFoto(foto.id, 'title', e.target.value)} />
                <label className="mt-5 block text-sm font-bold text-slate-600">Descrição ({foto.description.length}/250)</label>
                <textarea className="mt-2 w-full rounded-xl border border-slate-200 px-5 py-4 outline-pink-300" maxLength={250} value={foto.description} onChange={(e) => atualizarFoto(foto.id, 'description', e.target.value)} />
                <div className="mt-5 rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center">
                  <img src={foto.preview} alt={foto.title} className="mx-auto max-h-56 rounded-xl object-cover" />
                </div>
              </Card>
            ))}

            {form.fotos.length > 0 && form.fotos.length < 8 && (
              <div className="text-center">
                <label className="inline-block cursor-pointer rounded-xl bg-white px-7 py-4 font-bold text-[#d85f7a] shadow-lg shadow-rose-100">
                  📷 Adicionar nova foto ({form.fotos.length}/8)
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => adicionarFotos(e.target.files)} />
                </label>
                <p className="mx-auto mt-5 max-w-lg rounded-2xl bg-rose-50 p-5 text-sm leading-6 text-slate-600">
                  Dica: use pelo menos 3 fotos para que a retrospectiva tenha começo, meio e final.
                </p>
              </div>
            )}
          </>
        )}

        {etapa === 'musica' && (
          <>
            <Card className="flex gap-5 bg-slate-50">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-2xl">🎵</div>
              <div>
                <h1 className="text-2xl font-black">Escolha a música perfeita</h1>
                <p className="mt-2 text-slate-600">A etapa de música já está no fluxo, mas ficará sem funcionalidade por enquanto.</p>
              </div>
            </Card>
            <Card>
              <h2 className="text-2xl font-black">Música de fundo</h2>
              <label className="mt-6 block text-sm font-bold text-slate-700">Buscar música no YouTube</label>
              <input disabled className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-400" placeholder="Funcionalidade em breve" />
              <div className="mt-6 rounded-2xl bg-blue-50 p-5 text-sm leading-6 text-blue-700">
                <p className="font-bold">Por enquanto, você pode continuar sem música.</p>
                <p>Assim mantemos o pagamento e a entrega do presente estáveis antes de ativar integrações externas.</p>
              </div>
            </Card>
          </>
        )}

        {etapa === 'revisao' && (
          <>
            <Card className="flex gap-5 bg-slate-50">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-2xl">✅</div>
              <div>
                <h1 className="text-2xl font-black">Revise e finalize!</h1>
                <p className="mt-2 text-slate-600">Confira os detalhes, escolha o plano e prossiga para pagamento.</p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-black">Resumo das informações</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <p><span className="block text-sm text-slate-500">Email</span><strong>{form.email || 'Não informado'}</strong></p>
                <p><span className="block text-sm text-slate-500">Fotos</span><strong>{form.fotos.length} foto{form.fotos.length === 1 ? '' : 's'}</strong></p>
                <p><span className="block text-sm text-slate-500">Data de início</span><strong>{form.dataRelacionamento || 'Não informada'}</strong></p>
                <p><span className="block text-sm text-slate-500">Música</span><strong>Sem música por enquanto</strong></p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-black">Escolha o plano perfeito</h2>
              <div className="mt-6 grid gap-4">
                {Object.entries(PLANOS).map(([key, item]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => atualizar('plano', key)}
                    className={`rounded-2xl border p-6 text-left transition ${form.plano === key ? 'border-[#d85f7a] bg-rose-50' : 'border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xl font-black">{item.nome}</p>
                        <p className="mt-1 text-3xl font-black text-[#d85f7a]">R$ {item.preco.toFixed(2).replace('.', ',')}</p>
                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                          <p>✓ Até {item.fotos} fotos</p>
                          <p>✓ {item.acesso}</p>
                          <p>✓ {item.musica}</p>
                        </div>
                      </div>
                      <span className={`mt-1 h-5 w-5 rounded-full border ${form.plano === key ? 'border-[#d85f7a] bg-[#d85f7a]' : 'border-slate-300'}`} />
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-center text-sm text-[#d85f7a]">
                💝 Plano selecionado: {plano.nome} por R$ {plano.preco.toFixed(2).replace('.', ',')}
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-black">Mensagem principal</h2>
              <textarea className="mt-5 h-32 w-full rounded-xl border border-slate-200 px-5 py-4 outline-pink-300" placeholder="Escreva uma dedicatória final..." value={form.mensagem} onChange={(e) => atualizar('mensagem', e.target.value)} />
            </Card>

            <Card className="flex items-center gap-3">
              <input type="checkbox" checked={form.termos} onChange={(e) => atualizar('termos', e.target.checked)} />
              <span>Eu li e concordo com os termos de uso.</span>
            </Card>

            <Card className="text-center">
              <h2 className="text-2xl font-black">Finalizar criação</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600">Clique abaixo para criar sua retrospectiva e prosseguir para o pagamento.</p>
              <button type="button" disabled={carregando} onClick={finalizar} className="mt-8 rounded-xl bg-[#d85f7a] px-8 py-4 font-bold text-white disabled:opacity-60">
                {carregando ? 'Finalizando...' : 'Finalizar retrospectiva'}
              </button>
            </Card>
          </>
        )}

        <div className="flex items-center justify-between pb-10">
          {etapa !== 'informacoes' ? (
            <button type="button" onClick={() => irPara(etapas[etapas.findIndex(([key]) => key === etapa) - 1][0])} className="font-bold">
              Voltar
            </button>
          ) : <span />}

          {etapa !== 'revisao' && (
            <button
              type="button"
              onClick={() => {
                if (etapa === 'informacoes' && !validarInformacoes()) return
                if (etapa === 'fotos' && form.fotos.length < 3) {
                  setErro('Adicione pelo menos 3 fotos para continuar.')
                  return
                }
                irPara(etapas[etapas.findIndex(([key]) => key === etapa) + 1][0])
              }}
              className="rounded-xl bg-[#d85f7a] px-8 py-4 font-bold text-white shadow-lg shadow-rose-200"
            >
              Próximo →
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
