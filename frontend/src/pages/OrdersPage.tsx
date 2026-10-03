/**
 * Página de histórico de pedidos.
 * Nesta versão os pedidos vêm de dados mockados para demonstrar a interface.
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { money } from '../utils/format'

type ApiOrder = {
  id: string
  orderNumber: string
  createdAt: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED'
  total: number
  items: { productName: string; quantity: number; unitPrice: number }[]
}

export default function OrdersPage() {
  const { data: orders = [], isLoading, error } = useQuery({ queryKey: ['orders', 'my'], queryFn: () => api<ApiOrder[]>('/orders/my') })
  const statusText: Record<ApiOrder['status'], string> = { PENDING: 'Pendente', PROCESSING: 'Processando', SHIPPED: 'Enviado', DELIVERED: 'Entregue', CANCELED: 'Cancelado' }
  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">Minha conta</span><h1>Meus pedidos</h1><p>Acompanhe o histórico e o status das suas compras.</p></div>{isLoading && <div className="loader">Carregando pedidos...</div>}{error && <div className="form-error">{(error as Error).message}</div>}{!isLoading && !error && orders.length === 0 && <div className="empty-state"><h2>Você ainda não fez pedidos.</h2></div>}<div className="orders-list">{orders.map(order=>{ const status = statusText[order.status]; return <article className="order-card" key={order.id}><div className="order-head"><div><strong>{order.orderNumber}</strong><span>Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}</span></div><span className={`status status-${status.toLowerCase()}`}>{status}</span></div><div className="order-items">{order.items.map((item,index)=><div className="order-item" key={`${order.id}-${index}`}><span>📦</span><div><strong>{item.productName}</strong><small>Quantidade: {item.quantity}</small></div><b>{money(Number(item.unitPrice)*item.quantity)}</b></div>)}</div><div className="order-footer"><span>Total do pedido</span><strong>{money(Number(order.total))}</strong></div></article>})}</div></div></section>
}
