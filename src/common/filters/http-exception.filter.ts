// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    console.log(exception)

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'object'
        ? exceptionResponse['message']
        : exceptionResponse;
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database query failed';
      
      // Обработка специфических ошибок MySQL
      if (exception.message.includes('ER_WRONG_VALUE_COUNT_ON_ROW')) {
        message = 'Invalid data format: column count mismatch';
      } else if (exception.message.includes('ER_DUP_ENTRY')) {
        message = 'Duplicate entry found';
      } else if (exception.message.includes('ER_NO_REFERENCED_ROW')) {
        message = 'Referenced record not found';
      }
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Entity not found';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      data: null,
      messages: Array.isArray(message) ? message : [message],
      statusCode: status,
      time: new Date().toISOString(),
    });
  }
}