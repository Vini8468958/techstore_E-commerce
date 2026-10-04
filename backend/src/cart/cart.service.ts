import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto.js';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.ensureCart(userId);
    const full = await this.prisma.cart.findUniqueOrThrow({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { category: true } } }, orderBy: { createdAt: 'asc' } } },
    });
    return this.serializeCart(full);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const product = await this.prisma.product.findFirst({ where: { id: dto.productId, active: true } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    const cart = await this.ensureCart(userId);
    const current = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    });
    const newQuantity = (current?.quantity ?? 0) + dto.quantity;
    if (newQuantity > product.stock) throw new BadRequestException('Quantidade solicitada maior que o estoque disponível');

    await this.prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
      update: { quantity: newQuantity },
      create: { cartId: cart.id, productId: product.id, quantity: dto.quantity },
    });
    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
      include: { product: true },
    });
    if (!item) throw new NotFoundException('Item do carrinho não encontrado');
    if (dto.quantity > item.product.stock) throw new BadRequestException('Quantidade solicitada maior que o estoque disponível');
    await this.prisma.cartItem.update({ where: { id: itemId }, data: { quantity: dto.quantity } });
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({ where: { id: itemId, cart: { userId } } });
    if (!item) throw new NotFoundException('Item do carrinho não encontrado');
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  }

  async clear(userId: string) {
    const cart = await this.ensureCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getCart(userId);
  }

  private ensureCart(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  private serializeCart(cart: any) {
    const items = cart.items.map((item: any) => ({
      ...item,
      product: { ...item.product, price: Number(item.product.price) },
      subtotal: Number(item.product.price) * item.quantity,
    }));
    const subtotal = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    return { id: cart.id, items, subtotal };
  }
}
