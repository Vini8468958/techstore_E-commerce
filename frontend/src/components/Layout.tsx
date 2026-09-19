import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
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