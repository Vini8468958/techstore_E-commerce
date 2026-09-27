/**
 * Contexto global do carrinho de compras.
 * Ele concentra as operações de adicionar, remover, alterar quantidade,
 * calcular subtotal e persistir o carrinho no navegador.
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

// Define tudo que o restante da aplicação poderá usar do carrinho.
type CartContextValue = {
  items: CartItem[]
  add: (product: Product, quantity?: number) => void
  remove: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clear: () => void
  count: number
  subtotal: number
}

// Contexto que armazenará o estado do carrinho.
const CartContext = createContext<CartContextValue | null>(null)

// Restaura o carrinho salvo anteriormente no navegador.
const initialItems = (): CartItem[] => {
  const raw = localStorage.getItem('techstore_cart')
  if (!raw) return []
  try { return JSON.parse(raw) as CartItem[] } catch { return [] }
}

// Provider responsável por guardar e distribuir o estado do carrinho.
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialItems)

  // Mantém state e localStorage sincronizados.
  const persist = (next: CartItem[]) => {
    setItems(next)
    localStorage.setItem('techstore_cart', JSON.stringify(next))
  }

  // Adiciona produto novo ou soma quantidade sem ultrapassar o estoque.
  const add = (product: Product, quantity = 1) => {
    const existing = items.find(i => i.product.id === product.id)
    const next = existing
      ? items.map(i => i.product.id === product.id ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i)
      : [...items, { product, quantity: Math.min(quantity, product.stock) }]
    persist(next)
  }

  // Remove completamente um produto do carrinho.
  const remove = (productId: number) => persist(items.filter(i => i.product.id !== productId))
  // Garante quantidade mínima 1 e máxima igual ao estoque disponível.
  const updateQuantity = (productId: number, quantity: number) => persist(items.map(i => i.product.id === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.product.stock)) } : i))
  const clear = () => persist([])
  // Soma a quantidade total de unidades para exibir no badge do carrinho.
  const count = items.reduce((acc, item) => acc + item.quantity, 0)
  // Soma preço × quantidade de todos os itens.
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const value = useMemo(() => ({ items, add, remove, updateQuantity, clear, count, subtotal }), [items, count, subtotal])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Hook auxiliar para acessar o carrinho em qualquer componente filho do provider.
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider')
  return ctx
}
