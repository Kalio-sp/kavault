import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const CREATOR_EMAIL = 'zerkalovandrey@kavoult.dev';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getGlobalStats() {
    const [totalUsers, totalResources, totalCards] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.resource.count(),
      this.prisma.japaneseCard.count(),
    ]);

    const memoryUsage = process.memoryUsage();

    return {
      totalUsers,
      totalResources,
      totalCards,
      system: {
        nodeVersion: process.version,
        uptimeSeconds: Math.round(process.uptime()),
        memoryRssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        memoryHeapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        platform: process.platform,
        status: 'ONLINE',
      },
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            resources: true,
            japaneseCards: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => ({
      ...u,
      isCreator: u.email.toLowerCase() === CREATOR_EMAIL.toLowerCase(),
      role:
        u.email.toLowerCase() === CREATOR_EMAIL.toLowerCase()
          ? 'CREATOR'
          : 'USER',
    }));
  }

  async deleteUser(targetUserId: string, currentUserId: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) throw new NotFoundException('Пользователь не найден');

    if (targetUser.email.toLowerCase() === CREATOR_EMAIL.toLowerCase()) {
      throw new ForbiddenException(
        'Запрещено: аккаунт Создателя KAVAULT невозможно удалить!',
      );
    }

    if (targetUserId === currentUserId) {
      throw new ForbiddenException('Нельзя удалить свой собственный аккаунт');
    }

    await this.prisma.user.delete({ where: { id: targetUserId } });

    return {
      success: true,
      message: `Пользователь ${targetUser.email} и все его данные успешно удалены`,
    };
  }

  // Генератор стартового демонстрационного контента
  async seedDemoContent(userId: string) {
    const sampleResources = [
      {
        title: 'React 19 Deep Dive: Server Components, Actions and Hooks',
        url: 'https://react.dev/blog/2024/04/25/react-19',
        type: 'ARTICLE' as any,
        status: 'LEARNING' as any,
        tags: ['React', 'Frontend', 'WebDev'],
        note: 'Разбор useOptimistic, useFormStatus и Server Actions в продакшене.',
      },
      {
        title: 'NestJS Architecture & Best Practices 2026',
        url: 'https://docs.nestjs.com',
        type: 'DOCUMENTATION' as any,
        status: 'TO_LEARN' as any,
        tags: ['Backend', 'NestJS', 'Architecture'],
        note: 'Паттерны проектирования микросервисов и CQRS.',
      },
      {
        title: 'PostgreSQL Indexing Essentials & Performance Tuning',
        url: 'https://www.postgresql.org/docs/current/indexes.html',
        type: 'ARTICLE' as any,
        status: 'COMPLETED' as any,
        tags: ['Database', 'PostgreSQL', 'Performance'],
        note: 'B-Tree, GIN индексы для поиска и полнотекстового поиска.',
      },
    ];

    const sampleCards = [
      {
        word: '創造主',
        reading: 'そうぞうしゅ',
        meaning: 'Создатель, творец',
        type: 'VOCABULARY' as any,
        level: 2,
      },
      {
        word: '未来',
        reading: 'みらい',
        meaning: 'Будущее',
        type: 'KANJI' as any,
        level: 1,
      },
      {
        word: '知識',
        reading: 'ちしき',
        meaning: 'Знания, эрудиция',
        type: 'VOCABULARY' as any,
        level: 3,
      },
      {
        word: '継続は力なり',
        reading: 'けいぞくはちからなり',
        meaning: 'Постоянство — залог успеха',
        type: 'GRAMMAR' as any,
        level: 1,
      },
    ];

    let createdRes = 0;
    for (const r of sampleResources) {
      await this.prisma.resource.create({
        data: {
          ...r,
          userId,
        },
      });
      createdRes++;
    }

    let createdCards = 0;
    for (const c of sampleCards) {
      await this.prisma.japaneseCard.create({
        data: {
          ...c,
          userId,
        },
      });
      createdCards++;
    }

    return {
      success: true,
      createdResources: createdRes,
      createdCards: createdCards,
      message: `Успешно сгенерировано: ${createdRes} материалов и ${createdCards} карточек!`,
    };
  }

  // Полный дамп платформы
  async exportEntireDatabase() {
    const [users, resources, cards] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      }),
      this.prisma.resource.findMany(),
      this.prisma.japaneseCard.findMany(),
    ]);

    return {
      version: '1.0-SYSTEM-BACKUP',
      exportedAt: new Date().toISOString(),
      creator: CREATOR_EMAIL,
      stats: {
        totalUsers: users.length,
        totalResources: resources.length,
        totalCards: cards.length,
      },
      users,
      resources,
      japaneseCards: cards,
    };
  }
}
