import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorator.ts/role.decorator';
import { Role } from './enums/role.enum';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtém os papéis exigidos pela rota (via decorator @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se não houver papéis definidos para a rota, permitir o acesso
    if (!requiredRoles) {
      return true;
    }

    // Obtém o usuário da requisição (inserido pelo AuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Verifica se o usuário existe e se tem a propriedade "role"
    if (!user || !user.role) {
      return false;
    }

    // Verifica se o usuário possui algum dos papéis exigidos
    return requiredRoles.some((role) => user.role.includes(role));
  }
}
