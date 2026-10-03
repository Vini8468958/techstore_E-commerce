/**
 * Contexto global de autenticação.
 * Ele mantém o usuário logado disponível para toda a aplicação e persiste
 * a sessão de demonstração no localStorage.
 */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../services/api'
import type { User } from '../types'

// Contrato dos valores e funções que qualquer componente poderá consumir.
type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => void
  updateName: (name: string) => Promise<User>
}

// O contexto começa como null e recebe valor dentro do AuthProvider.
const AuthContext = createContext<AuthContextValue | null>(null)

// Provider que mantém o estado do usuário e o compartilha com seus filhos.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('techstore_token')))

  useEffect(() => {
    if (!localStorage.getItem('techstore_token')) return
    api<User>('/auth/me')
      .then(next => { setUser(next); localStorage.setItem('techstore_user', JSON.stringify(next)) })
      .catch(() => { localStorage.removeItem('techstore_token'); localStorage.removeItem('techstore_user'); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  // Atualiza o React e o localStorage ao mesmo tempo.
  const persist = (value: User | null) => {
    setUser(value)
    if (value) localStorage.setItem('techstore_user', JSON.stringify(value))
    else {
      localStorage.removeItem('techstore_user')
      localStorage.removeItem('techstore_token')
    }
  }

  const login = async (email: string, password: string) => {
    const result = await api<{ user: User; accessToken: string }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('techstore_token', result.accessToken)
    const next = result.user
    persist(next)
    return next
  }

  const register = async (name: string, email: string, password: string) => {
    if (password.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.')
    const result = await api<{ user: User; accessToken: string }>('/auth/register', {
      method: 'POST', body: JSON.stringify({ name, email, password }),
    })
    localStorage.setItem('techstore_token', result.accessToken)
    const next = result.user
    persist(next)
    return next
  }

  const updateName = async (name: string) => {
    const next = await api<User>('/users/me', { method: 'PATCH', body: JSON.stringify({ name }) })
    persist(next)
    return next
  }
  const value = useMemo(() => ({ user, loading, login, register, logout: () => persist(null), updateName }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook auxiliar para consumir o AuthContext sem repetir useContext em todas as páginas.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
