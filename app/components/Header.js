export default function Header() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      backgroundColor: 'rgba(255,245,247,0.9)',
      borderBottom: '1px solid #fce7f3',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '22px' }}>💌</span>
          <span style={{ fontWeight: '800', fontSize: '20px', color: '#e91e8c' }}>Lovelink</span>
        </div>

        <a href="#preco" style={{
          backgroundColor: '#e91e8c', color: 'white',
          padding: '10px 20px', borderRadius: '999px',
          fontWeight: '600', fontSize: '13px',
          textDecoration: 'none', whiteSpace: 'nowrap'
        }}>
          Criar minha página 💕
        </a>
      </div>
    </header>
  )
}
