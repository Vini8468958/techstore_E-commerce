import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { money } from '../utils/format'

export default function CartPage() {
  const { items, updateQuantity, remove, subtotal } = useCart()
  const shipping = subtotal >= 399 ? 0 : 29.9
  const total = subtotal + shipping
  if (!items.length) return <section className="section"><div className="container empty-state"><span>🛒</span><h1>Seu carrinho está vazio</h1><p>Explore o catálogo e adicione seus produtos favoritos.</p><Link className="btn btn-primary" to="/produtos">Ir para produtos</Link></div></section>
  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">Carrinho</span><h1>Revise sua compra</h1></div><div className="cart-layout"><div className="cart-list">{items.map(({product, quantity}) => <article className="cart-item" key={product.id}><div className="cart-thumb">{product.emoji}</div><div className="cart-main"><Link to={`/produtos/${product.id}`}><strong>{product.name}</strong></Link><small>{product.brand} • {product.category}</small><button className="danger-link" onClick={() => remove(product.id)}>Remover</button></div><div className="qty"><button onClick={() => updateQuantity(product.id, quantity-1)}>−</button><span>{quantity}</span><button onClick={() => updateQuantity(product.id, quantity+1)}>+</button></div><strong className="cart-price">{money(product.price * quantity)}</strong></article>)}</div>
    <aside className="summary-card"><h3>Resumo do pedido</h3><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Frete</span><strong>{shipping === 0 ? 'Grátis' : money(shipping)}</strong></div><hr/><div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div><p>Em até 10x de {money(total/10)} sem juros.</p><Link to="/checkout" className="btn btn-primary full">Continuar para checkout</Link><Link to="/produtos" className="btn btn-ghost full">Continuar comprando</Link></aside>
  </div></div></section>
}