# TechStore Backend

Backend REST do projeto de E-commerce TechStore.

## Stack

- NestJS + TypeScript
- PostgreSQL
- Prisma ORM 7
- JWT
- bcrypt
- Swagger / OpenAPI
- Docker Compose

## Funcionalidades

- Cadastro e login com JWT
- Perfil e endereços do cliente
- Perfis `CUSTOMER` e `ADMIN`
- Categorias
- Catálogo, busca, filtros e paginação
- CRUD administrativo de produtos
- Carrinho persistido no banco
- Checkout simulado
- Validação transacional de estoque
- Histórico de pedidos
- Cancelamento com devolução de estoque
- Administração de pedidos e usuários
- Dashboard administrativo com métricas
- Swagger

## 1. Requisitos

- Node.js 20.19+ (Node 22 recomendado para esta versão)
- Docker e Docker Compose, ou PostgreSQL instalado localmente

## 2. Configuração

```bash
cp .env.example .env
npm install
```

Inicie o PostgreSQL:

```bash
docker compose up -d db
```

Gere o Prisma Client e crie as tabelas:

```bash
npm run prisma:generate
npm run db:migrate -- --name init
```

Popule dados de demonstração:

```bash
npm run db:seed
```

Inicie a API:

```bash
npm run start:dev
```

API: `http://localhost:3000/api`

Swagger: `http://localhost:3000/docs`

## Usuários do seed

### Administrador

- E-mail: `admin@techstore.com`
- Senha: `Admin123!`

### Cliente

- E-mail: `cliente@techstore.com`
- Senha: `Cliente123!`

Troque essas credenciais em qualquer ambiente público.

## Principais endpoints

### Admin

- `GET /api/admin/dashboard` — ADMIN

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Usuários

- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/me/addresses`
- `POST /api/users/me/addresses`
- `PATCH /api/users/me/addresses/:id`
- `DELETE /api/users/me/addresses/:id`
- `GET /api/users` — ADMIN
- `PATCH /api/users/:id/role` — ADMIN

### Categorias

- `GET /api/categories`
- `POST /api/categories` — ADMIN
- `PATCH /api/categories/:id` — ADMIN
- `DELETE /api/categories/:id` — ADMIN

### Produtos

- `GET /api/products`
- `GET /api/products/:idOrSlug`
- `POST /api/products` — ADMIN
- `PATCH /api/products/:id` — ADMIN
- `DELETE /api/products/:id` — ADMIN (soft delete)

Exemplo de busca:

`GET /api/products?search=notebook&category=notebooks&page=1&limit=12&minPrice=1000&featured=true`

### Carrinho

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:id`
- `DELETE /api/cart/items/:id`
- `DELETE /api/cart`

### Pedidos

- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders/my/:id`
- `PATCH /api/orders/my/:id/cancel`
- `GET /api/orders` — ADMIN
- `PATCH /api/orders/:id/status` — ADMIN

## Integração com React

No frontend, configure a URL base:

```ts
export const apiUrl = 'http://localhost:3000/api';
```

Após o login, envie o token nas rotas protegidas:

```http
Authorization: Bearer SEU_TOKEN
```

## Regra importante de pedidos

Ao finalizar uma compra, a API:

1. Carrega o carrinho e o endereço do usuário.
2. Calcula subtotal, frete e total no backend.
3. Valida e reduz o estoque dentro de uma transação.
4. Copia nome, SKU e preço do produto para `OrderItem`.
5. Cria o pedido.
6. Limpa o carrinho.

Assim, alterações futuras no preço do produto não alteram o histórico do pedido.

> O pagamento é **simulado** neste MVP. Nenhum dado real de cartão deve ser enviado ou armazenado.

## Estrutura

```text
src/
├── admin/
├── auth/
├── cart/
├── categories/
├── common/
├── health/
├── orders/
├── prisma/
├── products/
└── users/
```

## Sugestão de divisão para 3 pessoas

- Pessoa 1: `products` + `categories`
- Pessoa 2: `auth` + `users` + segurança
- Pessoa 3: `cart` + `orders`

Todos revisam Pull Requests antes do merge em `develop`.
