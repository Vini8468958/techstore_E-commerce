import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto.js';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const address = await this.prisma.address.findFirst({ where: { id: dto.addressId, userId } });
    if (!address) throw new NotFoundException('Endereço não encontrado');

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) throw new BadRequestException('O carrinho está vazio');

    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const shipping = subtotal >= 300 ? 0 : 19.9;
    const total = subtotal + shipping;
    const orderNumber = `TS-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const order = await this.prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        if (!item.product.active) throw new BadRequestException(`${item.product.name} não está mais disponível`);
        const updated = await tx.product.updateMany({
          where: { id: item.productId, active: true, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) {
          throw new BadRequestException(`Estoque insuficiente para ${item.product.name}`);
        }
      }

      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'PROCESSING',
          paymentMethod: dto.paymentMethod,
          paymentStatus: 'PAID',
          subtotal,
          shipping,
          total,
          shippingRecipient: address.recipient,
          shippingZipCode: address.zipCode,
          shippingStreet: address.street,
          shippingNumber: address.number,
          shippingComplement: address.complement,
          shippingNeighborhood: address.neighborhood,
          shippingCity: address.city,
          shippingState: address.state,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productSku: item.product.sku,
              unitPrice: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });

    return this.serializeOrder(order);
  }

  async listMine(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => this.serializeOrder(order));
  }

  async findMine(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({ where: { id, userId }, include: { items: true } });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return this.serializeOrder(order);
  }

  async cancelMine(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({ where: { id, userId }, include: { items: true } });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    if (!['PENDING', 'PROCESSING'].includes(order.status)) {
      throw new BadRequestException('Este pedido não pode mais ser cancelado pelo cliente');
    }
    return this.cancelOrder(order);
  }

  async listAll() {
    const orders = await this.prisma.order.findMany({
      include: { items: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => this.serializeOrder(order));
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    if (dto.status === 'CANCELED' && order.status !== 'CANCELED') return this.cancelOrder(order);
    if (order.status === 'CANCELED') throw new BadRequestException('Pedido cancelado não pode mudar de status');

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { items: true },
    });
    return this.serializeOrder(updated);
  }

  private async cancelOrder(order: any) {
    if (order.status === 'CANCELED') return this.serializeOrder(order);
    const updated = await this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
      }
      return tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELED', paymentStatus: order.paymentStatus === 'PAID' ? 'REFUNDED' : order.paymentStatus },
        include: { items: true },
      });
    });
    return this.serializeOrder(updated);
  }

  private serializeOrder(order: any) {
    return {
      ...order,
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      total: Number(order.total),
      items: order.items?.map((item: any) => ({ ...item, unitPrice: Number(item.unitPrice) })),
    };
  }
}
