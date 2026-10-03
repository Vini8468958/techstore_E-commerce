/**
 * Página de checkout demonstrativo.
 * Coleta endereço e forma de pagamento, mostra um resumo e simula a conclusão
 * do pedido sem realizar cobrança real.
 */

import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { api, userService, type Address } from '../services/api'
import { money } from '../utils/format'

// Recupera carrinho, usuário atual e navegação programática.
export default function CheckoutPage() {
  const { items, subtotal, clear, loading: cartLoading } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: addresses = [], isLoading: addressesLoading } = useQuery({ queryKey: ['addresses'], queryFn: userService.listAddresses })
  const [payment, setPayment] = useState<'pix' | 'card'>('pix')
  const [selectedAddress, setSelectedAddress] = useState('')
  const [newAddress, setNewAddress] = useState(false)
  const [address, setAddress] = useState({ label: 'Casa', recipient: user?.name || '', zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (user?.name) setAddress(current => ({ ...current, recipient: current.recipient || user.name }))
  }, [user?.name])
  useEffect(() => {
    if (addresses.length && !selectedAddress) setSelectedAddress(addresses.find(item => item.isDefault)?.id || addresses[0].id)
    if (!addresses.length && !addressesLoading && !selectedAddress) setNewAddress(true)
  }, [addresses, addressesLoading, selectedAddress])
  if (!items.length && !done) return <section className="section"><div className="container empty-state"><h2>Seu carrinho está vazio.</h2><Link to="/produtos" className="btn btn-primary">Ver produtos</Link></div></section>
  const shipping = subtotal >= 300 ? 0 : 19.9
  const total = subtotal + shipping
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      let addressId = selectedAddress
      if (newAddress || !addressId) {
        const saved: Address = await userService.createAddress({ ...address, state: address.state.toUpperCase(), isDefault: addresses.length === 0 })
        addressId = saved.id
        setSelectedAddress(saved.id)
        setNewAddress(false)
      }
      await api('/orders', { method: 'POST', body: JSON.stringify({ addressId, paymentMethod: payment === 'pix' ? 'PIX' : 'CREDIT_CARD' }) })
      await clear()
      setDone(true)
      setTimeout(() => navigate('/pedidos'), 1200)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }
  // Após confirmar, exibe rapidamente uma mensagem de sucesso.
  if(done) return <section className="section"><div className="container success-state"><span>✅</span><h1>Pedido confirmado!</h1><p>Compra simulada concluída. Você será direcionado aos pedidos.</p></div></section>
  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">Checkout</span><h1>Finalizar compra</h1><p>Olá, {user?.name}. Revise os dados e confirme o pedido.</p></div><form onSubmit={submit} className="checkout-layout"><div className="checkout-main"><div className="panel"><h3>1. Endereço de entrega</h3>{addresses.length > 0 && <><label className="form-label">Endereço salvo<select value={selectedAddress} disabled={newAddress} onChange={e=>setSelectedAddress(e.target.value)}>{addresses.map(item=><option key={item.id} value={item.id}>{item.label} — {item.street}, {item.number}, {item.city}/{item.state}</option>)}</select></label><label style={{ display:'flex', gap:8, margin:'14px 0' }}><input type="checkbox" checked={newAddress} onChange={e=>setNewAddress(e.target.checked)} /> Cadastrar um novo endereço</label></>}{(newAddress || !addresses.length) && <div className="form-grid"><label>Destinatário<input required value={address.recipient} onChange={e=>setAddress({...address,recipient:e.target.value})} /></label><label>Identificação<input required value={address.label} onChange={e=>setAddress({...address,label:e.target.value})} /></label><label>CEP<input required value={address.zipCode} onChange={e=>setAddress({...address,zipCode:e.target.value})} placeholder="00000-000" /></label><label>Rua<input required value={address.street} onChange={e=>setAddress({...address,street:e.target.value})} /></label><label>Número<input required value={address.number} onChange={e=>setAddress({...address,number:e.target.value})} /></label><label>Complemento<input value={address.complement} onChange={e=>setAddress({...address,complement:e.target.value})} /></label><label>Bairro<input required value={address.neighborhood} onChange={e=>setAddress({...address,neighborhood:e.target.value})} /></label><label>Cidade<input required value={address.city} onChange={e=>setAddress({...address,city:e.target.value})} /></label><label>UF<input required value={address.state} onChange={e=>setAddress({...address,state:e.target.value})} maxLength={2} /></label></div>}</div><div className="panel"><h3>2. Pagamento (simulado)</h3><div className="payment-options"><label className={payment==='pix'?'payment active':'payment'}><input type="radio" value="pix" checked={payment==='pix'} onChange={()=>setPayment('pix')} />⚡ PIX <span>Simulado</span></label><label className={payment==='card'?'payment active':'payment'}><input type="radio" value="card" checked={payment==='card'} onChange={()=>setPayment('card')} />💳 Cartão <span>Simulado</span></label></div><p>Não informe dados reais de cartão. O backend registra apenas o método de pagamento para demonstração.</p></div>{error && <div className="form-error">{error}</div>}</div><aside className="summary-card checkout-summary"><h3>Seu pedido</h3>{items.map(i=><div className="mini-item" key={i.product.id}><span>{i.product.emoji}</span><div><strong>{i.product.name}</strong><small>{i.quantity}x</small></div><b>{money(i.product.price*i.quantity)}</b></div>)}<hr/><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Frete</span><strong>{shipping ? money(shipping) : 'Grátis'}</strong></div><div className="summary-total"><span>Total estimado</span><strong>{money(total)}</strong></div><button className="btn btn-primary full" disabled={submitting || cartLoading || addressesLoading}>{submitting ? 'Criando pedido...' : 'Confirmar pedido'}</button><small>Compra simulada. O backend calcula o total final e valida o estoque.</small></aside></form></div></section>
}
