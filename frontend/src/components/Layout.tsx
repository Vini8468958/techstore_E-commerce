/**
 * Layout compartilhado pelas páginas da loja.
 * O <Outlet /> é o ponto onde o React Router renderiza a página atual.
 */

import { Outlet } from 'react-router-dom'
import Header from './Header'

// Renderiza a estrutura fixa usada pelas páginas internas.
export default function Layout() {
  return (
    <div className="app-shell">
      {/* Cabeçalho permanece presente durante a navegação. */}
      <Header />
      {/* A rota ativa é renderizada aqui pelo React Router. */}
      <main><Outlet /></main>
      <footer className="footer">
        <div className="container footer-grid">
          <div><strong className="logo-text">Tech<span>Store</span></strong><p>Seu e-commerce de tecnologia, construído com React + TypeScript.</p></div>
          <div><strong>Atendimento</strong><p>Seg–Sex • 08h às 18h</p><p>contato@techstore.dev</p></div>
          <div><strong>Projeto</strong><p>Portfólio acadêmico Full-Stack</p><p>React • NestJS • PostgreSQL</p></div>
        </div>
      </footer>
    </div>
  )
}
