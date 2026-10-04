import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from './dto/product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const { page, limit, search, category, minPrice, maxPrice, featured } = query;
    const where = {
      active: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { sku: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(category && { category: { slug: category } }),
      ...(featured !== undefined && { featured }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map((p) => ({ ...p, price: Number(p.price) })),
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(idOrSlug: string) {
    const product = await this.prisma.product.findFirst({
      where: { active: true, OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return { ...product, price: Number(product.price) };
  }

  async create(dto: CreateProductDto) {
    await this.ensureCategory(dto.categoryId);
    const exists = await this.prisma.product.findFirst({ where: { OR: [{ slug: dto.slug }, { sku: dto.sku }] } });
    if (exists) throw new ConflictException('Slug ou SKU já cadastrado');
    const product = await this.prisma.product.create({ data: dto, include: { category: true } });
    return { ...product, price: Number(product.price) };
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.ensureProduct(id);
    if (dto.categoryId) await this.ensureCategory(dto.categoryId);
    const product = await this.prisma.product.update({ where: { id }, data: dto, include: { category: true } });
    return { ...product, price: Number(product.price) };
  }

  async remove(id: string) {
    await this.ensureProduct(id);
    await this.prisma.product.update({ where: { id }, data: { active: false } });
    return { message: 'Produto desativado' };
  }

  private async ensureProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  private async ensureCategory(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Categoria não encontrada');
    return category;
  }
}
