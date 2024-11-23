import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserLevel } from '@prisma/client'; // Enum gerado pelo Prisma

@Injectable()
export class UserLevelGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredLevels = this.reflector.get<UserLevel[]>(
      'levels',
      context.getHandler(),
    );
    if (!requiredLevels) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (!requiredLevels.includes(user.level)) {
      throw new ForbiddenException('Acesso negado: permissões insuficientes');
    }

    return true;
  }
}
