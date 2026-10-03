import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.phone !== undefined && { phone: dto.phone.trim() || null }),
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
  }

  listAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    return this.prisma.$transaction(async (tx) => {
      const addressCount = await tx.address.count({ where: { userId } });
      const makeDefault = dto.isDefault ?? addressCount === 0;
      if (makeDefault) {
        await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
      }
      return tx.address.create({
        data: { ...dto, userId, state: dto.state.toUpperCase(), isDefault: makeDefault },
      });
    });
  }

  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto) {
    await this.ensureAddressOwner(userId, addressId);
    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault === true) {
        await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
      }
      return tx.address.update({
        where: { id: addressId },
        data: { ...dto, ...(dto.state && { state: dto.state.toUpperCase() }) },
      });
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.ensureAddressOwner(userId, addressId);
    await this.prisma.address.delete({ where: { id: addressId } });
    if (address.isDefault) {
      const next = await this.prisma.address.findFirst({ where: { userId }, orderBy: { createdAt: 'asc' } });
      if (next) await this.prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
    return { message: 'Endereço removido' };
  }

  listUsers() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRole(userId: string, dto: UpdateRoleDto) {
    const exists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!exists) throw new NotFoundException('Usuário não encontrado');
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: dto.role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  private async ensureAddressOwner(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundException('Endereço não encontrado');
    return address;
  }
}
