import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

type CartContextValue = {
  items: CartItem[]
  add: (product: Product, quantity?: number) => void
  remove: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

const initialItems = (): CartItem[] => {
  const raw = localStorage.getItem('techstore_cart')
  if (!raw) return []
  try { return JSON.parse(raw) as CartItem[] } catch { return [] }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialItems)

  const persist = (next: CartItem[]) => {
    setItems(next)
    localStorage.setItem('techstore_cart', JSON.stringify(next))
  }

  const add = (product: Product, quantity = 1) => {
    const existing = items.find(i => i.product.id === product.id)
    const next = existing
      ? items.map(i => i.product.id === product.id ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i)
      : [...items, { product, quantity: Math.min(quantity, product.stock) }]
    persist(next)
  }

  const remove = (productId: number) => persist(items.filter(i => i.product.id !== productId))
  const updateQuantity = (productId: number, quantity: number) => persist(items.map(i => i.product.id === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.product.stock)) } : i))
  const clear = () => persist([])
  const count = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const value = useMemo(() => ({ items, add, remove, updateQuantity, clear, count, subtotal }), [items, count, subtotal])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider')
  return ctx
}