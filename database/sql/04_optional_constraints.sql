-- Restrições adicionais opcionais (não fazem parte do schema.prisma atual).
-- Execute somente se quiser reforçar integridade diretamente no PostgreSQL.
-- Se futuramente gerar migrations pelo Prisma, revise possíveis diferenças de schema.

ALTER TABLE "Product"
  ADD CONSTRAINT "Product_price_nonnegative_chk" CHECK ("price" >= 0),
  ADD CONSTRAINT "Product_stock_nonnegative_chk" CHECK ("stock" >= 0);

ALTER TABLE "CartItem"
  ADD CONSTRAINT "CartItem_quantity_positive_chk" CHECK ("quantity" > 0);

ALTER TABLE "OrderItem"
  ADD CONSTRAINT "OrderItem_unitPrice_nonnegative_chk" CHECK ("unitPrice" >= 0),
  ADD CONSTRAINT "OrderItem_quantity_positive_chk" CHECK ("quantity" > 0);

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_values_nonnegative_chk"
  CHECK ("subtotal" >= 0 AND "shipping" >= 0 AND "total" >= 0);

CREATE UNIQUE INDEX "Address_one_default_per_user_idx"
  ON "Address" ("userId")
  WHERE "isDefault" = true;
