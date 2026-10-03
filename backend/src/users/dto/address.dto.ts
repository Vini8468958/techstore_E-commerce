import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Casa' })
  @IsString()
  label!: string;

  @ApiProperty({ example: 'Vinícius Barbosa' })
  @IsString()
  @MinLength(2)
  recipient!: string;

  @ApiProperty({ example: '50000-000' })
  @IsString()
  zipCode!: string;

  @ApiProperty({ example: 'Rua Exemplo' })
  @IsString()
  street!: string;

  @ApiProperty({ example: '123' })
  @IsString()
  number!: string;

  @ApiPropertyOptional({ example: 'Apto 101' })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ example: 'Boa Vista' })
  @IsString()
  neighborhood!: string;

  @ApiProperty({ example: 'Recife' })
  @IsString()
  city!: string;

  @ApiProperty({ example: 'PE' })
  @IsString()
  @Length(2, 2)
  state!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recipient?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
