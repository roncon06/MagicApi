import { CanActivate, ExecutionContext } from '@nestjs/common';

export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = { userId: 'test-user-id' }; // Simule um payload JWT válido
    return true;
  }
}
