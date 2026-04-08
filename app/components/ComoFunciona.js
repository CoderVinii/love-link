'use client'
// 'use client' é necessário porque vamos usar useState (interatividade)
// No Next.js, componentes interativos precisam dessa declaração no topo

import { useState } from 'react'
// useState permite guardar e atualizar valores na tela
// Aqui vamos usá-lo para saber qual card está sendo exibido

const passos = [
  { numero: '01', emoji: '✨', titulo: 'Crie sua conta', descricao: 'Escolha o plano perfeito e preencha as informações do seu amor.' },
  { numero: '02', emoji: '💖', titulo: 'Personalize tudo', descricao: 'Fotos, música, texto, data. Monte a página dos sonhos em minutos.' },
  { numero: '03', emoji: '💌', titulo: 'Envie o link', descricao: 'Receba o link exclusivo e envie para a pessoa especial se apaixonar.' },
]

export default function ComoFunciona() {
  // atual = índice do card visível (começa em 0, ou seja, o primeiro)
  const [atual, setAtual] = useState(0)

  // Vai para o card anterior (não deixa passar do primeiro)
  function anterior() {
    setAtual((prev) => (prev > 0 ? prev - 1 : prev))
  }

  // Vai para o próximo card (não deixa passar do último)
  function proximo() {
    setAtual((prev) => (prev < passos.length - 1 ? prev + 1 : prev))
  }

  return (
    <section id="como-funciona" style={{ padding: '96px 24px', backgroundColor: '#fff5f7' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Título da seção */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block', backgroundColor: '#fce7f3',
            color: '#e91e8c', padding: '4px 16px',
            borderRadius: '999px', fontSize: '12px',
            fontWeight: '600', marginBottom: '16px', letterSpacing: '1px'
          }}>
            COMO FUNCIONA
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '800', color: '#1a1a2e'
          }}>
            Pronto em{' '}
            <span style={{ color: '#e91e8c' }}>3 minutos.</span>
          </h2>
        </div>

        {/* Card atual — fundo branco e claro */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #fce7f3',
          borderRadius: '24px',
          padding: '48px 40px',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(233,30,140,0.08)',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {passos[atual].emoji}
          </div>
          <div style={{
            color: '#e91e8c', fontWeight: '700',
            fontSize: '12px', marginBottom: '12px', letterSpacing: '1px'
          }}>
            {passos[atual].numero}
          </div>
          <h3 style={{
            fontSize: '22px', fontWeight: '800',
            marginBottom: '12px', color: '#1a1a2e'
          }}>
            {passos[atual].titulo}
          </h3>
          <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.7, maxWidth: '360px' }}>
            {passos[atual].descricao}
          </p>
        </div>

        {/* Controles do carrossel */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '32px'
        }}>

          {/* Seta esquerda */}
          <button
            onClick={anterior}
            style={{
              width: '44px', height: '44px',
              borderRadius: '50%',
              border: '2px solid #fce7f3',
              backgroundColor: atual === 0 ? '#fce7f3' : 'white',
              color: atual === 0 ? '#d1a0b8' : '#e91e8c',
              fontSize: '18px', cursor: atual === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            ‹
          </button>

          {/* Bolinhas indicadoras — mostram em qual card você está */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {passos.map((_, i) => (
              <button
                key={i}
                onClick={() => setAtual(i)}
                style={{
                  width: i === atual ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: i === atual ? '#e91e8c' : '#fce7f3',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                  /* A bolinha ativa fica maior e rosa — igual ao DearYou */
                }}
              />
            ))}
          </div>

          {/* Seta direita */}
          <button
            onClick={proximo}
            style={{
              width: '44px', height: '44px',
              borderRadius: '50%',
              border: '2px solid #fce7f3',
              backgroundColor: atual === passos.length - 1 ? '#fce7f3' : 'white',
              color: atual === passos.length - 1 ? '#d1a0b8' : '#e91e8c',
              fontSize: '18px', cursor: atual === passos.length - 1 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            ›
          </button>

        </div>
      </div>
    </section>
  )
}