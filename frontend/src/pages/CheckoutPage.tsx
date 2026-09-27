/**
 * Página de checkout demonstrativo.
 * Coleta endereço e forma de pagamento, mostra um resumo e simula a conclusão
 * do pedido sem realizar cobrança real.
 */

import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { money } from '../utils/format'

// Recupera carrinho, usuário atual e navegação programática.
export default function CheckoutPage() {
  // Estado do checkout é local; os itens e subtotal vêm do CartContext.
  const { items, subtotal, clear } = useCart(); const { user } = useAuth(); const navigate=useNavigate(); const [payment,setPayment]=useState('pix'); const [done,setDone]=useState(false)
  if (!items.length && !done) return <section className="section"><div className="container empty-state"><h2>Seu carrinho está vazio.</h2><Link to="/produtos" className="btn btn-primary">Ver produtos</Link></div></section>
  const total=subtotal
  // Simula a confirmação, limpa o carrinho e redireciona para os pedidos.
  const submit=(e:FormEvent)=>{e.preventDefault();setDone(true);clear();setTimeout(()=>navigate('/pedidos'),1200)}
  // Após confirmar, exibe rapidamente uma mensagem de sucesso.
  if(done) return <section className="section"><div className="container success-state"><span>✅</span><h1>Pedido confirmado!</h1><p>Compra simulada concluída. Você será direcionado aos pedidos.</p></div></section>
  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">Checkout</span><h1>Finalizar compra</h1><p>Olá, {user?.name}. Revise os dados e confirme o pedido.</p></div><form onSubmit={submit} className="checkout-layout"><div className="checkout-main"><div className="panel"><h3>1. Endereço de entrega</h3><div className="form-grid"><label>CEP<input required placeholder="00000-000" /></label><label>Rua<input required placeholder="Rua Exemplo" /></label><label>Número<input required placeholder="123" /></label><label>Bairro<input required placeholder="Centro" /></label><label>Cidade<input required placeholder="Recife" /></label><label>UF<input required placeholder="PE" maxLength={2} /></label></div></div><div className="panel"><h3>2. Pagamento</h3><div className="payment-options"><label className={payment==='pix'?'payment active':'payment'}><input type="radio" value="pix" checked={payment==='pix'} onChange={e=>setPayment(e.target.value)} />⚡ PIX <span>Aprovação imediata</span></label><label className={payment==='card'?'payment active':'payment'}><input type="radio" value="card" checked={payment==='card'} onChange={e=>setPayment(e.target.value)} />💳 Cartão <span>Até 10x sem juros</span></label></div>{payment==='card' && <div className="form-grid card-fields"><label className="wide">Número do cartão<input required placeholder="0000 0000 0000 0000" /></label><label>Validade<input required placeholder="MM/AA" /></label><label>CVV<input required placeholder="123" /></label></div>}</div></div><aside className="summary-card checkout-summary"><h3>Seu pedido</h3>{items.map(i=><div className="mini-item" key={i.product.id}><span>{i.product.emoji}</span><div><strong>{i.product.name}</strong><small>{i.quantity}x</small></div><b>{money(i.product.price*i.quantity)}</b></div>)}<hr/><div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div><button className="btn btn-primary full">Confirmar pedido</button><small>Ambiente de demonstração. Nenhuma cobrança real é realizada.</small></aside></form></div></section>
}
