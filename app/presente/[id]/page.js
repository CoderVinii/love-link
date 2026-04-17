import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function Presente({ params, searchParams }) {
  const rawId = params.id
  const id = Number(rawId.split('?')[0])

  if (isNaN(id)) {
    throw new Error('ID inválido')
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: presente } = await supabase
    .from('presentes')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!presente) notFound()

  // 🔥 CORREÇÃO AQUI
  const statusFromUrl =
    searchParams?.status || searchParams?.collection_status

  if (!presente.pago && statusFromUrl !== 'approved') {
    redirect(`/pagamento?id=${id}`)
  }

  const fotos = presente.fotos_urls
    ? presente.fotos_urls.split(',').filter(url => url.trim() !== '')
    : []

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#f472b6', fontSize: '14px', marginBottom: '8px' }}>
            Uma mensagem especial de
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '4px' }}>
            {presente.nome_remetente}
          </h1>
          <p style={{ color: '#9ca3af' }}>para</p>
          <h2 style={{ fontSize: '48px', fontWeight: '800', color: '#f472b6' }}>
            {presente.nome_destinatario} 💕
          </h2>
          {presente.data_relacionamento && (
            <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '14px' }}>
              Juntos desde {new Date(presente.data_relacionamento).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        {presente.musica_url && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ color: '#f472b6', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>
              🎵 Nossa música
            </p>
            <iframe
              src={presente.musica_url
                .replace('open.spotify.com/track/', 'open.spotify.com/embed/track/')
                .replace('open.spotify.com/playlist/', 'open.spotify.com/embed/playlist/')
              }
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              style={{ borderRadius: '12px' }}
            />
          </div>
        )}

        <div style={{
          backgroundColor: '#111827',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid #1f2937'
        }}>
          <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#e5e7eb', fontStyle: 'italic' }}>
            &ldquo;{presente.mensagem}&rdquo;
          </p>
          <p style={{ color: '#f472b6', marginTop: '16px', fontWeight: '600' }}>
            — {presente.nome_remetente} ❤️
          </p>
        </div>

        {fotos.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <p style={{ color: '#f472b6', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
              📸 Nossas memórias
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: fotos.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              gap: '8px'
            }}>
              {fotos.map((url, i) => (
                <img
                  key={i}
                  src={url.trim()}
                  alt={`Memória ${i + 1}`}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #1f2937' }}>
          <p style={{ color: '#4b5563', fontSize: '12px' }}>
            Feito com 💕 no{' '}
            <Link href="/" style={{ color: '#f472b6', textDecoration: 'none' }}>
              Lovelink
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}