import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const isCreator =
      user &&
      (user.isCreator ||
        user.role === 'CREATOR' ||
        user.email === 'zerkalovandrey@kavoult.dev');

    if (!isCreator) {
      throw new ForbiddenException(
        'Доступ запрещен: требуется статус Создателя / Администратора KAVAULT',
      );
    }

    return true;
  }
}
