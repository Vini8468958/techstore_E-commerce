/**
 * Página de histórico de pedidos.
 * Nesta versão os pedidos vêm de dados mockados para demonstrar a interface.
 */

import { mockOrders } from '../data/mockData'
import { money } from '../utils/format'

// Nesta versão não há fetch porque os pedidos são dados estáticos de demonstração.
export default function OrdersPage() {
  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">Minha conta</span><h1>Meus pedidos</h1><p>Acompanhe o histórico e o status das suas compras.</p></div><div className="orders-list">{mockOrders.map(order=><article className="order-card" key={order.id}><div className="order-head"><div><strong>{order.id}</strong><span>Realizado em {order.date}</span></div><span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span></div><div className="order-items">{order.items.map((item,index)=><div className="order-item" key={index}><span>{item.emoji}</span><div><strong>{item.name}</strong><small>Quantidade: {item.quantity}</small></div><b>{money(item.unitPrice*item.quantity)}</b></div>)}</div><div className="order-footer"><span>Total do pedido</span><strong>{money(order.total)}</strong></div></article>)}</div></div></section>
}
