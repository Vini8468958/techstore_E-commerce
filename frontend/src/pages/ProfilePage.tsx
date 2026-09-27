/**
 * Página de perfil do usuário autenticado.
 * Permite alterar o nome localmente e exibe informações básicas da conta.
 */

import { useState, type FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'

// Carrega o usuário atual e cria um estado editável para o nome.
export default function ProfilePage() {
  const { user, updateName } = useAuth(); const [name,setName]=useState(user?.name||''); const [saved,setSaved]=useState(false)
  // Salva o nome no AuthContext e mostra uma confirmação temporária.
  const submit=(e:FormEvent)=>{e.preventDefault();updateName(name);setSaved(true);setTimeout(()=>setSaved(false),1800)}
  return <section className="section"><div className="container narrow"><div className="page-heading"><span className="eyebrow">Minha conta</span><h1>Perfil</h1></div><div className="panel profile-panel"><div className="avatar">{user?.name.charAt(0).toUpperCase()}</div><form className="form" onSubmit={submit}><label>Nome<input value={name} onChange={e=>setName(e.target.value)} /></label><label>E-mail<input value={user?.email||''} disabled /></label><label>Perfil<input value={user?.role==='ADMIN'?'Administrador':'Cliente'} disabled /></label><button className="btn btn-primary">Salvar alterações</button>{saved&&<span className="save-ok">✓ Alterações salvas</span>}</form></div></div></section>
}
