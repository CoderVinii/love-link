export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px',
      /* Gradiente suave de cima para baixo */
      background: 'linear-gradient(180deg, #fff0f5 0%, #fff5f7 100%)'
    }}>
      <div style={{ maxWidth: '720px', textAlign: 'center' }}>

        {/* Tag pequena */}
        <div style={{
          display: 'inline-block',
          backgroundColor: '#fce7f3',
          color: '#e91e8c',
          padding: '6px 18px', borderRadius: '999px',
          fontSize: '13px', fontWeight: '600', marginBottom: '28px'
        }}>
          ✨ O presente digital mais especial
        </div>

        {/* Título grande — fonte menor no mobile via fontSize responsivo */}
        <h1 style={{
          fontSize: 'clamp(36px, 7vw, 72px)',
          /* clamp(mínimo, ideal, máximo) — se adapta ao tamanho da tela */
          fontWeight: '800', lineHeight: 1.1, marginBottom: '24px',
          color: '#1a1a2e'
        }}>
          Crie um site{' '}
          <span style={{ color: '#e91e8c' }}>feito de amor.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2.5vw, 20px)',
          color: '#6b7280', marginBottom: '40px',
          lineHeight: 1.7
        }}>
          Um presente único, suas fotos, sua música, sua declaração.
          Tudo em uma página exclusiva com contador do tempo juntos.
          Pronto em 3 minutos.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#preco" style={{
            backgroundColor: '#e91e8c', color: 'white',
            padding: '16px 32px', borderRadius: '999px',
            fontWeight: '700', fontSize: '16px', textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(233,30,140,0.3)'
          }}>
            ✨ Criar minha página
          </a>
          <a href="#como-funciona" style={{
            border: '2px solid #fce7f3',
            backgroundColor: 'white',
            color: '#6b7280',
            padding: '16px 32px', borderRadius: '999px',
            fontWeight: '600', fontSize: '16px', textDecoration: 'none'
          }}>
            Ver exemplo
          </a>
        </div>

        {/* Números de prova social como no DearYou */}
        <div style={{
          display: 'flex', gap: '40px', justifyContent: 'center',
          marginTop: '56px', flexWrap: 'wrap'
        }}>
          {[
            { numero: '10.847+', label: 'páginas criadas' },
            { numero: '23.200+', label: 'pessoas surpresas' },
            { numero: '4.9', label: '★ avaliação' },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#e91e8c' }}>{item.numero}</div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>{item.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}