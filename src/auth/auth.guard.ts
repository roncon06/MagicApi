import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // Verifique se o token está presente
    if (!token) {
      throw new UnauthorizedException('Token JWT não encontrado');
    }

    try {
      // Verifique o token e obtenha o payload
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // Adicione o payload ao request (para o RolesGuard usá-lo)
      request['user'] = payload;
    } catch (error) {
      // Log opcional para verificar o erro
      console.error('Erro ao verificar o token JWT:', error);
      throw new UnauthorizedException('Token JWT inválido');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
