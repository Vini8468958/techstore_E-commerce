import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL não configurada');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const customerPassword = await bcrypt.hash('Cliente123!', 12);

  await prisma.user.upsert({
    where: { email: 'admin@techstore.com' },
    update: {},
    create: { name: 'Administrador TechStore', email: 'admin@techstore.com', passwordHash: adminPassword, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'cliente@techstore.com' },
    update: {},
    create: { name: 'Cliente Demonstração', email: 'cliente@techstore.com', passwordHash: customerPassword, role: 'CUSTOMER' },
  });

  const categories = [
    ['Notebooks', 'notebooks'],
    ['Celulares', 'celulares'],
    ['Periféricos', 'perifericos'],
    ['Hardware', 'hardware'],
  ] as const;

  const categoryMap = new Map<string, string>();
  for (const [name, slug] of categories) {
    const category = await prisma.category.upsert({ where: { slug }, update: { name }, create: { name, slug } });
    categoryMap.set(slug, category.id);
  }

  const products = [
    {
      name: 'Notebook Gamer Nitro V', slug: 'notebook-gamer-nitro-v', sku: 'NOTE-NITRO-001',
      description: 'Notebook gamer com excelente desempenho para estudo, trabalho e jogos.',
      price: 4999.90, stock: 12, featured: true, categoryId: categoryMap.get('notebooks')!,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Smartphone Pro 256GB', slug: 'smartphone-pro-256gb', sku: 'CELL-PRO-256',
      description: 'Smartphone com câmera avançada, tela de alta resolução e 256 GB de armazenamento.',
      price: 3299.90, stock: 20, featured: true, categoryId: categoryMap.get('celulares')!,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Mouse Sem Fio Precision', slug: 'mouse-sem-fio-precision', sku: 'PERI-MOUSE-001',
      description: 'Mouse ergonômico sem fio com alta precisão e bateria de longa duração.',
      price: 189.90, stock: 35, featured: false, categoryId: categoryMap.get('perifericos')!,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Teclado Mecânico RGB', slug: 'teclado-mecanico-rgb', sku: 'PERI-KEY-001',
      description: 'Teclado mecânico com iluminação RGB e switches de resposta rápida.',
      price: 349.90, stock: 18, featured: true, categoryId: categoryMap.get('perifericos')!,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({ where: { sku: product.sku }, update: product, create: product });
  }

  console.log('Seed concluído.');
  console.log('Admin: admin@techstore.com / Admin123!');
  console.log('Cliente: cliente@techstore.com / Cliente123!');
}

main()
  .finally(async () => prisma.$disconnect());
