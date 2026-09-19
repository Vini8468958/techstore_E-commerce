import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { money } from '../utils/format'
import { useCart } from '../contexts/CartContext'

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <article className="product-card">
      <Link to={`/produtos/${product.id}`} className="product-visual-wrap">
        {product.badge && <span className="badge">{product.badge}</span>}
        <div className={`product-visual category-${product.category.toLowerCase().replace('á','a').replace('í','i').replace('é','e')}`}><span>{product.emoji}</span></div>
      </Link>
      <div className="product-content">
        <span className="eyebrow">{product.brand} • {product.category}</span>
        <Link to={`/produtos/${product.id}`} className="product-name">{product.name}</Link>
        <div className="rating">★ {product.rating} <span>({product.reviews})</span></div>
        {product.oldPrice && <div className="old-price">{money(product.oldPrice)}</div>}
        <div className="price">{money(product.price)}</div>
        <div className="installment">ou 10x de {money(product.price / 10)} sem juros</div>
        <button className="btn btn-primary full" onClick={() => add(product)}>Adicionar ao carrinho</button>
      </div>
    </article>
  )
}