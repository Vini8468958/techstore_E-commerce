import type { Product } from '../types'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('techstore_token')
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, { ...init, headers })
  } catch {
    throw new ApiError(`Não foi possível conectar à API em ${API_URL}. Confira se o backend está rodando e se VITE_API_URL está correto.`, 0)
  }

  const text = await response.text()
  let data: unknown
  try { data = text ? JSON.parse(text) : undefined } catch { data = text }
  if (!response.ok) {
    const payload = data as { message?: string | string[]; error?: string } | undefined
    const message = Array.isArray(payload?.message) ? payload?.message.join(' ') : payload?.message || payload?.error || `Erro HTTP ${response.status}`
    throw new ApiError(message, response.status)
  }
  return data as T
}

export interface ApiCategory {
  id: string
  name: string
  slug: string
  _count?: { products: number }
}

export interface ApiProduct {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  price: number
  stock: number
  imageUrl?: string | null
  featured: boolean
  active?: boolean
  categoryId?: string
  category?: ApiCategory
}

const iconForCategory = (category = '') => {
  const value = category.toLowerCase()
  if (value.includes('notebook')) return '💻'
  if (value.includes('celular') || value.includes('smartphone')) return '📱'
  if (value.includes('hardware')) return '🧠'
  if (value.includes('áudio') || value.includes('audio')) return '🎧'
  return '⌨️'
}

export function toProduct(value: ApiProduct): Product {
  const category = value.category?.name || 'Outros'
  return {
    id: value.id,
    name: value.name,
    description: value.description,
    price: Number(value.price),
    stock: value.stock,
    category,
    categoryId: value.categoryId || value.category?.id,
    sku: value.sku,
    slug: value.slug,
    imageUrl: value.imageUrl || undefined,
    rating: 0,
    reviews: 0,
    emoji: iconForCategory(category),
    featured: value.featured,
  }
}

export function toApiProduct(product: Product): Omit<ApiProduct, 'category' | 'id'> {
  const slug = product.slug || product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const sku = product.sku || `TS-${slug.toUpperCase().replace(/-/g, '-').slice(0, 36)}`
  if (!product.categoryId) throw new Error('Selecione uma categoria válida para o produto.')
  return {
    name: product.name,
    slug,
    sku,
    description: product.description,
    price: Number(product.price),
    stock: Number(product.stock),
    categoryId: product.categoryId,
    featured: Boolean(product.featured),
    ...(product.imageUrl ? { imageUrl: product.imageUrl } : {}),
  }
}

export const categoryService = {
  async list(): Promise<ApiCategory[]> {
    return api<ApiCategory[]>('/categories')
  },
}

export const productService = {
  async list(): Promise<Product[]> {
    const result = await api<{ items: ApiProduct[] }>('/products?limit=100')
    return result.items.map(toProduct)
  },
  async getById(id: string | number): Promise<Product> {
    return toProduct(await api<ApiProduct>(`/products/${encodeURIComponent(String(id))}`))
  },
  async save(product: Product): Promise<Product> {
    const payload = toApiProduct(product)
    const saved = product.id
      ? await api<ApiProduct>(`/products/${encodeURIComponent(String(product.id))}`, { method: 'PATCH', body: JSON.stringify(payload) })
      : await api<ApiProduct>('/products', { method: 'POST', body: JSON.stringify(payload) })
    return toProduct(saved)
  },
  async remove(id: string | number): Promise<void> {
    await api(`/products/${encodeURIComponent(String(id))}`, { method: 'DELETE' })
  },
}

export const userService = {
  updateProfile(name: string) {
    return api<{ id: string; name: string; email: string; role: 'CUSTOMER' | 'ADMIN' }>('/users/me', {
      method: 'PATCH', body: JSON.stringify({ name }),
    })
  },
  listAddresses() {
    return api<Address[]>('/users/me/addresses')
  },
  createAddress(address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    return api<Address>('/users/me/addresses', { method: 'POST', body: JSON.stringify(address) })
  },
}

export interface Address {
  id: string
  userId?: string
  label: string
  recipient: string
  zipCode: string
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  isDefault?: boolean
  createdAt?: string
  updatedAt?: string
}
