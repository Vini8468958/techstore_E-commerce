/**
 * Tipos e interfaces compartilhados por todo o projeto.
 * Centralizar os tipos evita duplicação e ajuda o TypeScript a validar
 * produtos, usuários, pedidos e itens do carrinho.
 */

// Papéis de acesso permitidos no sistema.
export type Role = 'CUSTOMER' | 'ADMIN'

// Categorias aceitas pelos produtos.
export type Category = 'Notebooks' | 'Smartphones' | 'Hardware' | 'Periféricos' | 'Áudio'

// Estrutura de um produto exibido e administrado na loja.
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

// Cada item do carrinho combina o produto com a quantidade desejada.
export interface CartItem {
  product: Product
  quantity: number
}

// Dados mínimos usados para representar o usuário autenticado.
export interface User {
  id: number
  name: string
  email: string
  role: Role
}

// Estrutura simplificada utilizada na tela de pedidos.
export interface Order {
  id: string
  date: string
  status: 'Processando' | 'Enviado' | 'Entregue'
  total: number
  items: { name: string; quantity: number; unitPrice: number; emoji: string }[]
}
