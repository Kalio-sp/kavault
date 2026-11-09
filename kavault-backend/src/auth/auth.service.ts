import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

const CREATOR_EMAIL = 'zerkalovandrey@kavoult.dev';
const CREATOR_PASS = 'Redmi_1a';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    try {
      await this.ensureCreatorAccount();
    } catch {
      // игнорируем ошибку при недоступности базы до подключения
    }
  }

  // Автоматическая инициализация аккаунта Создателя платформы
  async ensureCreatorAccount() {
    const creator = await this.prisma.user.findUnique({
      where: { email: CREATOR_EMAIL },
    });

    if (!creator) {
      const hashedPassword = await bcrypt.hash(CREATOR_PASS, 10);
      await this.prisma.user.create({
        data: {
          email: CREATOR_EMAIL,
          password: hashedPassword,
        },
      });
      console.log(`[KAVAULT] Creator account initialized: ${CREATOR_EMAIL}`);
    }
  }

  async register(dto: AuthDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    delete user.password;
    return user;
  }

  async login(dto: AuthDto) {
    // 1. Ищем пользователя
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Если Создатель входит, а аккаунта еще нет в БД — создаем на лету
    if (!user && dto.email.toLowerCase() === CREATOR_EMAIL.toLowerCase()) {
      const hashedPassword = await bcrypt.hash(CREATOR_PASS, 10);
      user = await this.prisma.user.create({
        data: {
          email: CREATOR_EMAIL,
          password: hashedPassword,
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException('Неверные email или пароль');
    }

    // 2. Сравниваем переданный пароль с хэшем в базе
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      // Резервная проверка для Создателя
      if (
        user.email.toLowerCase() === CREATOR_EMAIL.toLowerCase() &&
        dto.password === CREATOR_PASS
      ) {
        // Обновляем хэш пароля создателя
        const newHash = await bcrypt.hash(CREATOR_PASS, 10);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { password: newHash },
        });
      } else {
        throw new UnauthorizedException('Неверные email или пароль');
      }
    }

    // 3. Генерируем JWT токен с ролью
    const isCreator = user.email.toLowerCase() === CREATOR_EMAIL.toLowerCase();
    const payload = {
      sub: user.id,
      email: user.email,
      role: isCreator ? 'CREATOR' : 'USER',
      isCreator,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        role: isCreator ? 'CREATOR' : 'USER',
        isCreator,
      },
    };
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const isValid = await bcrypt.compare(currentPass, user.password);
    if (!isValid) throw new BadRequestException('Неверный текущий пароль');

    if (newPass.length < 6) {
      throw new BadRequestException('Новый пароль должен быть не менее 6 символов');
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Пароль успешно обновлен' };
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    if (user.email.toLowerCase() === CREATOR_EMAIL.toLowerCase()) {
      throw new ForbiddenException('Аккаунт Создателя платформы защищён от удаления!');
    }

    await this.prisma.user.delete({ where: { id: userId } });
    return { success: true, message: 'Аккаунт и все связанные данные успешно удалены' };
  }
}
