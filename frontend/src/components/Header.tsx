import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const leave = () => { logout(); navigate('/'); setOpen(false) }
  return (
    <>
      <div className="topbar">Frete grátis acima de R$ 399 • Compra segura • Projeto de portfólio</div>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo-text">Tech<span>Store</span></Link>
          <button className="menu-button" onClick={() => setOpen(v => !v)} aria-label="Abrir menu">☰</button>
          <nav className={open ? 'nav open' : 'nav'} onClick={() => setOpen(false)}>
            <NavLink to="/">Início</NavLink>
            <NavLink to="/produtos">Produtos</NavLink>
            {user && <NavLink to="/pedidos">Pedidos</NavLink>}
            {user?.role === 'ADMIN' && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          <div className="header-actions">
            {user ? (
              <div className="user-menu"><Link to="/perfil" className="icon-link">👤 <span>{user.name.split(' ')[0]}</span></Link><button className="link-button" onClick={leave}>Sair</button></div>
            ) : <Link to="/login" className="icon-link">👤 <span>Entrar</span></Link>}
            <Link to="/carrinho" className="cart-link" aria-label="Carrinho">🛒<span>Carrinho</span>{count > 0 && <b>{count}</b>}</Link>
          </div>
        </div>
      </header>
    </>
  )
}