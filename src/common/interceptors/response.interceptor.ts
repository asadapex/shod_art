// src/common/interceptors/response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IServiceResponse<T = any> {
  data: T;
  messages: string[];
  statusCode: number;
  time: Date | string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IServiceResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IServiceResponse<T>> {
    const now = new Date();
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map((data) => ({
        data: data || null,
        messages: data?.messages || [],
        statusCode: response.statusCode,
        time: now.toISOString(),
      })),
    );
  }
}