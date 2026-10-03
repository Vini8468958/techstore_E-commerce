import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import type { AuthUser } from '../common/interfaces/auth-user.interface.js';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto.js';
import { OrdersService } from './orders.service.js';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.sub, dto);
  }

  @Get('my')
  listMine(@CurrentUser() user: AuthUser) {
    return this.ordersService.listMine(user.sub);
  }

  @Get('my/:id')
  findMine(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ordersService.findMine(user.sub, id);
  }

  @Patch('my/:id/cancel')
  cancelMine(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ordersService.cancelMine(user.sub, id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  listAll() {
    return this.ordersService.listAll();
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
