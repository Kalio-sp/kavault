import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  getTaskRankTier,
  sanitizeNickname,
  TASK_RANK_TIERS,
} from './mmr.utils';

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  async generateUniqueNickname(baseRaw: string, excludeUserId?: string): Promise<string> {
    let base = sanitizeNickname(baseRaw.split('@')[0] || 'learner');
    if (base.length < 3) base = `user_${base || 'kv'}`;

    for (let attempt = 0; attempt < 15; attempt += 1) {
      const candidate =
        attempt === 0
          ? base.slice(0, 24)
          : `${base.slice(0, 18)}_${crypto.randomInt(100, 9999)}`;
      const existing = await this.prisma.user.findFirst({
        where: {
          nickname: { equals: candidate, mode: 'insensitive' },
          ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
        },
        select: { id: true },
      });
      if (!existing) return candidate;
    }

    return `learner_${crypto.randomBytes(3).toString('hex')}`;
  }

  async ensureUserProfileReady(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        mmr: true,
        mmrInitialized: true,
        studyLanguage: true,
      },
    });
    if (!user) return null;

    let nickname = user.nickname;
    let mmr = user.mmr;
    let mmrInitialized = user.mmrInitialized;
    const updates: Record<string, any> = {};

    if (!nickname) {
      nickname = await this.generateUniqueNickname(user.email, user.id);
      updates.nickname = nickname;
    }

    if (!mmrInitialized) {
      const [cards, completedRes, learningRes, passagesCount] = await Promise.all([
        this.prisma.japaneseCard.findMany({
          where: { userId },
          select: { level: true },
        }),
        this.prisma.resource.count({
          where: { userId, status: 'COMPLETED' },
        }),
        this.prisma.resource.count({
          where: { userId, status: 'LEARNING' },
        }),
        this.prisma.studyPassage.count({ where: { userId } }),
      ]);

      const cardScore = cards.reduce(
        (acc, c) => acc + 4 + Math.max(0, c.level || 0) * 12,
        0,
      );
      const baselineMmr =
        cardScore + completedRes * 35 + learningRes * 10 + passagesCount * 20;

      mmr = Math.max(mmr, baselineMmr);
      mmrInitialized = true;
      updates.mmr = mmr;
      updates.mmrInitialized = true;

      if (completedRes > 0) {
        await this.prisma.resource.updateMany({
          where: { userId, status: 'COMPLETED' },
          data: { mmrAwarded: true },
        });
      }
      if (baselineMmr > 0) {
        await this.prisma.mmrLog.create({
          data: {
            userId,
            actionKey: 'baseline_sync',
            reason: 'BASELINE_SYNC',
            delta: baselineMmr,
            meta: 'Task-System initial sync',
          },
        });
      }
    }

    if (Object.keys(updates).length > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: updates,
      });
    }

    return {
      ...user,
      nickname,
      mmr,
      mmrInitialized,
      rankTier: getTaskRankTier(mmr),
    };
  }

  private async syncUninitializedUsers() {
    const pendingUsers = await this.prisma.user.findMany({
      where: {
        OR: [{ nickname: null }, { mmrInitialized: false }],
      },
      select: { id: true },
      take: 100,
    });
    for (const u of pendingUsers) {
      await this.ensureUserProfileReady(u.id);
    }
  }

  async recordMmrEvent(
    userId: string,
    payload: {
      reason: string;
      delta: number;
      actionKey?: string;
      meta?: string;
    },
  ) {
    if (!userId || payload.delta <= 0) {
      return { awarded: false, delta: 0 };
    }

    await this.ensureUserProfileReady(userId);

    return this.prisma.$transaction(async (tx) => {
      if (payload.actionKey) {
        const exists = await tx.mmrLog.findFirst({
          where: { userId, actionKey: payload.actionKey },
          select: { id: true },
        });
        if (exists) {
          return { awarded: false, delta: 0 };
        }
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { mmr: { increment: payload.delta } },
        select: { mmr: true },
      });

      await tx.mmrLog.create({
        data: {
          userId,
          reason: payload.reason,
          delta: payload.delta,
          actionKey: payload.actionKey,
          meta: payload.meta,
        },
      });

      return {
        awarded: true,
        delta: payload.delta,
        totalMmr: updatedUser.mmr,
        rankTier: getTaskRankTier(updatedUser.mmr),
      };
    });
  }

  async awardTaskCompletion(
    userId: string,
    body: { kind: string; itemId?: string },
  ) {
    const cleanId = (body.itemId || 'general').trim().slice(0, 80);
    const today = new Date().toISOString().split('T')[0];

    switch (body.kind) {
      case 'grammar_quiz':
        return this.recordMmrEvent(userId, {
          reason: 'GRAMMAR_QUIZ',
          delta: 20,
          actionKey: `grammar_quiz:${cleanId}`,
          meta: cleanId,
        });
      case 'reading_quiz':
        return this.recordMmrEvent(userId, {
          reason: 'READING_QUIZ',
          delta: 25,
          actionKey: `reading_quiz:${cleanId}`,
          meta: cleanId,
        });
      case 'listening_quiz':
        return this.recordMmrEvent(userId, {
          reason: 'LISTENING_QUIZ',
          delta: 12,
          actionKey: `listen_quiz:${cleanId}:${today}`,
          meta: cleanId,
        });
      case 'listening_dictation':
        return this.recordMmrEvent(userId, {
          reason: 'LISTENING_DICTATION',
          delta: 15,
          actionKey: `listen_dict:${cleanId}:${today}`,
          meta: cleanId,
        });
      case 'dialogue_practice':
        return this.recordMmrEvent(userId, {
          reason: 'DIALOGUE_PRACTICE',
          delta: 12,
          actionKey: `dialogue:${cleanId}:${today}`,
          meta: cleanId,
        });
      default:
        throw new BadRequestException('Неизвестный тип задания Task-System');
    }
  }

  async updateNickname(userId: string, rawNickname: string) {
    const clean = sanitizeNickname(rawNickname);
    if (clean.length < 3) {
      throw new BadRequestException(
        'Никнейм должен содержать от 3 до 24 допустимых символов',
      );
    }

    const conflict = await this.prisma.user.findFirst({
      where: {
        nickname: { equals: clean, mode: 'insensitive' },
        id: { not: userId },
      },
      select: { id: true },
    });
    if (conflict) {
      throw new ConflictException('Этот никнейм уже занят другим пользователем');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { nickname: clean },
      select: { id: true, nickname: true, mmr: true },
    });

    return {
      nickname: updated.nickname,
      mmr: updated.mmr,
      rankTier: getTaskRankTier(updated.mmr),
    };
  }

  async getMySocialSummary(userId: string) {
    const ready = await this.ensureUserProfileReady(userId);
    if (!ready) throw new NotFoundException('Пользователь не найден');

    const [higherCount, recentLogs, friendsCount, pendingIncomingCount] =
      await Promise.all([
        this.prisma.user.count({
          where: {
            OR: [
              { mmr: { gt: ready.mmr } },
              { mmr: ready.mmr, id: { lt: userId } },
            ],
          },
        }),
        this.prisma.mmrLog.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 15,
          select: {
            id: true,
            reason: true,
            delta: true,
            meta: true,
            createdAt: true,
          },
        }),
        this.prisma.friendship.count({
          where: {
            status: 'ACCEPTED',
            OR: [{ requesterId: userId }, { addresseeId: userId }],
          },
        }),
        this.prisma.friendship.count({
          where: { addresseeId: userId, status: 'PENDING' },
        }),
      ]);

    return {
      id: ready.id,
      nickname: ready.nickname,
      mmr: ready.mmr,
      rankTier: ready.rankTier,
      globalRank: higherCount + 1,
      studyLanguage: ready.studyLanguage,
      friendsCount,
      pendingIncomingCount,
      recentLogs,
      tiers: TASK_RANK_TIERS,
    };
  }

  async getPublicLeaderboard(search?: string, lang?: string) {
    await this.syncUninitializedUsers();

    const cleanSearch = (search || '').trim();
    const validLang =
      lang === 'ja' || lang === 'en' || lang === 'de' ? lang : undefined;

    const users = await this.prisma.user.findMany({
      where: {
        ...(cleanSearch
          ? { nickname: { contains: cleanSearch, mode: 'insensitive' } }
          : {}),
        ...(validLang ? { studyLanguage: validLang } : {}),
      },
      orderBy: [{ mmr: 'desc' }, { createdAt: 'asc' }],
      take: 100,
      select: {
        id: true,
        nickname: true,
        mmr: true,
        studyLanguage: true,
        createdAt: true,
        _count: {
          select: {
            japaneseCards: true,
            resources: true,
            studyPassages: true,
          },
        },
      },
    });

    const totalPlayers = await this.prisma.user.count();

    return {
      systemName: 'Task-System',
      totalPlayers,
      tiers: TASK_RANK_TIERS,
      entries: users.map((u, idx) => ({
        rank: idx + 1,
        id: u.id,
        nickname: u.nickname || `Player #${idx + 1}`,
        mmr: u.mmr,
        rankTier: getTaskRankTier(u.mmr),
        studyLanguage: u.studyLanguage || 'ja',
        cardsCount: u._count.japaneseCards,
        resourcesCount: u._count.resources,
        passagesCount: u._count.studyPassages,
        joinedAt: u.createdAt,
      })),
    };
  }

  async getFriendsLeaderboard(userId: string) {
    await this.ensureUserProfileReady(userId);

    const accepted = await this.prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: { requesterId: true, addresseeId: true },
    });

    const ids = new Set<string>([userId]);
    accepted.forEach((f) => {
      ids.add(f.requesterId);
      ids.add(f.addresseeId);
    });

    const users = await this.prisma.user.findMany({
      where: { id: { in: [...ids] } },
      orderBy: [{ mmr: 'desc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        nickname: true,
        mmr: true,
        studyLanguage: true,
        _count: {
          select: {
            japaneseCards: true,
            resources: true,
            studyPassages: true,
          },
        },
      },
    });

    return {
      entries: users.map((u, idx) => ({
        rank: idx + 1,
        id: u.id,
        isSelf: u.id === userId,
        nickname: u.nickname || 'Learner',
        mmr: u.mmr,
        rankTier: getTaskRankTier(u.mmr),
        studyLanguage: u.studyLanguage || 'ja',
        cardsCount: u._count.japaneseCards,
        resourcesCount: u._count.resources,
        passagesCount: u._count.studyPassages,
      })),
    };
  }

  async searchUsersByNickname(currentUserId: string, query: string) {
    await this.syncUninitializedUsers();

    const cleanQ = (query || '').trim();
    if (cleanQ.length < 2) return [];

    const matches = await this.prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        nickname: { contains: cleanQ, mode: 'insensitive' },
      },
      take: 20,
      orderBy: { mmr: 'desc' },
      select: {
        id: true,
        nickname: true,
        mmr: true,
        studyLanguage: true,
        _count: {
          select: { japaneseCards: true, resources: true },
        },
      },
    });

    const existingRelations = await this.prisma.friendship.findMany({
      where: {
        OR: [
          {
            requesterId: currentUserId,
            addresseeId: { in: matches.map((m) => m.id) },
          },
          {
            addresseeId: currentUserId,
            requesterId: { in: matches.map((m) => m.id) },
          },
        ],
      },
    });

    return matches.map((m) => {
      const rel = existingRelations.find(
        (r) => r.requesterId === m.id || r.addresseeId === m.id,
      );
      let relationStatus:
        | 'NONE'
        | 'FRIENDS'
        | 'PENDING_SENT'
        | 'PENDING_RECEIVED' = 'NONE';
      if (rel) {
        if (rel.status === 'ACCEPTED') relationStatus = 'FRIENDS';
        else if (rel.requesterId === currentUserId) relationStatus = 'PENDING_SENT';
        else relationStatus = 'PENDING_RECEIVED';
      }

      return {
        id: m.id,
        nickname: m.nickname,
        mmr: m.mmr,
        rankTier: getTaskRankTier(m.mmr),
        studyLanguage: m.studyLanguage || 'ja',
        cardsCount: m._count.japaneseCards,
        resourcesCount: m._count.resources,
        friendshipId: rel?.id || null,
        relationStatus,
      };
    });
  }

  async getFriendsOverview(userId: string) {
    await this.ensureUserProfileReady(userId);

    const rows = await this.prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: {
          select: {
            id: true,
            nickname: true,
            mmr: true,
            studyLanguage: true,
            _count: { select: { japaneseCards: true, resources: true } },
          },
        },
        addressee: {
          select: {
            id: true,
            nickname: true,
            mmr: true,
            studyLanguage: true,
            _count: { select: { japaneseCards: true, resources: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const mapPeer = (
      friendshipId: string,
      peer: {
        id: string;
        nickname: string | null;
        mmr: number;
        studyLanguage: string;
        _count: { japaneseCards: number; resources: number };
      },
    ) => ({
      friendshipId,
      id: peer.id,
      nickname: peer.nickname || 'Learner',
      mmr: peer.mmr,
      rankTier: getTaskRankTier(peer.mmr),
      studyLanguage: peer.studyLanguage || 'ja',
      cardsCount: peer._count.japaneseCards,
      resourcesCount: peer._count.resources,
    });

    const friends = rows
      .filter((r) => r.status === 'ACCEPTED')
      .map((r) =>
        mapPeer(
          r.id,
          r.requesterId === userId ? r.addressee : r.requester,
        ),
      )
      .sort((a, b) => b.mmr - a.mmr);

    const incoming = rows
      .filter((r) => r.status === 'PENDING' && r.addresseeId === userId)
      .map((r) => mapPeer(r.id, r.requester));

    const outgoing = rows
      .filter((r) => r.status === 'PENDING' && r.requesterId === userId)
      .map((r) => mapPeer(r.id, r.addressee));

    return { friends, incoming, outgoing };
  }

  async sendFriendRequest(userId: string, targetNickname: string) {
    const clean = sanitizeNickname(targetNickname);
    if (!clean) {
      throw new BadRequestException('Укажите никнейм пользователя');
    }

    await this.syncUninitializedUsers();

    const target = await this.prisma.user.findFirst({
      where: { nickname: { equals: clean, mode: 'insensitive' } },
      select: { id: true, nickname: true },
    });
    if (!target) {
      throw new NotFoundException(`Пользователь с никнеймом «${clean}» не найден`);
    }
    if (target.id === userId) {
      throw new BadRequestException('Нельзя добавить самого себя в друзья');
    }

    const existing = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: target.id },
          { requesterId: target.id, addresseeId: userId },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        throw new ConflictException(`Вы уже дружите с ${target.nickname}`);
      }
      if (existing.requesterId === target.id) {
        const updated = await this.prisma.friendship.update({
          where: { id: existing.id },
          data: { status: 'ACCEPTED' },
        });
        return {
          status: 'ACCEPTED',
          friendshipId: updated.id,
          message: `Вы и ${target.nickname} теперь друзья!`,
        };
      }
      throw new ConflictException(`Заявка для ${target.nickname} уже отправлена`);
    }

    const created = await this.prisma.friendship.create({
      data: {
        requesterId: userId,
        addresseeId: target.id,
        status: 'PENDING',
      },
    });

    return {
      status: 'PENDING',
      friendshipId: created.id,
      message: `Заявка в друзья отправлена пользователю ${target.nickname}`,
    };
  }

  async respondFriendRequest(
    userId: string,
    friendshipId: string,
    accept: boolean,
  ) {
    const reqRow = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (!reqRow) throw new NotFoundException('Заявка не найдена');
    if (reqRow.addresseeId !== userId) {
      throw new ForbiddenException('Вы не можете ответить на чужую заявку');
    }

    if (accept) {
      await this.prisma.friendship.update({
        where: { id: friendshipId },
        data: { status: 'ACCEPTED' },
      });
      return { success: true, status: 'ACCEPTED' };
    }

    await this.prisma.friendship.delete({ where: { id: friendshipId } });
    return { success: true, status: 'DECLINED' };
  }

  async removeFriendship(userId: string, friendshipId: string) {
    const row = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (!row) throw new NotFoundException('Связь не найдена');
    if (row.requesterId !== userId && row.addresseeId !== userId) {
      throw new ForbiddenException('Нет доступа к этой записи');
    }
    await this.prisma.friendship.delete({ where: { id: friendshipId } });
    return { success: true };
  }

  // ───────── ПУБЛИЧНЫЕ ССЫЛКИ НА НАБОРЫ (SHARE DECK) ─────────

  async createSharedDeck(
    userId: string,
    body: {
      title: string;
      description?: string;
      language?: string;
      levelFilter?: string;
      includePassages?: boolean;
    },
  ) {
    const ready = await this.ensureUserProfileReady(userId);
    if (!ready) throw new NotFoundException('Пользователь не найден');

    const title = (body.title || '').trim();
    if (!title) {
      throw new BadRequestException('Укажите название публичного набора');
    }

    const lang =
      body.language === 'en' || body.language === 'de' ? body.language : 'ja';
    const levelFilter = (body.levelFilter || 'ALL').toUpperCase();
    const defaultLvl = lang === 'ja' ? 'N5' : 'A1';

    const allCards = await this.prisma.japaneseCard.findMany({
      where: { userId, language: lang },
      orderBy: { createdAt: 'desc' },
      select: {
        word: true,
        reading: true,
        meaning: true,
        example: true,
        type: true,
        studyLevel: true,
      },
    });

    const scopedCards = allCards.filter((c) => {
      if (levelFilter === 'ALL') return true;
      return (c.studyLevel || defaultLvl) === levelFilter;
    });

    let scopedPassages: Array<{
      language: string;
      kind: string;
      level: string;
      title: string;
      content: string;
      translation: string;
      notes: string | null;
    }> = [];

    if (body.includePassages) {
      const passages = await this.prisma.studyPassage.findMany({
        where: { userId, language: lang },
        orderBy: { createdAt: 'desc' },
        select: {
          language: true,
          kind: true,
          level: true,
          title: true,
          content: true,
          translation: true,
          notes: true,
        },
      });
      scopedPassages = passages.filter(
        (p) => levelFilter === 'ALL' || p.level === levelFilter,
      );
    }

    if (scopedCards.length === 0 && scopedPassages.length === 0) {
      throw new BadRequestException(
        'В выбранном фильтре нет ни одной карточки или текста для публикации',
      );
    }

    const slug = `${lang}-${crypto.randomBytes(3).toString('hex')}`;

    const created = await this.prisma.sharedDeck.create({
      data: {
        slug,
        title: title.slice(0, 120),
        description: body.description?.trim().slice(0, 400) || null,
        language: lang,
        levelFilter,
        cards: scopedCards,
        passages: scopedPassages,
        authorId: userId,
      },
    });

    return {
      ...created,
      cardsCount: scopedCards.length,
      passagesCount: scopedPassages.length,
      authorNickname: ready.nickname,
    };
  }

  async listMySharedDecks(userId: string) {
    const decks = await this.prisma.sharedDeck.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return decks.map((d) => ({
      id: d.id,
      slug: d.slug,
      title: d.title,
      description: d.description,
      language: d.language,
      levelFilter: d.levelFilter,
      importCount: d.importCount,
      createdAt: d.createdAt,
      cardsCount: Array.isArray(d.cards) ? d.cards.length : 0,
      passagesCount: Array.isArray(d.passages) ? d.passages.length : 0,
    }));
  }

  async deleteSharedDeck(userId: string, deckId: string) {
    const res = await this.prisma.sharedDeck.deleteMany({
      where: { id: deckId, authorId: userId },
    });
    if (res.count === 0) {
      throw new NotFoundException('Набор не найден');
    }
    return { success: true };
  }

  async getPublicSharedDeck(slug: string) {
    const deck = await this.prisma.sharedDeck.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, nickname: true, mmr: true },
        },
      },
    });
    if (!deck) {
      throw new NotFoundException('Публичный набор не найден или был удалён');
    }

    if (!deck.author.nickname) {
      await this.ensureUserProfileReady(deck.author.id);
    }

    return {
      slug: deck.slug,
      title: deck.title,
      description: deck.description,
      language: deck.language,
      levelFilter: deck.levelFilter,
      importCount: deck.importCount,
      createdAt: deck.createdAt,
      authorNickname: deck.author.nickname || 'KAVAULT Learner',
      authorRankTier: getTaskRankTier(deck.author.mmr),
      cards: Array.isArray(deck.cards) ? deck.cards : [],
      passages: Array.isArray(deck.passages) ? deck.passages : [],
    };
  }

  async importPublicSharedDeck(userId: string, slug: string) {
    const deck = await this.prisma.sharedDeck.findUnique({
      where: { slug },
    });
    if (!deck) {
      throw new NotFoundException('Публичный набор не найден');
    }

    const cardsList = Array.isArray(deck.cards)
      ? (deck.cards as Array<{
          word: string;
          reading?: string | null;
          meaning: string;
          example?: string | null;
          type?: string;
          studyLevel?: string | null;
        }>)
      : [];

    const passagesList = Array.isArray(deck.passages)
      ? (deck.passages as Array<{
          language?: string;
          kind?: string;
          level?: string;
          title: string;
          content: string;
          translation: string;
          notes?: string | null;
        }>)
      : [];

    let importedCards = 0;
    if (cardsList.length > 0) {
      const existing = await this.prisma.japaneseCard.findMany({
        where: {
          userId,
          language: deck.language,
          word: { in: cardsList.map((c) => c.word) },
        },
        select: { word: true },
      });
      const existingSet = new Set(existing.map((e) => e.word));
      const newCards = cardsList
        .filter((c) => c.word && c.meaning && !existingSet.has(c.word))
        .map((c) => ({
          word: c.word,
          reading: c.reading || null,
          meaning: c.meaning,
          example: c.example || null,
          type: (c.type as any) || 'VOCABULARY',
          language: deck.language,
          studyLevel: c.studyLevel || (deck.language === 'ja' ? 'N5' : 'A1'),
          userId,
        }));

      if (newCards.length > 0) {
        const res = await this.prisma.japaneseCard.createMany({ data: newCards });
        importedCards = res.count;
      }
    }

    let importedPassages = 0;
    if (passagesList.length > 0) {
      const existingPassages = await this.prisma.studyPassage.findMany({
        where: { userId, language: deck.language },
        select: { title: true },
      });
      const existingTitles = new Set(existingPassages.map((p) => p.title));
      const newPassages = passagesList
        .filter((p) => p.title && p.content && !existingTitles.has(p.title))
        .map((p) => ({
          userId,
          language: deck.language,
          kind: p.kind || 'READING',
          level: p.level || (deck.language === 'ja' ? 'N5' : 'A1'),
          title: p.title,
          content: p.content,
          translation: p.translation || '',
          notes: p.notes || null,
        }));
      if (newPassages.length > 0) {
        const pRes = await this.prisma.studyPassage.createMany({
          data: newPassages,
        });
        importedPassages = pRes.count;
      }
    }

    await this.prisma.sharedDeck.update({
      where: { id: deck.id },
      data: { importCount: { increment: 1 } },
    });

    return {
      success: true,
      importedCards,
      importedPassages,
      totalCardsInDeck: cardsList.length,
      totalPassagesInDeck: passagesList.length,
      language: deck.language,
    };
  }
}
