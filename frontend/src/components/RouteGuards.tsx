/**
 * Componentes de proteção de rotas.
 * ProtectedRoute exige usuário autenticado; AdminRoute exige usuário ADMIN.
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

// Impede acesso quando não existe usuário autenticado.
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

// Proteção adicional específica para usuários administradores.
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  // Usuários comuns são enviados de volta para a Home.
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}
