// src/images/images.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Get,
    Param,
    Res,
    HttpStatus,
    BadRequestException,
    UploadedFiles,
    NotFoundException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadImageResponseDto } from './dto/create-image.dto';
import { Response } from 'express';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) { }

    @Post('upload')
    @ApiOperation({ summary: 'Загрузить изображение' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Файл изображения',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Изображение успешно загружено',
        type: UploadImageResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неверный файл или формат',
    })
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<UploadImageResponseDto> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        // Дополнительная проверка на пустой файл
        if (!file.buffer || file.buffer.length === 0) {
            throw new BadRequestException('File is empty or corrupted');
        }

        try {
            return await this.imagesService.uploadFile(file);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to upload file: ' + error.message);
        }
    }

    @Post('upload-multiple')
    @ApiOperation({ summary: 'Загрузить несколько изображений' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Файлы изображений',
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Изображения успешно загружены',
        schema: {
            type: 'object',
            properties: {
                urls: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['/images/abc123.jpg', '/images/def456.jpg']
                }
            }
        }
    })
    @UseInterceptors(FilesInterceptor('files', 10)) // Максимум 10 файлов
    async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]): Promise<{ urls: string[] }> {
        if (!files || files.length === 0) {
            throw new BadRequestException('Files are required');
        }

        if (files.length > 10) {
            throw new BadRequestException('Maximum 10 files allowed');
        }

        // Проверяем, что все файлы не пустые
        for (const file of files) {
            if (!file.buffer || file.buffer.length === 0) {
                throw new BadRequestException(`File ${file.originalname} is empty or corrupted`);
            }
        }

        try {
            const uploadResults = await Promise.all(
                files.map(file => this.imagesService.uploadFile(file))
            );

            return { urls: uploadResults.map(result => result.url) };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to upload files: ' + error.message);
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить изображение по ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Изображение найдено',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Изображение не найдено',
    })
    async getImage(@Param('id') id: string, @Res() res: Response) {
        try {
            const image = await this.imagesService.findOne(id);
            
            res.set({
                'Content-Type': image.mimetype,
                'Content-Length': image.size.toString(),
                'Cache-Control': 'public, max-age=31536000', // Кэширование на 1 год
            });
            
            res.sendFile(image.path, { root: '.' });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new NotFoundException('Image not found');
            }
            throw error;
        }
    }
}