// src/images/dto/create-image.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UploadImageResponseDto {
    @ApiProperty({
        description: 'ID изображения',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        description: 'URL изображения',
        example: '/images/abc123.jpg'
    })
    @IsString()
    url: string;

    @ApiProperty({
        description: 'Имя файла',
        example: 'abc123.jpg'
    })
    @IsString()
    filename: string;
}