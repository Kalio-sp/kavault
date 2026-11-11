import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isCreatorEmail } from './creator.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'Redmi_1a',
    });
  }

  async validate(payload: { sub?: string; email?: string }) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Недействительный токен авторизации');
    }

    // Проверяем живое наличие пользователя в БД — удалённые пользователи мгновенно теряют доступ на сервере
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new UnauthorizedException('Аккаунт был удалён или не найден');
    }

    const isCreator = isCreatorEmail(user.email);

    return {
      userId: user.id,
      email: user.email,
      role: isCreator ? 'CREATOR' : 'USER',
      isCreator,
    };
  }
}
