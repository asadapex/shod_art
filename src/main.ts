import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe, Logger } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
      origin: '*', // Разрешить все источники
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: '*',
    });

    // Глобальная валидация
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Удаляет свойства, которых нет в DTO
        forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть лишние свойства
        transform: true, // Автоматически преобразует типы
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    // Настройка Swagger
    const config = new DocumentBuilder()
      .setTitle('Admin Panel API')
      .setDescription(
        'API для админ-панели с управлением пользователями и продуктами',
      )
      .setVersion('1.0')
      .addBearerAuth() // Поддержка JWT авторизации
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // Доступ к Swagger UI по /api

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/images/',
    });

    await app.listen(3030);
    logger.log('Application is running on: http://localhost:1233');
    logger.log('Swagger documentation: http://localhost:3030/api');
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
