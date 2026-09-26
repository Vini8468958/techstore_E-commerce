import { products as seedProducts } from '../data/mockData'
import type { Product } from '../types'

const sleep = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms))

const readProducts = (): Product[] => {
  const saved = localStorage.getItem('techstore_products')
  if (!saved) return seedProducts
  try { return JSON.parse(saved) as Product[] } catch { return seedProducts }
}

const writeProducts = (items: Product[]) => localStorage.setItem('techstore_products', JSON.stringify(items))

export const productService = {
  async list(): Promise<Product[]> {
    await sleep()
    return readProducts()
  },
  async getById(id: number): Promise<Product | undefined> {
    await sleep(150)
    return readProducts().find(p => p.id === id)
  },
  async save(product: Product): Promise<Product> {
    await sleep(180)
    const items = readProducts()
    const exists = items.some(p => p.id === product.id)
    const next = exists ? items.map(p => p.id === product.id ? product : p) : [...items, product]
    writeProducts(next)
    return product
  },
  async remove(id: number): Promise<void> {
    await sleep(150)
    writeProducts(readProducts().filter(p => p.id !== id))
  }
}
