export type Role = 'CUSTOMER' | 'ADMIN'

export type Category = 'Notebooks' | 'Smartphones' | 'Hardware' | 'Periféricos' | 'Áudio'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  oldPrice?: number
  stock: number
  category: Category
  brand: string
  rating: number
  reviews: number
  emoji: string
  badge?: string
  featured?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export interface Order {
  id: string
  date: string
  status: 'Processando' | 'Enviado' | 'Entregue'
  total: number
  items: { name: string; quantity: number; unitPrice: number; emoji: string }[]
}