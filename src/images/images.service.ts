// src/images/images.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { UploadImageResponseDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {
    // Создаем папку uploads при инициализации сервиса
    this.ensureUploadsDirectory();
  }

  private async ensureUploadsDirectory(): Promise<void> {
    try {
      await fs.access('uploads');
    } catch {
      await fs.mkdir('uploads', { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadImageResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Проверяем, что файл не пустой
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File is empty');
    }

    // Проверяем размер файла (должен быть больше 0)
    if (file.size === 0) {
      throw new BadRequestException('File size cannot be zero');
    }

    // Проверяем тип файла
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    // Проверяем размер файла (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB');
    }

    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join('uploads', fileName);
    const publicUrl = `/images/${fileName}`;

    try {
      // Сохраняем файл
      await fs.writeFile(filePath, file.buffer);

      this.logger.log(`File saved to disk: ${filePath}`);

      const image = this.imagesRepository.create({
        id: uuidv4(),
        filename: fileName,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: filePath,
      });

      this.logger.log(`Image entity created: ${JSON.stringify(image)}`);

      const savedImage = await this.imagesRepository.save(image);

      this.logger.log(`Image saved to database: ${savedImage.id}`);

      return {
        id: savedImage.id,
        url: publicUrl,
        filename: fileName,
      };
    } catch (error) {
      this.logger.error(`Error saving image: ${error.message}`, error.stack);

      // Удаляем файл в случае ошибки
      try {
        await fs.unlink(filePath);
        this.logger.log(`Cleaned up file: ${filePath}`);
      } catch (unlinkError) {
        this.logger.warn(`Failed to cleanup file: ${unlinkError.message}`);
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<Image> {
    const image = await this.imagesRepository.findOneBy({ id });
    if (!image) {
      throw new BadRequestException('Image not found');
    }
    return image;
  }
}
