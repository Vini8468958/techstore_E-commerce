# Banco de dados — TechStore

Este banco foi criado **a partir do código do projeto fixado**, usando `backend/prisma/schema.prisma` como fonte de verdade.

## Tecnologia

- PostgreSQL 17
- Prisma ORM 7 no backend
- IDs `String` (novos registros são gerados como CUID pelo Prisma)
- Valores monetários em `DECIMAL(10,2)`

## Modelo

```mermaid
erDiagram
    User ||--o{ Address : possui
    User ||--o| Cart : possui
    User ||--o{ Order : realiza
    Category ||--o{ Product : classifica
    Cart ||--o{ CartItem : contem
    Product ||--o{ CartItem : referencia
    Order ||--|{ OrderItem : contem
    Product ||--o{ OrderItem : snapshot_de
```

### Tabelas

| Tabela | Uso no projeto |
|---|---|
| `User` | autenticação, perfil e papéis CUSTOMER/ADMIN |
| `Address` | endereços usados no checkout |
| `Category` | organização do catálogo |
| `Product` | produtos, preço, estoque e destaque |
| `Cart` | um carrinho persistente por usuário |
| `CartItem` | produtos/quantidades do carrinho |
| `Order` | pedido, entrega, pagamento e totais |
| `OrderItem` | snapshot de nome/SKU/preço no momento da compra |

## Opção A — usar Prisma (recomendado dentro do projeto)

Na pasta `backend`:

```bash
cp .env.example .env
docker compose up -d db
npm ci
npm run prisma:generate
npm run db:deploy
npm run db:seed
```

A migration inicial está em `backend/prisma/migrations/20261003213000_init/migration.sql`.

## Opção B — criar diretamente por SQL

Nesta pasta `database`:

```bash
docker compose up -d
```

Na primeira criação do volume, o PostgreSQL executa automaticamente:

1. `sql/01_schema.sql`
2. `sql/02_seed.sql`

Conexão:

```text
Host: localhost
Porta: 5432
Database: techstore
Usuário: techstore
Senha: techstore
```

URL:

```env
DATABASE_URL="postgresql://techstore:techstore@localhost:5432/techstore?schema=public"
```

> Não execute a criação por SQL e depois tente aplicar a migration inicial do Prisma no mesmo banco vazio como se nada tivesse sido criado. Escolha um método de inicialização para aquele banco.

## Dados de demonstração

O `02_seed.sql` replica os dados principais do `backend/prisma/seed.ts`:

- `admin@techstore.com` / `Admin123!`
- `cliente@techstore.com` / `Cliente123!`
- Categorias: Notebooks, Celulares, Periféricos e Hardware
- 4 produtos de demonstração

As senhas são armazenadas como hashes bcrypt; não ficam em texto puro na tabela.

## Consultas de teste

Execute `sql/03_test_queries.sql` no pgAdmin/DBeaver/psql para verificar produtos, usuários, carrinhos, pedidos e estoque.

## Restrições adicionais

`sql/04_optional_constraints.sql` contém validações extras no PostgreSQL, como estoque/preços não negativos e somente um endereço padrão por usuário. Elas são opcionais porque **não estão representadas no `schema.prisma` atual**.
