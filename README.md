# TechStore — frontend integrado à API

Projeto de e-commerce com frontend **React + TypeScript + Vite** integrado ao backend **NestJS + Prisma + PostgreSQL**.

## Requisitos

- Node.js 22 recomendado (mínimo indicado pelo backend: 20.19+).
- Docker com Docker Compose **ou** um PostgreSQL local.
- Duas janelas de terminal para iniciar API e frontend.

## 1. Configurar e iniciar o backend

No primeiro terminal, a partir da pasta do projeto:

```bash
cd backend
cp .env.example .env
```

Se usar Docker Compose para o banco:

```bash
docker compose up -d db
```

Instale dependências, gere o Prisma Client, crie as tabelas e carregue os dados de demonstração:

```bash
npm ci
npm run prisma:generate
npm run db:migrate -- --name init
npm run db:seed
```

Inicie a API:

```bash
npm run start:dev
```

Endereços locais:

- API: <http://localhost:3000/api>
- Swagger: <http://localhost:3000/docs>

Se usar outro PostgreSQL, edite `backend/.env` e ajuste `DATABASE_URL`. Para acessar a API a partir de outro host, ajuste também `FRONTEND_URL` para a origem do frontend.

## 2. Configurar e iniciar o frontend

No segundo terminal, a partir da pasta do projeto:

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run dev
```

Abra a URL mostrada pelo Vite, normalmente <http://localhost:5173>. O arquivo `frontend/.env.local` define `VITE_API_URL=http://localhost:3000/api`; altere-o se a API estiver em outro endereço. Reinicie o Vite depois de mudar essa variável.

Para validar uma build de produção do frontend:

```bash
cd frontend
npm run build
npm run preview
```

## 3. Testar os fluxos integrados

1. Na Home ou em **Produtos**, confira o catálogo recebido do PostgreSQL.
2. Adicione um produto ao carrinho. Visitantes podem montar um carrinho local; ao entrar, os itens são enviados ao carrinho persistido da API quando ele ainda está vazio.
3. Entre com a conta de cliente abaixo ou crie uma conta. Senhas novas precisam ter pelo menos 8 caracteres.
4. Abra o carrinho e avance ao checkout. Se não houver endereço salvo, preencha um e confirme o pedido. O backend valida o estoque, calcula frete/total, cria o pedido e limpa o carrinho.
5. Confira o resultado em **Meus pedidos**. O perfil também pode ser atualizado pela API.
6. Para o CRUD e as métricas administrativas, entre com a conta ADMIN.

Contas criadas pelo seed:

| Perfil | E-mail | Senha |
|---|---|---|
| Cliente | `cliente@techstore.com` | `Cliente123!` |
| Administrador | `admin@techstore.com` | `Admin123!` |

## O que foi conectado

- Login/cadastro, JWT persistido e validação da sessão com `/api/auth`.
- Catálogo e detalhe de produto com `/api/products` e categorias do backend.
- Carrinho persistido por usuário com `/api/cart`; carrinho de visitante continua temporário no navegador.
- Checkout com endereço salvo/criado e pedido real no banco via `/api/users/me/addresses` e `/api/orders`.
- Histórico em `/api/orders/my` e atualização de perfil em `/api/users/me`.
- CRUD administrativo de produtos com categorias reais, além do dashboard administrativo.
- Normalização no frontend dos CUIDs, nomes/status e formato do produto devolvido pelo Prisma.

## Importante sobre pagamento

O pagamento deste projeto é **simulado**. Não digite nem envie dados reais de cartão. O checkout transmite somente o método escolhido (`PIX` ou `CREDIT_CARD`); o backend aplica seu próprio cálculo e validação de estoque.

## Observação sobre o ambiente

O build de produção do frontend e a compilação NestJS foram validados. Neste ambiente de trabalho não há Docker instalado, então o PostgreSQL e o fluxo completo da API não foram iniciados aqui; os comandos acima são o roteiro para executá-los localmente com Docker ou um PostgreSQL já instalado.

Na instalação do backend, `npm audit` reportou **6 advisories** em dependências (2 moderadas e 4 altas). O npm indica que a correção automática disponível exige atualizações potencialmente incompatíveis de Prisma/Swagger; não foi usado `npm audit fix --force` para evitar quebrar a aplicação sem uma rodada própria de migração e teste. Revise `npm audit` antes de publicar o backend em produção.
