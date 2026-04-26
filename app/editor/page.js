'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function Editor() {
  const router = useRouter()

  const [form, setForm] = useState({
    nomeRemetente: '',
    nomeDestinatario: '',
    dataRelacionamento: '',
    mensagem: '',
    musica: '',
  })

  const [fotos, setFotos] = useState([])
  const [etapa, setEtapa] = useState(1)
  const [carregando, setCarregando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleFotos(e) {
    const arquivos = Array.from(e.target.files)
    if (arquivos.length > 7) {
      alert('Máximo de 7 fotos!')
      return
    }
    setFotos(arquivos)
  }

  async function uploadFotos(idPresente) {
    const urls = []
    for (let i = 0; i < fotos.length; i++) {
      const foto = fotos[i]
      const nomeArquivo = `${idPresente}/foto-${i}-${Date.now()}`

      const { error } = await supabase.storage
        .from('fotos')
        .upload(nomeArquivo, foto)

      if (error) {
        console.error('Erro ao fazer upload:', error)
        continue
      }

      const { data } = supabase.storage
        .from('fotos')
        .getPublicUrl(nomeArquivo)

      urls.push(data.publicUrl)
    }
    return urls
  }

  async function handleSubmit() {
    setCarregando(true)
    try {
      const { data: presente, error: erroInsert } = await supabase
        .from('presentes')
        .insert({
          nome_remetente: form.nomeRemetente,
          nome_destinatario: form.nomeDestinatario,
          data_relacionamento: form.dataRelacionamento,
          mensagem: form.mensagem,
          musica_url: form.musica,
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

      router.push(`/pagamento?id=${presente.id}`)
    } catch (erro) {
      console.error('Erro ao salvar:', erro)
      alert('Ocorreu um erro. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '2px solid #fce7f3',
    backgroundColor: 'white',
    fontSize: '15px',
    color: '#1a1a2e',
    outline: 'none',
    marginTop: '8px',
    fontFamily: 'Inter, sans-serif'
  }

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    display: 'block'
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff5f7',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '22px' }}>💌</span>
            <span style={{
              fontWeight: '800', fontSize: '22px',
              color: '#e91e8c', marginLeft: '8px'
            }}>
              Lovelink
            </span>
          </Link>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px',
          marginBottom: '40px'
        }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                backgroundColor: etapa >= n ? '#e91e8c' : '#fce7f3',
                color: etapa >= n ? 'white' : '#d1a0b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '13px'
              }}>
                {n}
              </div>
              {n < 3 && (
                <div style={{
                  width: '48px', height: '2px',
                  backgroundColor: etapa > n ? '#e91e8c' : '#fce7f3'
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid #fce7f3',
          boxShadow: '0 4px 24px rgba(233,30,140,0.08)'
        }}>
          {etapa === 1 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>
                Quem vai se apaixonar? 💕
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
                Vamos personalizar o presente com os nomes de vocês.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Seu nome</label>
                  <input style={inputStyle} type="text" name="nomeRemetente"
                    placeholder="Ex: João" value={form.nomeRemetente} onChange={handleChange} />
                </div>
                <div>
                  <label style={labelStyle}>Nome da pessoa especial</label>
                  <input style={inputStyle} type="text" name="nomeDestinatario"
                    placeholder="Ex: Maria" value={form.nomeDestinatario} onChange={handleChange} />
                </div>
                <div>
                  <label style={labelStyle}>Data do relacionamento</label>
                  <input style={inputStyle} type="date" name="dataRelacionamento"
                    value={form.dataRelacionamento} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {etapa === 2 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>
                Sua mensagem de amor ✍️
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
                Escreva o que você sente. Ela vai guardar para sempre.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Mensagem personalizada</label>
                  <textarea style={{ ...inputStyle, height: '160px', resize: 'vertical' }}
                    name="mensagem" placeholder="Escreva sua declaração de amor aqui... 💕"
                    value={form.mensagem} onChange={handleChange} />
                </div>
                <div>
                  <label style={labelStyle}>🎵 Música especial</label>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                    Cole o link da música no Spotify
                  </p>
                  <input style={inputStyle} type="text" name="musica"
                    placeholder="https://open.spotify.com/track/..."
                    value={form.musica} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>
                Suas fotos favoritas 🖼️
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
                Escolha até 7 fotos para aparecerem no presente.
              </p>

              <label style={{
                display: 'block', border: '2px dashed #fce7f3',
                borderRadius: '16px', padding: '40px',
                textAlign: 'center', cursor: 'pointer',
                backgroundColor: '#fff5f7'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📸</div>
                <p style={{ color: '#e91e8c', fontWeight: '600', marginBottom: '4px' }}>
                  Clique para escolher as fotos
                </p>
                <p style={{ color: '#9ca3af', fontSize: '13px' }}>
                  Máximo 7 fotos • JPG, PNG
                </p>
                <input type="file" accept="image/*" multiple
                  onChange={handleFotos} style={{ display: 'none' }} />
              </label>

              {fotos.length > 0 && (
                <>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px', marginTop: '20px'
                  }}>
                    {fotos.map((foto, index) => (
                      <div key={`${foto.name}-${index}`} style={{
                        borderRadius: '12px', overflow: 'hidden',
                        aspectRatio: '1', backgroundColor: '#fce7f3'
                      }}>
                        <img src={URL.createObjectURL(foto)} alt={`Foto ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                  <p style={{
                    textAlign: 'center', marginTop: '12px',
                    color: '#e91e8c', fontWeight: '600', fontSize: '14px'
                  }}>
                    {fotos.length} foto{fotos.length > 1 ? 's' : ''} selecionada{fotos.length > 1 ? 's' : ''} ✓
                  </p>
                </>
              )}
            </div>
          )}

          <div style={{
            display: 'flex', gap: '12px', marginTop: '32px',
            justifyContent: etapa > 1 ? 'space-between' : 'flex-end'
          }}>
            {etapa > 1 && (
              <button onClick={() => setEtapa(etapa - 1)} style={{
                padding: '14px 28px', borderRadius: '999px',
                border: '2px solid #fce7f3', backgroundColor: 'white',
                color: '#e91e8c', fontWeight: '600', fontSize: '15px', cursor: 'pointer'
              }}>
                ← Voltar
              </button>
            )}

            <button
              onClick={etapa < 3 ? () => setEtapa(etapa + 1) : handleSubmit}
              disabled={carregando}
              style={{
                padding: '14px 32px', borderRadius: '999px', border: 'none',
                backgroundColor: carregando ? '#f9a8d4' : '#e91e8c',
                color: 'white', fontWeight: '700', fontSize: '15px',
                cursor: carregando ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(233,30,140,0.3)'
              }}
            >
              {etapa < 3 ? 'Continuar →' : carregando ? 'Salvando... ⏳' : '💳 Ir para o pagamento'}
            </button>
          </div>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          color: '#9ca3af', fontSize: '13px'
        }}>
          🔒 Pagamento 100% seguro • Seus dados estão protegidos
        </p>
      </div>
    </div>
  )
}
