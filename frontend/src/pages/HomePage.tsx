/**
 * Página inicial do e-commerce.
 * Busca os produtos pela API, seleciona os destaques e monta as
 * principais seções visuais da loja.
 */

import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ProductCard from '../components/ProductCard'
import { productService } from '../services/api'

// Página carregada na rota '/'.
export default function HomePage() {
  // useQuery busca os produtos e mantém o resultado em cache.
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: productService.list })
  // Mostra no máximo quatro produtos marcados como destaque.
  const featured = products.filter(p => p.featured).slice(0, 4)
  // As seções seguintes compõem a Home: hero, categorias, destaques e benefícios.
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-kicker">⚡ Semana Tech</span>
            <h1>Tecnologia para <span>elevar</span> seu setup.</h1>
            <p>Notebooks, hardware, smartphones e periféricos com uma experiência de compra moderna e segura.</p>
            <div className="hero-actions"><Link className="btn btn-primary" to="/produtos">Ver produtos</Link><a className="btn btn-ghost" href="#categorias">Explorar categorias</a></div>
            <div className="hero-stats"><div><strong>{products.length || '—'}</strong><span>produtos ativos</span></div><div><strong>100%</strong><span>React + TS</span></div><div><strong>API</strong><span>NestJS + PostgreSQL</span></div></div>
          </div>
          <div className="hero-art"><div className="orb orb-one"></div><div className="orb orb-two"></div><div className="device-card"><span>💻</span><small>DESTAQUE</small><strong>Notebook Nitro V15</strong><p>Performance para jogar e criar.</p></div></div>
        </div>
      </section>

      <section className="section" id="categorias"><div className="container"><div className="section-heading"><div><span className="eyebrow">Categorias</span><h2>Encontre o que você procura</h2></div></div><div className="category-grid">
        {[['💻','Notebooks'],['📱','Celulares'],['🧠','Hardware'],['⌨️','Periféricos']].map(([icon,name]) => <Link key={name} to={`/produtos?categoria=${encodeURIComponent(name)}`} className="category-card"><span>{icon}</span><strong>{name}</strong><small>Ver produtos →</small></Link>)}
      </div></div></section>

      <section className="section section-soft"><div className="container"><div className="section-heading"><div><span className="eyebrow">Seleção especial</span><h2>Produtos em destaque</h2></div><Link to="/produtos">Ver todos →</Link></div><div className="products-grid">{featured.map(product => <ProductCard key={product.id} product={product} />)}</div></div></section>

      <section className="benefits"><div className="container benefits-grid">{[['🚚','Entrega rápida','Acompanhe seus pedidos em cada etapa.'],['🔒','Compra segura','Fluxo preparado para autenticação e checkout.'],['↩️','Troca simples','Interface clara para pedidos e suporte.'],['💬','Atendimento','Experiência pensada para clientes reais.']].map(([i,t,d]) => <div className="benefit" key={t}><span>{i}</span><div><strong>{t}</strong><p>{d}</p></div></div>)}</div></section>
    </>
  )
}
