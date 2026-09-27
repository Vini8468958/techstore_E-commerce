/**
 * Páginas de autenticação da aplicação.
 * Contém LoginPage, RegisterPage e o layout visual reutilizado por ambas.
 */

import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Tela de login; o envio do formulário chama login() do AuthContext.
export function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation()
  const [email,setEmail] = useState(''); const [password,setPassword] = useState(''); const [error,setError] = useState(''); const [loading,setLoading]=useState(false)
  const submit = async (e:FormEvent) => { e.preventDefault(); setError(''); setLoading(true); try { const user = await login(email,password); const from = (location.state as {from?:string}|null)?.from; navigate(from || (user.role === 'ADMIN' ? '/admin' : '/')) } catch(err) { setError((err as Error).message) } finally { setLoading(false) } }
  return <AuthShell title="Bem-vindo de volta" subtitle="Entre para acessar seus pedidos e benefícios."><form onSubmit={submit} className="form"><label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com" required /></label><label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required /></label>{error && <div className="form-error">{error}</div>}<button className="btn btn-primary full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button><div className="demo-box"><strong>Acesso demo</strong><p>Cliente: qualquer e-mail.</p><p>Admin: use um e-mail contendo <b>admin</b>.</p></div><p className="auth-switch">Ainda não possui conta? <Link to="/cadastro">Criar conta</Link></p></form></AuthShell>
}

// Tela de cadastro; cria um usuário local de demonstração.
export function RegisterPage() {
  const { register } = useAuth(); const navigate = useNavigate(); const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
  const submit=async(e:FormEvent)=>{e.preventDefault();setError('');setLoading(true);try{await register(name,email,password);navigate('/')}catch(err){setError((err as Error).message)}finally{setLoading(false)}}
  return <AuthShell title="Crie sua conta" subtitle="Cadastre-se para comprar e acompanhar pedidos."><form onSubmit={submit} className="form"><label>Nome completo<input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome" required /></label><label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com" required /></label><label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required /></label>{error && <div className="form-error">{error}</div>}<button className="btn btn-primary full" disabled={loading}>{loading?'Criando...':'Criar conta'}</button><p className="auth-switch">Já possui conta? <Link to="/login">Entrar</Link></p></form></AuthShell>
}

// Estrutura visual compartilhada pelas telas de login e cadastro.
function AuthShell({title,subtitle,children}:{title:string;subtitle:string;children:ReactNode}) { return <section className="auth-page"><div className="auth-card"><Link to="/" className="logo-text auth-logo">Tech<span>Store</span></Link><h1>{title}</h1><p>{subtitle}</p>{children}</div><div className="auth-side"><div><span className="hero-kicker">Projeto Full-Stack</span><h2>Uma experiência completa de e-commerce.</h2><p>Autenticação, produtos, carrinho, checkout, pedidos e painel administrativo.</p></div></div></section> }
