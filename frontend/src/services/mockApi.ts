/**
 * Serviço que simula uma API de produtos utilizando localStorage.
 * Quando o backend estiver pronto, este arquivo pode ser substituído por
 * chamadas HTTP com fetch ou Axios para endpoints reais.
 */

import { products as seedProducts } from '../data/mockData'
import type { Product } from '../types'

// Pequeno atraso artificial para imitar o tempo de resposta de uma API real.
const sleep = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms))

// Lê os produtos persistidos no navegador; se não existirem, usa os dados iniciais.
const readProducts = (): Product[] => {
  const saved = localStorage.getItem('techstore_products')
  if (!saved) return seedProducts
  try { return JSON.parse(saved) as Product[] } catch { return seedProducts }
}

// Persiste toda a lista de produtos no navegador.
const writeProducts = (items: Product[]) => localStorage.setItem('techstore_products', JSON.stringify(items))

// Interface semelhante à de um service real: listar, buscar, salvar e remover.
export const productService = {
  // Retorna todos os produtos.
  async list(): Promise<Product[]> {
    await sleep()
    return readProducts()
  },
  // Localiza um produto pelo id.
  async getById(id: number): Promise<Product | undefined> {
    await sleep(150)
    return readProducts().find(p => p.id === id)
  },
  // Atualiza um produto existente ou adiciona um novo.
  async save(product: Product): Promise<Product> {
    await sleep(180)
    const items = readProducts()
    const exists = items.some(p => p.id === product.id)
    const next = exists ? items.map(p => p.id === product.id ? product : p) : [...items, product]
    writeProducts(next)
    return product
  },
  // Exclui o produto cujo id foi informado.
  async remove(id: number): Promise<void> {
    await sleep(150)
    writeProducts(readProducts().filter(p => p.id !== id))
  }
}
