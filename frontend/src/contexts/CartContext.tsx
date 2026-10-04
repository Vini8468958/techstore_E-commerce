/**
 * Contexto global do carrinho de compras.
 * Ele concentra as operações de adicionar, remover, alterar quantidade,
 * calcular subtotal e persistir o carrinho no navegador.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, toProduct } from '../services/api'
import { useAuth } from './AuthContext'
import type { CartItem, Product } from '../types'

// Define tudo que o restante da aplicação poderá usar do carrinho.
type CartContextValue = {
  items: CartItem[]
  add: (product: Product, quantity?: number) => Promise<void>
  remove: (productId: string | number) => Promise<void>
  updateQuantity: (productId: string | number, quantity: number) => Promise<void>
  clear: () => Promise<void>
  count: number
  subtotal: number
  loading: boolean
}

// Contexto que armazenará o estado do carrinho.
const CartContext = createContext<CartContextValue | null>(null)

// Restaura o carrinho salvo anteriormente no navegador.
const initialItems = (): CartItem[] => {
  const raw = localStorage.getItem('techstore_cart')
  if (!raw) return []
  try { return JSON.parse(raw) as CartItem[] } catch { return [] }
}

type ApiCart = { items: { id: string; quantity: number; product: Parameters<typeof toProduct>[0] }[]; subtotal: number }
const asCartItems = (cart: ApiCart): CartItem[] => cart.items.map(item => ({ id: item.id, quantity: item.quantity, product: toProduct(item.product) }))

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<CartItem[]>(initialItems)
  const [loading, setLoading] = useState(false)
  const [remoteReady, setRemoteReady] = useState(false)

  const applyRemote = useCallback((cart: ApiCart) => {
    const next = asCartItems(cart)
    setItems(next)
    localStorage.removeItem('techstore_cart')
  }, [])

  useEffect(() => {
    if (authLoading) return
    let active = true
    if (!user) {
      setItems(initialItems())
      setRemoteReady(false)
      return
    }
    setLoading(true)
    setRemoteReady(false)
    const saved = initialItems()
    api<ApiCart>('/cart').then(async cart => {
      if (!active) return
      if (cart.items.length === 0 && saved.length > 0) {
        for (const item of saved) {
          try {
            cart = await api<ApiCart>('/cart/items', { method: 'POST', body: JSON.stringify({ productId: String(item.product.id), quantity: item.quantity }) })
          } catch { /* Produtos removidos ou sem estoque são ignorados na migração. */ }
        }
      }
      if (active) applyRemote(cart)
    }).catch(() => {
      if (active) setItems([])
    }).finally(() => {
      if (active) { setRemoteReady(true); setLoading(false) }
    })
    return () => { active = false }
  }, [user?.id, authLoading, applyRemote])

  const persistLocal = (next: CartItem[]) => {
    setItems(next)
    localStorage.setItem('techstore_cart', JSON.stringify(next))
  }

  const add = async (product: Product, quantity = 1) => {
    if (user) {
      if (!remoteReady) throw new Error('Seu carrinho está carregando. Tente novamente em instantes.')
      const cart = await api<ApiCart>('/cart/items', { method: 'POST', body: JSON.stringify({ productId: String(product.id), quantity }) })
      applyRemote(cart)
      return
    }
    const existing = items.find(i => String(i.product.id) === String(product.id))
    const next = existing
      ? items.map(i => String(i.product.id) === String(product.id) ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i)
      : [...items, { product, quantity: Math.min(quantity, product.stock) }]
    persistLocal(next)
  }

  const remove = async (productId: string | number) => {
    if (user) {
      const item = items.find(i => String(i.product.id) === String(productId))
      if (item?.id) applyRemote(await api<ApiCart>(`/cart/items/${item.id}`, { method: 'DELETE' }))
      return
    }
    persistLocal(items.filter(i => String(i.product.id) !== String(productId)))
  }

  const updateQuantity = async (productId: string | number, quantity: number) => {
    if (user) {
      const item = items.find(i => String(i.product.id) === String(productId))
      if (item?.id) applyRemote(await api<ApiCart>(`/cart/items/${item.id}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }))
      return
    }
    persistLocal(items.map(i => String(i.product.id) === String(productId) ? { ...i, quantity: Math.max(1, Math.min(quantity, i.product.stock)) } : i))
  }

  const clear = async () => {
    if (user) applyRemote(await api<ApiCart>('/cart', { method: 'DELETE' }))
    else persistLocal([])
  }
  const count = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const value = useMemo(() => ({ items, add, remove, updateQuantity, clear, count, subtotal, loading }), [items, count, subtotal, loading, remoteReady, user?.id])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Hook auxiliar para acessar o carrinho em qualquer componente filho do provider.
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider')
  return ctx
}
