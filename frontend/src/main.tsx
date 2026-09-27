/**
 * Ponto de entrada da aplicação React.
 * Aqui configuramos o React Router, o React Query e os Contexts globais
 * antes de renderizar o componente principal <App />.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import './styles.css'

// Instância global do React Query. O staleTime evita refetch imediato por 30 segundos.
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } })

// Localiza a <div id="root"> do index.html e inicia a árvore React.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Habilita navegação por URL sem recarregar a página inteira. */}
    <BrowserRouter>
      {/* Disponibiliza cache, queries e mutations para todos os componentes. */}
      <QueryClientProvider client={queryClient}>
        {/* Estado global de autenticação. */}
        <AuthProvider>
          {/* Estado global do carrinho envolve a aplicação principal. */}
          <CartProvider><App /></CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
