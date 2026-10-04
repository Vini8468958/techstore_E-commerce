-- Consultas úteis para validar o banco TechStore

-- 1) Produtos com categoria
SELECT
  p."id", p."name", p."sku", p."price", p."stock", p."featured", p."active",
  c."name" AS "category"
FROM "Product" p
JOIN "Category" c ON c."id" = p."categoryId"
ORDER BY p."createdAt" DESC;

-- 2) Usuários (sem expor passwordHash)
SELECT "id", "name", "email", "phone", "role", "createdAt"
FROM "User"
ORDER BY "createdAt" DESC;

-- 3) Carrinho e subtotal por item
SELECT
  u."email",
  p."name" AS "product",
  ci."quantity",
  p."price",
  (ci."quantity" * p."price")::DECIMAL(10,2) AS "itemSubtotal"
FROM "Cart" c
JOIN "User" u ON u."id" = c."userId"
JOIN "CartItem" ci ON ci."cartId" = c."id"
JOIN "Product" p ON p."id" = ci."productId"
ORDER BY u."email", ci."createdAt";

-- 4) Pedidos com cliente
SELECT
  o."orderNumber", u."email", o."status", o."paymentMethod", o."paymentStatus",
  o."subtotal", o."shipping", o."total", o."createdAt"
FROM "Order" o
JOIN "User" u ON u."id" = o."userId"
ORDER BY o."createdAt" DESC;

-- 5) Itens do pedido com preço histórico
SELECT
  o."orderNumber", oi."productName", oi."productSku", oi."unitPrice", oi."quantity",
  (oi."unitPrice" * oi."quantity")::DECIMAL(10,2) AS "itemSubtotal"
FROM "OrderItem" oi
JOIN "Order" o ON o."id" = oi."orderId"
ORDER BY o."createdAt" DESC, oi."createdAt";

-- 6) Estoque baixo (limite de exemplo: 10)
SELECT "sku", "name", "stock"
FROM "Product"
WHERE "active" = true AND "stock" <= 10
ORDER BY "stock", "name";
