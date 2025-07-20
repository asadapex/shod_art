import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CanEditProductsGuard } from '../auth/can-edit-products.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiResponse({ status: HttpStatus.OK, type: [ProductResponseDto], description: 'Список продуктов' })
  @Get()
  findAll(): Promise<ProductResponseDto[]> {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Получить продукт по ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ProductResponseDto, description: 'Продукт найден' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Продукт не найден' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, CanEditProductsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать продукт' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ProductResponseDto, description: 'Продукт создан' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Неверные данные' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Нет прав на редактирование' })
  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard, CanEditProductsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить продукт' })
  @ApiResponse({ status: HttpStatus.OK, type: ProductResponseDto, description: 'Продукт обновлен' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Продукт не найден' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Неверные данные' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, CanEditProductsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить продукт' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Продукт удален' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Продукт не найден' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Нет прав на редактирование' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}