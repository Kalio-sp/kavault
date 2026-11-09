import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service'; // 1. Импортируем Prisma

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'Redmi_1a',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService], // 2. Добавляем сюда!
})
export class AuthModule {}
