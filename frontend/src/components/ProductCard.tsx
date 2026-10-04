/**
 * Card reutilizável para exibir um produto no catálogo ou na Home.
 * Recebe um Product por props e permite adicioná-lo ao carrinho.
 */

import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { money } from '../utils/format'
import { useCart } from '../contexts/CartContext'

// O componente recebe um único produto por propriedade (prop).
export default function ProductCard({ product }: { product: Product }) {
  // Recupera a função global que adiciona itens ao carrinho.
  const { add } = useCart()
  // Todo o bloco abaixo representa a interface visual do card.
  return (
    <article className="product-card">
      <Link to={`/produtos/${product.id}`} className="product-visual-wrap">
        {product.badge && <span className="badge">{product.badge}</span>}
        <div className={`product-visual category-${product.category.toLowerCase().replace('á','a').replace('í','i').replace('é','e')}`}>
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : <span>{product.emoji}</span>}
        </div>
      </Link>
      <div className="product-content">
        <span className="eyebrow">{product.brand ? `${product.brand} • ` : ''}{product.category}</span>
        <Link to={`/produtos/${product.id}`} className="product-name">{product.name}</Link>
        {(product.rating ?? 0) > 0 && <div className="rating">★ {product.rating} <span>({product.reviews ?? 0})</span></div>}
        {product.oldPrice && <div className="old-price">{money(product.oldPrice)}</div>}
        <div className="price">{money(product.price)}</div>
        <div className="installment">ou 10x de {money(product.price / 10)} sem juros</div>
        <button className="btn btn-primary full" disabled={product.stock < 1} onClick={() => void add(product).catch(error => alert((error as Error).message))}>{product.stock < 1 ? 'Indisponível' : 'Adicionar ao carrinho'}</button>
      </div>
    </article>
  )
}
