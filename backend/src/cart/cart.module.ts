import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CartController } from './cart.controller.js';
import { CartService } from './cart.service.js';

@Module({
  controllers: [CartController],
  providers: [CartService, JwtAuthGuard],
  exports: [CartService],
})
export class CartModule {}
