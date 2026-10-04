import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import type { AuthUser } from '../common/interfaces/auth-user.interface.js';
import { CartService } from './cart.service.js';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto.js';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: AuthUser) {
    return this.cartService.getCart(user.sub);
  }

  @Post('items')
  addItem(@CurrentUser() user: AuthUser, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user.sub, dto);
  }

  @Patch('items/:id')
  updateItem(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(user.sub, id, dto);
  }

  @Delete('items/:id')
  removeItem(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.cartService.removeItem(user.sub, id);
  }

  @Delete()
  clear(@CurrentUser() user: AuthUser) {
    return this.cartService.clear(user.sub);
  }
}
