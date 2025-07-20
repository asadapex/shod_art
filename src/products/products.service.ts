import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './product.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productsRepository.find();
    return products.map(product => this.mapToResponseDto(product));
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.mapToResponseDto(product);
  }

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      // Убираем image_url из createProductDto, так как используем image_urls
      image_url: undefined
    });

    const savedProduct = await this.productsRepository.save(newProduct);
    return this.mapToResponseDto(savedProduct);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    // Если передаются image_urls, обновляем их
    if (updateProductDto.image_urls) {
      await this.productsRepository.update(id, {
        ...updateProductDto,
        image_url: undefined // Убираем image_url, так как используем image_urls
      });
    } else {
      await this.productsRepository.update(id, updateProductDto);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  private mapToResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      width: product.width,
      height: product.height,
      quantity: product.quantity,
      image_urls: product.image_urls || [],
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString()
    };
  }
}