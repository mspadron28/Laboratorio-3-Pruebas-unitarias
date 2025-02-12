import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface'; 
import { envs } from '../../../config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // Verificar token JWT
      const payload: JwtPayload = this.jwtService.verify(token, {
        secret: envs.JWT_SECRET,
      });

      // Obtener usuario desde la base de datos
      const user = await this.userService.findOne(payload.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Asignar usuario autenticado al request
      request['user'] = user;
      request['token'] = token;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
