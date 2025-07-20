// product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('float')
  price: number;

  @Column('float', { nullable: true })
  width?: number;

  @Column('float', { nullable: true })
  height?: number;

  @Column('int')
  quantity: number;

  @Column({ nullable: true }) // Оставляем для обратной совместимости
  image_url?: string;

  @Column('simple-array', { nullable: true })
  image_urls?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}