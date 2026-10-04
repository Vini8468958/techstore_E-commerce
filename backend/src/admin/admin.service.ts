import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [users, products, orders, pendingOrders, lowStock, revenue] = await this.prisma.$transaction([
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.product.count({ where: { active: true } }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: { in: ['PENDING', 'PROCESSING'] } } }),
      this.prisma.product.count({ where: { active: true, stock: { lte: 5 } } }),
      this.prisma.order.aggregate({
        where: { paymentStatus: 'PAID', status: { not: 'CANCELED' } },
        _sum: { total: true },
      }),
    ]);

    return {
      customers: users,
      activeProducts: products,
      orders,
      pendingOrders,
      lowStockProducts: lowStock,
      revenue: Number(revenue._sum.total ?? 0),
    };
  }
}
