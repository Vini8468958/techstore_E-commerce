import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/mockApi'
import { money } from '../utils/format'
import { useCart } from '../contexts/CartContext'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const { data: product, isLoading } = useQuery({ queryKey: ['product', id], queryFn: () => productService.getById(Number(id)) })
  if (isLoading) return <div className="container loader">Carregando produto...</div>
  if (!product) return <div className="container empty-state"><h2>Produto não encontrado.</h2><Link to="/produtos" className="btn btn-primary">Voltar ao catálogo</Link></div>
  return <section className="section"><div className="container"><div className="breadcrumbs"><Link to="/">Início</Link> / <Link to="/produtos">Produtos</Link> / <span>{product.name}</span></div><div className="product-detail-grid">
    <div className="detail-visual"><div className="detail-emoji">{product.emoji}</div><div className="visual-caption">{product.category} • {product.brand}</div></div>
    <div className="detail-info"><span className="eyebrow">{product.brand} • {product.category}</span><h1>{product.name}</h1><div className="rating large">★ {product.rating} <span>({product.reviews} avaliações)</span></div><p className="detail-description">{product.description}</p><hr />
      {product.oldPrice && <div className="old-price large">{money(product.oldPrice)}</div>}<div className="detail-price">{money(product.price)}</div><p className="installment">10x de {money(product.price/10)} sem juros</p>
      <div className="stock ok">● Em estoque: {product.stock} unidades</div><div className="buy-row"><div className="qty"><button onClick={() => setQty(q => Math.max(1,q-1))}>−</button><span>{qty}</span><button onClick={() => setQty(q => Math.min(product.stock,q+1))}>+</button></div><button className="btn btn-primary grow" onClick={() => add(product, qty)}>Adicionar ao carrinho</button></div>
      <div className="secure-box"><span>🔒</span><div><strong>Compra protegida</strong><p>Ambiente preparado para integração com pagamento e backend.</p></div></div>
    </div>
  </div><div className="detail-tabs"><h2>Sobre este produto</h2><p>{product.description}</p><div className="spec-grid"><div><span>Marca</span><strong>{product.brand}</strong></div><div><span>Categoria</span><strong>{product.category}</strong></div><div><span>Avaliação</span><strong>{product.rating}/5</strong></div><div><span>Estoque</span><strong>{product.stock} un.</strong></div></div></div></div></section>
}