import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { isCreatorEmail } from '../auth/creator.constants';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    // Права Создателя строго привязаны только к подтверждённому email создателя в БД
    const isAllowed = Boolean(user && isCreatorEmail(user.email));

    if (!isAllowed) {
      throw new ForbiddenException(
        'Доступ запрещён: панель Создателя привязана исключительно к zerkalovandrey@kavoult.dev',
      );
    }

    return true;
  }
}
