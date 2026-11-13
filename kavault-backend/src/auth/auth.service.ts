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
import {
  CREATOR_EMAIL,
  isCreatorEmail,
  normalizeEmail,
} from './creator.constants';
import { SocialService } from '../social/social.service';
import { sanitizeNickname } from '../social/mmr.utils';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private socialService: SocialService,
  ) {}

  async onModuleInit() {
    try {
      await this.ensureCreatorAccount();
    } catch {
      // игнорируем ошибку при недоступности базы до подключения
    }
  }

  // Автоматическая инициализация аккаунта Создателя платформы (при наличии переменной CREATOR_INITIAL_PASSWORD)
  async ensureCreatorAccount() {
    const creatorEmail = normalizeEmail(process.env.CREATOR_EMAIL || CREATOR_EMAIL);
    const creator = await this.prisma.user.findUnique({
      where: { email: creatorEmail },
    });

    if (!creator) {
      const initialPassword = process.env.CREATOR_INITIAL_PASSWORD;
      if (initialPassword) {
        const hashedPassword = await bcrypt.hash(initialPassword, 10);
        await this.prisma.user.create({
          data: {
            email: creatorEmail,
            nickname: process.env.CREATOR_NICKNAME || 'zerkalovandrey',
            password: hashedPassword,
            studyLanguage: 'ja',
            showProgramming: true,
            onboardingCompleted: true,
            unlockedAchievements: {},
          },
        });
        console.log(`[KAVAULT] Creator account initialized: ${creatorEmail}`);
      }
    }
  }

  async register(dto: AuthDto) {
    const email = normalizeEmail(dto.email);
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Укажите корректный email');
    }
    if (isCreatorEmail(email)) {
      throw new ConflictException('Этот email зарезервирован системой');
    }

    const userExists = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (userExists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    let finalNickname: string;
    if (dto.nickname && dto.nickname.trim()) {
      const cleanNick = sanitizeNickname(dto.nickname);
      if (cleanNick.length < 3) {
        throw new BadRequestException('Никнейм должен содержать минимум 3 символа');
      }
      const nickConflict = await this.prisma.user.findFirst({
        where: { nickname: { equals: cleanNick, mode: 'insensitive' } },
        select: { id: true },
      });
      if (nickConflict) {
        throw new ConflictException('Этот никнейм уже занят');
      }
      finalNickname = cleanNick;
    } else {
      finalNickname = await this.socialService.generateUniqueNickname(email);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        nickname: finalNickname,
        password: hashedPassword,
        studyLanguage: 'ja',
        showProgramming: true,
        onboardingCompleted: false,
        unlockedAchievements: {},
      },
    });

    delete user.password;
    return user;
  }

  async login(dto: AuthDto) {
    const normalizedEmail = normalizeEmail(dto.email);
    // 1. Ищем пользователя (без учёта регистра)
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });

    if (!user) {
      throw new UnauthorizedException('Неверные email или пароль');
    }

    // 2. Сравниваем переданный пароль со строго сохранённым хэшем в базе
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные email или пароль');
    }

    const socialProfile = await this.socialService.ensureUserProfileReady(user.id);

    // 3. Генерируем JWT токен — роль CREATOR строго только для CREATOR_EMAIL
    const isCreator = isCreatorEmail(user.email);
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
        nickname: socialProfile?.nickname || user.nickname,
        mmr: socialProfile?.mmr ?? user.mmr,
        role: isCreator ? 'CREATOR' : 'USER',
        isCreator,
        studyLanguage: user.studyLanguage,
        showProgramming: user.showProgramming,
        onboardingCompleted: user.onboardingCompleted,
      },
    };
  }

  async getProfile(jwtUser: {
    userId: string;
    email: string;
    role: string;
    isCreator: boolean;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: jwtUser.userId },
      select: {
        email: true,
        nickname: true,
        mmr: true,
        studyLanguage: true,
        showProgramming: true,
        onboardingCompleted: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден или удалён');
    }
    const socialProfile = await this.socialService.ensureUserProfileReady(jwtUser.userId);
    const isCreator = isCreatorEmail(user.email);
    return {
      userId: jwtUser.userId,
      email: user.email,
      nickname: socialProfile?.nickname || user.nickname,
      mmr: socialProfile?.mmr ?? user.mmr,
      role: isCreator ? 'CREATOR' : 'USER',
      isCreator,
      studyLanguage: user.studyLanguage || 'ja',
      showProgramming: user.showProgramming ?? true,
      onboardingCompleted: user.onboardingCompleted ?? true,
    };
  }

  async updatePreferences(
    userId: string,
    body: {
      studyLanguage?: string;
      showProgramming?: boolean;
      onboardingCompleted?: boolean;
    },
  ) {
    const allowedLangs = new Set(['ja', 'en', 'de']);
    const data: Record<string, any> = {};

    if (typeof body.studyLanguage === 'string' && allowedLangs.has(body.studyLanguage)) {
      data.studyLanguage = body.studyLanguage;
    }
    if (typeof body.showProgramming === 'boolean') {
      data.showProgramming = body.showProgramming;
    }
    if (typeof body.onboardingCompleted === 'boolean') {
      data.onboardingCompleted = body.onboardingCompleted;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        studyLanguage: true,
        showProgramming: true,
        onboardingCompleted: true,
      },
    });

    return updated;
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

    if (isCreatorEmail(user.email)) {
      throw new ForbiddenException('Аккаунт Создателя платформы защищён от удаления!');
    }

    await this.prisma.user.delete({ where: { id: userId } });
    return { success: true, message: 'Аккаунт и все связанные данные успешно удалены' };
  }

  async getAchievements(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        unlockedAchievements: true,
        resources: {
          select: { type: true, tags: true, note: true, createdAt: true },
        },
        japaneseCards: {
          select: { word: true, type: true, level: true, createdAt: true, updatedAt: true },
        },
      },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');

    // Первичная тихая инициализация для существующих аккаунтов до этой миграции:
    // фиксируем в базе уже достигнутые по данным БД ачивки, чтобы они не всплывали заново.
    if (user.unlockedAchievements === null) {
      const now = new Date().toISOString();
      const backfill: Record<string, { unlockedAt: string }> = {};
      const mark = (id: string) => {
        backfill[id] = { unlockedAt: now };
      };

      const cards = user.japaneseCards || [];
      const res = user.resources || [];

      if (cards.length >= 1) mark('jap_first_word');
      if (cards.length >= 25) mark('jap_words_25');
      if (cards.length >= 100) mark('jap_words_100');

      const kanaCards = cards.filter(
        (c) =>
          c.type === 'KANA' ||
          (!c.type &&
            /[\u3040-\u309F\u30A0-\u30FF]/.test(c.word || '') &&
            !/[\u4E00-\u9FAF]/.test(c.word || '')),
      );
      if (kanaCards.length >= 10) mark('jap_kana_10');

      const kanjiCards = cards.filter(
        (c) => c.type === 'KANJI' || /[\u4E00-\u9FAF]/.test(c.word || ''),
      );
      if (kanjiCards.length >= 10) mark('jap_kanji_10');
      if (kanjiCards.length >= 25) mark('jap_kanji_25');
      if (cards.some((c) => (c.level || 0) > 0)) mark('jap_first_review');

      const devItems = res.filter((r) => r.type !== 'REPOSITORY');
      if (devItems.length >= 1) mark('dev_first_resource');
      if (devItems.length >= 10) mark('dev_resources_10');
      if (devItems.length >= 25) mark('dev_resources_25');
      if (new Set(devItems.map((r) => r.type)).size >= 3) mark('dev_categories_3');
      if (devItems.some((r) => Boolean(r.note && r.note.trim().length > 0))) {
        mark('dev_with_notes');
      }
      if (devItems.filter((r) => Array.isArray(r.tags) && r.tags.length > 0).length >= 3) {
        mark('dev_with_tags');
      }

      const gitRepos = res.filter((r) => r.type === 'REPOSITORY');
      if (gitRepos.length >= 1) mark('git_first_repo');
      if (gitRepos.length >= 5) mark('git_repos_5');
      if (gitRepos.length >= 15) mark('git_repos_15');
      if (new Set(gitRepos.flatMap((r) => r.tags || [])).size >= 3) {
        mark('git_multilang');
      }

      const totalNodes = res.length + cards.length;
      if (totalNodes >= 20) mark('graph_nodes_20');
      if (totalNodes >= 50) {
        mark('graph_nodes_50');
        mark('sys_total_50');
      }

      const emailLower = (user.email || '').toLowerCase();
      if (
        emailLower.includes('zerkalovandrey') ||
        emailLower.includes('andrey') ||
        emailLower.includes('андрей')
      ) {
        mark('secret_mr_a');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { unlockedAchievements: backfill },
      });

      return {
        initialized: true,
        justBackfilled: true,
        achievements: backfill,
      };
    }

    return {
      initialized: true,
      justBackfilled: false,
      achievements:
        (user.unlockedAchievements as Record<string, { unlockedAt: string }>) || {},
    };
  }

  async unlockAchievements(userId: string, ids: string[]) {
    const cleanIds = Array.isArray(ids)
      ? [...new Set(ids.filter((id) => typeof id === 'string' && id.trim().length > 0))]
      : [];

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { unlockedAchievements: true },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const existing =
      (user.unlockedAchievements as Record<string, { unlockedAt: string }> | null) || {};
    const updated: Record<string, { unlockedAt: string }> = { ...existing };
    const now = new Date().toISOString();
    let changed = user.unlockedAchievements === null;

    for (const id of cleanIds) {
      if (!updated[id]) {
        updated[id] = { unlockedAt: now };
        changed = true;
      }
    }

    if (changed) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { unlockedAchievements: updated },
      });
    }

    return { achievements: updated };
  }
}
