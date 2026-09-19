import type { Product, Order } from '../types'

export const products: Product[] = [
  { id: 1, name: 'Notebook Nitro V15', description: 'Notebook gamer com tela 15.6” 144Hz, ótimo para jogos, estudos e desenvolvimento.', price: 4999.9, oldPrice: 5599.9, stock: 8, category: 'Notebooks', brand: 'Acer', rating: 4.8, reviews: 184, emoji: '💻', badge: 'Oferta', featured: true },
  { id: 2, name: 'MacBook Air M4', description: 'Ultrafino, silencioso e com excelente autonomia para produtividade e desenvolvimento.', price: 8999.9, stock: 5, category: 'Notebooks', brand: 'Apple', rating: 4.9, reviews: 93, emoji: '💻', featured: true },
  { id: 3, name: 'Galaxy S26', description: 'Smartphone premium com câmera avançada, tela AMOLED e alto desempenho.', price: 5799.9, oldPrice: 6199.9, stock: 11, category: 'Smartphones', brand: 'Samsung', rating: 4.7, reviews: 211, emoji: '📱', badge: 'Novo', featured: true },
  { id: 4, name: 'iPhone 17', description: 'Desempenho de ponta, câmera avançada e integração completa com o ecossistema Apple.', price: 7199.9, stock: 9, category: 'Smartphones', brand: 'Apple', rating: 4.8, reviews: 156, emoji: '📱', featured: true },
  { id: 5, name: 'RTX 5070 12GB', description: 'Placa de vídeo para alta performance em jogos, criação e aplicações aceleradas por GPU.', price: 4299.9, oldPrice: 4699.9, stock: 6, category: 'Hardware', brand: 'NVIDIA', rating: 4.9, reviews: 74, emoji: '🎮', badge: '-9%' },
  { id: 6, name: 'Ryzen 7 9700X', description: 'Processador de alto desempenho para workstations e computadores gamer.', price: 2399.9, stock: 14, category: 'Hardware', brand: 'AMD', rating: 4.8, reviews: 122, emoji: '🧠' },
  { id: 7, name: 'Mouse G Pro X Superlight', description: 'Mouse gamer sem fio ultraleve, preciso e confortável para longas sessões.', price: 749.9, oldPrice: 899.9, stock: 27, category: 'Periféricos', brand: 'Logitech', rating: 4.9, reviews: 348, emoji: '🖱️', badge: 'Oferta' },
  { id: 8, name: 'Teclado Keychron K2', description: 'Teclado mecânico compacto, wireless e ideal para programação e produtividade.', price: 699.9, stock: 19, category: 'Periféricos', brand: 'Keychron', rating: 4.7, reviews: 286, emoji: '⌨️' },
  { id: 9, name: 'Headset Cloud III Wireless', description: 'Áudio imersivo, microfone removível e excelente autonomia de bateria.', price: 899.9, stock: 12, category: 'Áudio', brand: 'HyperX', rating: 4.8, reviews: 143, emoji: '🎧' },
  { id: 10, name: 'Monitor 27” QHD 180Hz', description: 'Monitor rápido e nítido para jogos, desenvolvimento e produtividade.', price: 1799.9, oldPrice: 2099.9, stock: 7, category: 'Periféricos', brand: 'LG', rating: 4.8, reviews: 98, emoji: '🖥️', badge: '-14%' },
  { id: 11, name: 'SSD NVMe 2TB Gen4', description: 'Armazenamento de alta velocidade para sistemas, jogos e projetos pesados.', price: 799.9, stock: 31, category: 'Hardware', brand: 'Kingston', rating: 4.7, reviews: 419, emoji: '💾' },
  { id: 12, name: 'AirPods Pro', description: 'Fone true wireless com cancelamento ativo de ruído e áudio espacial.', price: 1899.9, stock: 15, category: 'Áudio', brand: 'Apple', rating: 4.8, reviews: 530, emoji: '🎧' }
]

export const mockOrders: Order[] = [
  { id: '#TS-1048', date: '08/09/2026', status: 'Entregue', total: 5749.8, items: [
    { name: 'Notebook Nitro V15', quantity: 1, unitPrice: 4999.9, emoji: '💻' },
    { name: 'Mouse G Pro X Superlight', quantity: 1, unitPrice: 749.9, emoji: '🖱️' }
  ]},
  { id: '#TS-1062', date: '12/09/2026', status: 'Enviado', total: 1699.8, items: [
    { name: 'Headset Cloud III Wireless', quantity: 1, unitPrice: 899.9, emoji: '🎧' },
    { name: 'SSD NVMe 2TB Gen4', quantity: 1, unitPrice: 799.9, emoji: '💾' }
  ]}
]