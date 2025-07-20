import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

// product.dto.ts
export class CreateProductDto {
  @ApiProperty({ description: 'Название продукта' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Описание продукта' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Цена продукта' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Ширина (см)', required: false })
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiProperty({ description: 'Высота (см)', required: false })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({ description: 'Количество на складе' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ 
    description: 'URL изображений продукта',
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  image_urls?: string[];
}

export class UpdateProductDto {
  @ApiProperty({ description: 'Название продукта', example: 'Laptop', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Описание продукта', example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Цена продукта', example: 1099.99, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'Ширина (см)', required: false })
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiProperty({ description: 'Высота (см)', required: false })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({ description: 'Количество на складе', example: 50, required: false })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ 
    description: 'URL изображений продукта',
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  image_urls?: string[];

  @ApiProperty({ description: 'URL изображения продукта', example: 'http://example.com/new-image.jpg', required: false })
  @IsString()
  @IsOptional()
  image_url?: string;
}

export class ProductResponseDto {
  @ApiProperty({ description: 'ID продукта', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Название продукта', example: 'Laptop' })
  title: string;

  @ApiProperty({ description: 'Описание продукта', example: 'High-performance laptop' })
  description: string;

  @ApiProperty({ description: 'Цена продукта', example: 999.99 })
  price: number;

  @ApiProperty({ description: 'Ширина продукта (см)', example: 30, required: false })
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiProperty({ description: 'Высота продукта (см)', example: 20, required: false })
  @IsNumber()
  @IsOptional()
  height?: number;
  
  @ApiProperty({ description: 'Количество на складе', example: 100 })
  quantity: number;

  @ApiProperty({ 
    description: 'URL изображений продукта', 
    example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
    type: [String]
  })
  image_urls?: string[];

  @ApiProperty({ description: 'Дата создания', example: '2025-07-19T10:18:00.000Z' })
  created_at: string;

  @ApiProperty({ description: 'Дата обновления', example: '2025-07-19T10:18:00.000Z' })
  updated_at: string;

}