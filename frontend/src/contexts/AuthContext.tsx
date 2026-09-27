/**
 * Contexto global de autenticação.
 * Ele mantém o usuário logado disponível para toda a aplicação e persiste
 * a sessão de demonstração no localStorage.
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { User } from '../types'

// Contrato dos valores e funções que qualquer componente poderá consumir.
type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => void
  updateName: (name: string) => void
}

// O contexto começa como null e recebe valor dentro do AuthProvider.
const AuthContext = createContext<AuthContextValue | null>(null)

// Recupera uma sessão salva no navegador quando a aplicação é carregada.
const getInitialUser = (): User | null => {
  const raw = localStorage.getItem('techstore_user')
  if (!raw) return null
  try { return JSON.parse(raw) as User } catch { return null }
}

// Provider que mantém o estado do usuário e o compartilha com seus filhos.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser)

  // Atualiza o React e o localStorage ao mesmo tempo.
  const persist = (value: User | null) => {
    setUser(value)
    if (value) localStorage.setItem('techstore_user', JSON.stringify(value))
    else localStorage.removeItem('techstore_user')
  }

// Login fictício: qualquer e-mail funciona; e-mails contendo 'admin' recebem role ADMIN.
  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Informe e-mail e senha.')
    await new Promise(resolve => setTimeout(resolve, 350))
    const isAdmin = email.toLowerCase().includes('admin')
    const next: User = { id: isAdmin ? 1 : 2, name: isAdmin ? 'Administrador' : 'Cliente TechStore', email, role: isAdmin ? 'ADMIN' : 'CUSTOMER' }
    persist(next)
    return next
  }

// Cadastro fictício: valida campos básicos e cria um usuário CUSTOMER localmente.
  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || password.length < 6) throw new Error('Preencha os dados e use uma senha com pelo menos 6 caracteres.')
    await new Promise(resolve => setTimeout(resolve, 350))
    const next: User = { id: Date.now(), name, email, role: 'CUSTOMER' }
    persist(next)
    return next
  }

  // Atualiza somente o nome preservando os outros dados do usuário.
  const updateName = (name: string) => user && persist({ ...user, name })
  const value = useMemo(() => ({ user, login, register, logout: () => persist(null), updateName }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook auxiliar para consumir o AuthContext sem repetir useContext em todas as páginas.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
