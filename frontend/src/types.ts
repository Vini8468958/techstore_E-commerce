/**
 * Tipos e interfaces compartilhados por todo o projeto.
 * Centralizar os tipos evita duplicação e ajuda o TypeScript a validar
 * produtos, usuários, pedidos e itens do carrinho.
 */

export type Role = 'CUSTOMER' | 'ADMIN'
export type Category = string
export type EntityId = string | number

export interface Product {
  id: EntityId
  name: string
  description: string
  price: number
  oldPrice?: number
  stock: number
  category: Category
  categoryId?: string
  slug?: string
  sku?: string
  imageUrl?: string
  brand?: string
  rating?: number
  reviews?: number
  emoji: string
  badge?: string
  featured?: boolean
}

// Cada item do carrinho combina o produto com a quantidade desejada.
export interface CartItem {
  id?: string
  product: Product
  quantity: number
}

// Dados mínimos usados para representar o usuário autenticado.
export interface User {
  id: EntityId
  name: string
  email: string
  role: Role
}

// Estrutura simplificada utilizada na tela de pedidos.
export interface Order {
  id: string
  date: string
  status: 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado' | 'Pendente'
  total: number
  items: { name: string; quantity: number; unitPrice: number; emoji: string }[]
}
