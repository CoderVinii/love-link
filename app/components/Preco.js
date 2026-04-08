export default function Preco() {
  const itens = [
    '💌 Página personalizada única',
    '🖼️ Até 7 fotos no seu presente',
    '🎵 Música do Spotify integrada',
    '✍️ Mensagem personalizada',
    '🔗 Link exclusivo para enviar',
    '♾️ Página disponível para sempre',
  ]

  return (
    <section id="preco" style={{ padding: '96px 24px', backgroundColor: '#fff0f5' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>

        <div style={{
          display: 'inline-block', backgroundColor: '#fce7f3',
          color: '#e91e8c', padding: '4px 16px',
          borderRadius: '999px', fontSize: '12px',
          fontWeight: '600', marginBottom: '16px', letterSpacing: '1px'
        }}>
          PLANOS
        </div>

        <h2 style={{
          fontSize: 'clamp(26px, 5vw, 42px)',
          fontWeight: '800', marginBottom: '12px', color: '#1a1a2e'
        }}>
          Quanto vale fazer{' '}
          <span style={{ color: '#e91e8c' }}>alguém chorar de emoção?</span>
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '40px', fontSize: '15px' }}>
          Menos que um buquê de flores. Um pagamento único.
        </p>

        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e91e8c',
          borderRadius: '24px', padding: '40px',
          boxShadow: '0 8px 40px rgba(233,30,140,0.15)'
        }}>
          <span style={{ color: '#9ca3af', fontSize: '15px' }}>por apenas</span>

          {/* Preço em tamanho responsivo para não quebrar */}
          <div style={{
            fontSize: 'clamp(40px, 12vw, 72px)',
            fontWeight: '800', color: '#e91e8c',
            margin: '8px 0', lineHeight: 1
          }}>
            R$ 19,90
          </div>
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>pagamento único</span>

          <ul style={{
            textAlign: 'left', margin: '32px 0',
            listStyle: 'none', display: 'flex',
            flexDirection: 'column', gap: '12px'
          }}>
            {itens.map((item) => (
              <li key={item} style={{
                display: 'flex', alignItems: 'center',
                gap: '12px', color: '#374151', fontSize: '15px'
              }}>
                <span style={{ color: '#e91e8c', fontWeight: 'bold' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>

          <a href="/editor" style={{
            display: 'block', backgroundColor: '#e91e8c',
            color: 'white', padding: '18px',
            borderRadius: '999px', fontWeight: '700',
            fontSize: '16px', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(233,30,140,0.35)'
          }}>
            Criar minha página agora 💕
          </a>
        </div>

      </div>
    </section>
  )
}