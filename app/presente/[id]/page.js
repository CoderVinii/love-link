import { createClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'

function getSpotifyEmbedUrl(url) {
  if (!url) return ''

  return url
    .replace('open.spotify.com/track/', 'open.spotify.com/embed/track/')
    .replace('open.spotify.com/playlist/', 'open.spotify.com/embed/playlist/')
}

export default async function Presente({ params }) {
  const { id: rawId } = await params
  const id = Number(rawId)

  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase public environment variables are missing.')
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data: presente, error } = await supabase
    .from('presentes')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao buscar presente: ${error.message}`)
  }

  if (!presente) {
    notFound()
  }

  if (!presente.pago) {
    redirect(`/pagamento?id=${id}`)
  }

  const fotos = presente.fotos_urls
    ? presente.fotos_urls.split(',').map((url) => url.trim()).filter(Boolean)
    : []

  const musicaEmbedUrl = getSpotifyEmbedUrl(presente.musica_url)

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white' }}>
      <section style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#f472b6', fontSize: '14px', marginBottom: '8px' }}>
            Uma mensagem especial de
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '4px' }}>
            {presente.nome_remetente}
          </h1>
          <p style={{ color: '#9ca3af' }}>para</p>
          <h2 style={{ fontSize: '48px', fontWeight: '800', color: '#f472b6' }}>
            {presente.nome_destinatario}
          </h2>
          {presente.data_relacionamento && (
            <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '14px' }}>
              Juntos desde {new Date(presente.data_relacionamento).toLocaleDateString('pt-BR')}
            </p>
          )}
        </header>

        {musicaEmbedUrl && (
          <section style={{ marginBottom: '32px' }}>
            <p style={{ color: '#f472b6', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>
              Nossa música
            </p>
            <iframe
              title="Musica do presente"
              src={musicaEmbedUrl}
              width="100%"
              height="80"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              style={{ borderRadius: '12px', border: 0 }}
            />
          </section>
        )}

        <section style={{
          backgroundColor: '#111827',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid #1f2937'
        }}>
          <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#e5e7eb', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
            &ldquo;{presente.mensagem}&rdquo;
          </p>
          <p style={{ color: '#f472b6', marginTop: '16px', fontWeight: '600' }}>
            - {presente.nome_remetente}
          </p>
        </section>

        {fotos.length > 0 && (
          <section>
            <p style={{ color: '#f472b6', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
              Nossas memórias
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: fotos.length === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))',
              gap: '8px'
            }}>
              {fotos.map((url, i) => (
                <img
                  key={url}
                  src={url}
                  alt={`Foto ${i + 1} do presente`}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}
