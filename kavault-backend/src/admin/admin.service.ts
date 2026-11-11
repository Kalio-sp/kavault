import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JapaneseService } from '../japanese/japanese.service';
import {
  CREATOR_EMAIL,
  isCreatorEmail,
  normalizeEmail,
} from '../auth/creator.constants';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private japaneseService: JapaneseService,
  ) {}

  async getGlobalStats() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const dbStart = Date.now();
    await this.prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - dbStart;

    const [
      totalUsers,
      recentUsers7d,
      onboardedUsers,
      programmingUsers,
      usersByLang,
      totalResources,
      totalRepositories,
      totalPassages,
      totalCards,
      masteredCards,
      cardsByLang,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      this.prisma.user.count({ where: { onboardingCompleted: true } }),
      this.prisma.user.count({ where: { showProgramming: true } }),
      this.prisma.user.groupBy({
        by: ['studyLanguage'],
        _count: { _all: true },
      }),
      this.prisma.resource.count({ where: { type: { not: 'REPOSITORY' } } }),
      this.prisma.resource.count({ where: { type: 'REPOSITORY' } }),
      this.prisma.studyPassage.count(),
      this.prisma.japaneseCard.count(),
      this.prisma.japaneseCard.count({ where: { level: { gte: 2 } } }),
      this.prisma.japaneseCard.groupBy({
        by: ['language'],
        _count: { _all: true },
      }),
    ]);

    const languageBreakdown: Record<string, number> = { ja: 0, en: 0, de: 0 };
    usersByLang.forEach((row) => {
      const key = (row.studyLanguage || 'ja').toLowerCase();
      languageBreakdown[key] = (languageBreakdown[key] || 0) + row._count._all;
    });

    const cardsByLanguage: Record<string, number> = { ja: 0, en: 0, de: 0 };
    cardsByLang.forEach((row) => {
      const key = (row.language || 'ja').toLowerCase();
      cardsByLanguage[key] = (cardsByLanguage[key] || 0) + row._count._all;
    });

    const memoryUsage = process.memoryUsage();

    return {
      totalUsers,
      recentUsers7d,
      onboardedUsers,
      programmingUsers,
      languageBreakdown,
      totalResources,
      totalRepositories,
      totalPassages,
      totalCards,
      masteredCards,
      cardsByLanguage,
      ttsCache: this.japaneseService.getTtsCacheStats(),
      system: {
        nodeVersion: process.version,
        uptimeSeconds: Math.round(process.uptime()),
        memoryRssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        memoryHeapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        platform: process.platform,
        status: 'ONLINE',
        dbLatencyMs,
      },
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        studyLanguage: true,
        showProgramming: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            resources: true,
            japaneseCards: true,
            studyPassages: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => {
      const isCreator = isCreatorEmail(u.email);
      return {
        ...u,
        isCreator,
        role: isCreator ? 'CREATOR' : 'USER',
      };
    });
  }

  async getUserDetails(targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        studyLanguage: true,
        showProgramming: true,
        onboardingCompleted: true,
        unlockedAchievements: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            resources: true,
            japaneseCards: true,
            studyPassages: true,
          },
        },
        resources: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            url: true,
            type: true,
            status: true,
            createdAt: true,
          },
        },
        japaneseCards: {
          take: 12,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            word: true,
            meaning: true,
            type: true,
            language: true,
            studyLevel: true,
            level: true,
          },
        },
        studyPassages: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            language: true,
            kind: true,
            level: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    const achObj =
      (user.unlockedAchievements as Record<string, unknown> | null) || {};
    const isCreator = isCreatorEmail(user.email);

    return {
      id: user.id,
      email: user.email,
      studyLanguage: user.studyLanguage,
      showProgramming: user.showProgramming,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isCreator,
      role: isCreator ? 'CREATOR' : 'USER',
      achievementsCount: Object.keys(achObj).length,
      _count: user._count,
      recentResources: user.resources,
      recentCards: user.japaneseCards,
      recentPassages: user.studyPassages,
    };
  }

  async createUser(body: {
    email: string;
    password: string;
    studyLanguage?: string;
    showProgramming?: boolean;
    onboardingCompleted?: boolean;
  }) {
    const email = normalizeEmail(body.email);
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Укажите корректный email');
    }
    if (isCreatorEmail(email)) {
      throw new ConflictException('Email Создателя уже зарезервирован');
    }
    if (!body.password || body.password.length < 6) {
      throw new BadRequestException('Пароль должен содержать минимум 6 символов');
    }

    const exists = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });
    if (exists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const allowedLangs = new Set(['ja', 'en', 'de']);
    const studyLanguage = allowedLangs.has(body.studyLanguage || '')
      ? body.studyLanguage!
      : 'ja';

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const created = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        studyLanguage,
        showProgramming:
          typeof body.showProgramming === 'boolean' ? body.showProgramming : true,
        onboardingCompleted:
          typeof body.onboardingCompleted === 'boolean'
            ? body.onboardingCompleted
            : false,
        unlockedAchievements: {},
      },
      select: {
        id: true,
        email: true,
        studyLanguage: true,
        showProgramming: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    });

    return { ...created, isCreator: false, role: 'USER' };
  }

  async updateUser(
    targetUserId: string,
    body: {
      studyLanguage?: string;
      showProgramming?: boolean;
      onboardingCompleted?: boolean;
      newPassword?: string;
    },
  ) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true },
    });
    if (!targetUser) throw new NotFoundException('Пользователь не найден');

    const data: Record<string, any> = {};
    const allowedLangs = new Set(['ja', 'en', 'de']);

    if (typeof body.studyLanguage === 'string' && allowedLangs.has(body.studyLanguage)) {
      data.studyLanguage = body.studyLanguage;
    }
    if (typeof body.showProgramming === 'boolean') {
      data.showProgramming = body.showProgramming;
    }
    if (typeof body.onboardingCompleted === 'boolean') {
      data.onboardingCompleted = body.onboardingCompleted;
    }
    if (typeof body.newPassword === 'string' && body.newPassword.length > 0) {
      if (isCreatorEmail(targetUser.email)) {
        throw new ForbiddenException(
          'Пароль аккаунта Создателя нельзя сбросить через таблицу пользователей',
        );
      }
      if (body.newPassword.length < 6) {
        throw new BadRequestException('Новый пароль должен быть не менее 6 символов');
      }
      data.password = await bcrypt.hash(body.newPassword, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data,
      select: {
        id: true,
        email: true,
        studyLanguage: true,
        showProgramming: true,
        onboardingCompleted: true,
      },
    });

    return {
      ...updated,
      isCreator: isCreatorEmail(updated.email),
      role: isCreatorEmail(updated.email) ? 'CREATOR' : 'USER',
    };
  }

  async exportSingleUser(targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        studyLanguage: true,
        showProgramming: true,
        onboardingCompleted: true,
        createdAt: true,
        resources: true,
        japaneseCards: true,
        studyPassages: true,
      },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');

    return {
      version: '1.0-USER-BACKUP',
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        studyLanguage: user.studyLanguage,
        showProgramming: user.showProgramming,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
      },
      resources: user.resources,
      japaneseCards: user.japaneseCards,
      studyPassages: user.studyPassages,
    };
  }

  async purgeUserData(targetUserId: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true },
    });
    if (!targetUser) throw new NotFoundException('Пользователь не найден');

    if (isCreatorEmail(targetUser.email)) {
      throw new ForbiddenException(
        'Запрещено очищать данные аккаунта Создателя из панели администратора',
      );
    }

    const [delPass, delCards, delRes] = await this.prisma.$transaction([
      this.prisma.studyPassage.deleteMany({ where: { userId: targetUserId } }),
      this.prisma.japaneseCard.deleteMany({ where: { userId: targetUserId } }),
      this.prisma.resource.deleteMany({ where: { userId: targetUserId } }),
    ]);

    return {
      success: true,
      purgedCounts: {
        resources: delRes.count,
        japaneseCards: delCards.count,
        studyPassages: delPass.count,
      },
      message: `Все учебные данные пользователя ${targetUser.email} очищены`,
    };
  }

  async deleteUser(targetUserId: string, currentUserId: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) throw new NotFoundException('Пользователь не найден');

    if (isCreatorEmail(targetUser.email)) {
      throw new ForbiddenException(
        'Запрещено: аккаунт Создателя KAVAULT невозможно удалить!',
      );
    }

    if (targetUserId === currentUserId) {
      throw new ForbiddenException('Нельзя удалить свой собственный аккаунт');
    }

    // Полное каскадное удаление всех связанных данных и аккаунта в одной транзакции БД;
    // живая проверка JwtStrategy гарантирует мгновенный отзыв доступа на сервере.
    const [delPass, delCards, delRes] = await this.prisma.$transaction([
      this.prisma.studyPassage.deleteMany({ where: { userId: targetUserId } }),
      this.prisma.japaneseCard.deleteMany({ where: { userId: targetUserId } }),
      this.prisma.resource.deleteMany({ where: { userId: targetUserId } }),
      this.prisma.user.delete({ where: { id: targetUserId } }),
    ]);

    return {
      success: true,
      deletedUserId: targetUserId,
      deletedEmail: targetUser.email,
      deletedCounts: {
        resources: delRes.count,
        japaneseCards: delCards.count,
        studyPassages: delPass.count,
      },
      message: `Пользователь ${targetUser.email} полностью удалён с сервера и из базы данных`,
    };
  }

  async bulkDeleteUsers(ids: string[], currentUserId: string) {
    const uniqueIds = Array.isArray(ids)
      ? [...new Set(ids.filter((id) => typeof id === 'string' && id.trim().length > 0))]
      : [];

    if (uniqueIds.length === 0) {
      throw new BadRequestException('Не выбраны пользователи для удаления');
    }

    const targets = await this.prisma.user.findMany({
      where: { id: { in: uniqueIds } },
      select: { id: true, email: true },
    });

    const deletableIds = targets
      .filter((u) => !isCreatorEmail(u.email) && u.id !== currentUserId)
      .map((u) => u.id);

    if (deletableIds.length === 0) {
      throw new ForbiddenException('Нет доступных к удалению пользователей в выборке');
    }

    const [, , , delUsers] = await this.prisma.$transaction([
      this.prisma.studyPassage.deleteMany({ where: { userId: { in: deletableIds } } }),
      this.prisma.japaneseCard.deleteMany({ where: { userId: { in: deletableIds } } }),
      this.prisma.resource.deleteMany({ where: { userId: { in: deletableIds } } }),
      this.prisma.user.deleteMany({ where: { id: { in: deletableIds } } }),
    ]);

    return {
      success: true,
      deletedCount: delUsers.count,
      message: `Удалено аккаунтов с сервера и БД: ${delUsers.count}`,
    };
  }

  clearTtsCache() {
    const result = this.japaneseService.clearTtsCache();
    return {
      success: true,
      ...result,
      message: `Кэш серверной озвучки очищен (${result.cleared})`,
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
        studyLevel: 'N3',
        level: 2,
      },
      {
        word: '未来',
        reading: 'みらい',
        meaning: 'Будущее',
        type: 'KANJI' as any,
        studyLevel: 'N4',
        level: 1,
      },
      {
        word: '知識',
        reading: 'ちしき',
        meaning: 'Знания, эрудиция',
        type: 'VOCABULARY' as any,
        studyLevel: 'N3',
        level: 3,
      },
      {
        word: '継続は力なり',
        reading: 'けいぞくはちからなり',
        meaning: 'Постоянство — залог успеха',
        type: 'GRAMMAR' as any,
        studyLevel: 'N3',
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

  // Полный дамп платформы (включая StudyPassage)
  async exportEntireDatabase() {
    const [users, resources, cards, passages] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          studyLanguage: true,
          showProgramming: true,
          onboardingCompleted: true,
          createdAt: true,
        },
      }),
      this.prisma.resource.findMany(),
      this.prisma.japaneseCard.findMany(),
      this.prisma.studyPassage.findMany(),
    ]);

    return {
      version: '2.0-SYSTEM-BACKUP',
      exportedAt: new Date().toISOString(),
      creator: CREATOR_EMAIL,
      stats: {
        totalUsers: users.length,
        totalResources: resources.length,
        totalCards: cards.length,
        totalPassages: passages.length,
      },
      users,
      resources,
      japaneseCards: cards,
      studyPassages: passages,
    };
  }
}
