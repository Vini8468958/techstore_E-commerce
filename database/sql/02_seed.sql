-- TechStore - dados iniciais compatíveis com prisma/seed.ts
-- Credenciais de demonstração:
--   admin@techstore.com   / Admin123!
--   cliente@techstore.com / Cliente123!

INSERT INTO "User" ("id", "name", "email", "passwordHash", "phone", "role", "createdAt", "updatedAt") VALUES
('seed_admin_001', 'Administrador TechStore', 'admin@techstore.com', '$2b$12$bWtQ3ZKmoI7eX.IlPSB75.w.ul4s5quvcNw26mqqtaWtXgxWavxrC', NULL, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed_customer_001', 'Cliente Demonstração', 'cliente@techstore.com', '$2b$12$sLtF22aT3caDP8ZXa8OdZuzXopxGzf/6nGDVqwuHr.cLWPUfpY58i', NULL, 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Category" ("id", "name", "slug", "createdAt", "updatedAt") VALUES
('seed_cat_notebooks', 'Notebooks', 'notebooks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed_cat_celulares', 'Celulares', 'celulares', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed_cat_perifericos', 'Periféricos', 'perifericos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed_cat_hardware', 'Hardware', 'hardware', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "Product" (
  "id", "name", "slug", "sku", "description", "price", "stock", "imageUrl",
  "featured", "active", "categoryId", "createdAt", "updatedAt"
) VALUES
(
  'seed_prod_nitro', 'Notebook Gamer Nitro V', 'notebook-gamer-nitro-v', 'NOTE-NITRO-001',
  'Notebook gamer com excelente desempenho para estudo, trabalho e jogos.', 4999.90, 12,
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
  true, true, 'seed_cat_notebooks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  'seed_prod_phone', 'Smartphone Pro 256GB', 'smartphone-pro-256gb', 'CELL-PRO-256',
  'Smartphone com câmera avançada, tela de alta resolução e 256 GB de armazenamento.', 3299.90, 20,
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
  true, true, 'seed_cat_celulares', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  'seed_prod_mouse', 'Mouse Sem Fio Precision', 'mouse-sem-fio-precision', 'PERI-MOUSE-001',
  'Mouse ergonômico sem fio com alta precisão e bateria de longa duração.', 189.90, 35,
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80',
  false, true, 'seed_cat_perifericos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  'seed_prod_keyboard', 'Teclado Mecânico RGB', 'teclado-mecanico-rgb', 'PERI-KEY-001',
  'Teclado mecânico com iluminação RGB e switches de resposta rápida.', 349.90, 18,
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
  true, true, 'seed_cat_perifericos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("sku") DO NOTHING;
