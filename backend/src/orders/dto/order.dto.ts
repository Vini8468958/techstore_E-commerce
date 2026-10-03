import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  addressId!: string;

  @ApiProperty({ enum: ['PIX', 'CREDIT_CARD', 'BOLETO'] })
  @IsIn(['PIX', 'CREDIT_CARD', 'BOLETO'])
  paymentMethod!: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'] })
  @IsIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'])
  status!: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
}
