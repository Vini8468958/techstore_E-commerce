/**
 * Página 404 exibida quando nenhuma rota cadastrada corresponde à URL.
 */

import { Link } from 'react-router-dom'
// Retorna uma interface simples com link para voltar à página inicial.
export default function NotFoundPage(){return <section className="section"><div className="container empty-state"><span>404</span><h1>Página não encontrada</h1><p>O endereço acessado não existe.</p><Link className="btn btn-primary" to="/">Voltar ao início</Link></div></section>}
