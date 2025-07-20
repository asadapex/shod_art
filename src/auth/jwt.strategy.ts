import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';

interface JwtPayload {
  login: string;
  sub: string;
  role: string;
  canEditProducts: boolean;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      // Проверяем, что пользователь все еще имеет права на редактирование
      if (!user.canEditProducts) {
        throw new UnauthorizedException('User does not have edit permissions');
      }
      
      return {
        id: user.id,
        login: user.login,
        role: user.role,
        canEditProducts: user.canEditProducts,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}