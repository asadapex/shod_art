import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CanEditProductsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    
    if (!user.canEditProducts) {
      throw new ForbiddenException('User does not have permission to edit products');
    }
    
    return true;
  }
}