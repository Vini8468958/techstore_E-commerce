import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: { OR: [{ name: dto.name.trim() }, { slug: dto.slug }] },
    });
    if (existing) throw new ConflictException('Categoria ou slug já cadastrado');
    return this.prisma.category.create({ data: { name: dto.name.trim(), slug: dto.slug } });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.ensureExists(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    const products = await this.prisma.product.count({ where: { categoryId: id } });
    if (products > 0) throw new ConflictException('Não é possível remover uma categoria que possui produtos');
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Categoria removida' };
  }

  private async ensureExists(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Categoria não encontrada');
    return category;
  }
}
