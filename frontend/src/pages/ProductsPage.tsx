/**
 * Página de catálogo.
 * Permite pesquisar, filtrar por categoria e ordenar os produtos carregados.
 */

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productService } from '../services/api'

// Estado e dados necessários para controlar o catálogo.
export default function ProductsPage() {
  // Carrega os produtos e informa se a busca ainda está acontecendo.
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: productService.list })
  // Lê/escreve filtros na URL, por exemplo ?categoria=Hardware.
  const [params, setParams] = useSearchParams()
  // Texto digitado na barra de busca.
  const [search, setSearch] = useState('')
  // Critério selecionado para ordenar o catálogo.
  const [sort, setSort] = useState('relevance')
  const category = params.get('categoria') || 'Todas'
  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category)))]

  // useMemo recalcula a lista apenas quando produtos/filtros realmente mudam.
  const filtered = useMemo(() => {
    let list = products.filter(p => (category === 'Todas' || p.category === category) && (p.name + p.brand + p.description).toLowerCase().includes(search.toLowerCase()))
    if (sort === 'price-asc') list = [...list].sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a,b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a,b) => (b.rating ?? 0) - (a.rating ?? 0))
    return list
  }, [products, category, search, sort])

  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">Catálogo</span><h1>Todos os produtos</h1><p>Busque, filtre por categoria e ordene os itens da loja.</p></div>
    <div className="catalog-toolbar"><div className="search-box">🔎<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto ou marca..." /></div><select value={sort} onChange={e => setSort(e.target.value)}><option value="relevance">Relevância</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="rating">Melhor avaliação</option></select></div>
    <div className="chips">{categories.map(c => <button key={c} className={category === c ? 'chip active' : 'chip'} onClick={() => c === 'Todas' ? setParams({}) : setParams({categoria:c})}>{c}</button>)}</div>
    <div className="results-line"><span>{filtered.length} produto(s)</span></div>
    {isLoading ? <div className="loader">Carregando produtos...</div> : filtered.length ? <div className="products-grid">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div> : <div className="empty-state"><span>🔎</span><h3>Nenhum produto encontrado</h3><p>Tente alterar os filtros ou o termo de busca.</p></div>}
  </div></section>
}
