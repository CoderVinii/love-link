export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #fce7f3',
      padding: '32px 24px',
      textAlign: 'center',
      color: '#9ca3af',
      backgroundColor: '#fff5f7'
    }}>
      <p style={{ fontWeight: '600', color: '#e91e8c', marginBottom: '4px' }}>💌 Lovelink</p>
      <p style={{ fontSize: '13px' }}>Feito com amor © {new Date().getFullYear()}</p>
    </footer>
  )
}