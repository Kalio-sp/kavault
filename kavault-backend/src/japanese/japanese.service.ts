import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocialService } from '../social/social.service';

@Injectable()
export class JapaneseService {
  private readonly ttsCache = new Map<string, Buffer>();

  constructor(
    private prisma: PrismaService,
    private socialService: SocialService,
  ) {}

  async create(
    userId: string,
    data: {
      word: string;
      reading?: string;
      meaning: string;
      example?: string;
      type?: any;
      language?: string;
      studyLevel?: string;
    },
  ) {
    return this.prisma.japaneseCard.create({
      data: {
        word: data.word,
        reading: data.reading,
        meaning: data.meaning,
        example: data.example,
        type: data.type,
        language: data.language || 'ja',
        studyLevel: data.studyLevel,
        userId,
      },
    });
  }

  async createBulk(
    userId: string,
    items: Array<{
      word: string;
      reading?: string;
      meaning: string;
      example?: string;
      type?: any;
      language?: string;
      studyLevel?: string;
    }>,
    language?: string,
  ) {
    if (!items || items.length === 0) return { count: 0 };

    const targetLang = language || items[0]?.language || 'ja';

    // Проверяем слова, которые уже есть у пользователя в выбранном языке, чтобы исключить дубликаты
    const existingCards = await this.prisma.japaneseCard.findMany({
      where: {
        userId,
        language: targetLang,
        word: { in: items.map((i) => i.word) },
      },
      select: { word: true },
    });
    const existingWords = new Set(existingCards.map((c) => c.word));

    const newItems = items.filter((item) => !existingWords.has(item.word));
    if (newItems.length === 0) {
      return { count: 0, message: 'Все слова уже присутствуют в вашем аккаунте' };
    }

    const dataWithUser = newItems.map((item) => ({
      word: item.word,
      reading: item.reading,
      meaning: item.meaning,
      example: item.example,
      type: item.type,
      language: item.language || targetLang,
      studyLevel: item.studyLevel,
      userId,
    }));
    return this.prisma.japaneseCard.createMany({
      data: dataWithUser,
    });
  }

  async findAll(userId: string, language?: string, level?: string) {
    return this.prisma.japaneseCard.findMany({
      where: {
        userId,
        ...(language ? { language } : {}),
        ...(level && level !== 'ALL' ? { studyLevel: level } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Метод обработки интервального повторения (+ начисление MMR в Task-System)
  async processReview(id: string, isCorrect: boolean, userId?: string) {
    const card = await this.prisma.japaneseCard.findUnique({ where: { id } });
    if (!card) throw new Error('Card not found');
    if (userId && card.userId !== userId) {
      throw new ForbiddenException('Нет доступа к карточке');
    }

    let newLevel = card.level;
    if (isCorrect) {
      newLevel += 1;
    } else {
      newLevel = Math.max(0, newLevel - 1);
    }

    const nextReview = new Date();
    const hoursToAdd = Math.pow(2, newLevel) * 12;
    nextReview.setHours(nextReview.getHours() + hoursToAdd);

    const updated = await this.prisma.japaneseCard.update({
      where: { id },
      data: {
        level: newLevel,
        nextReview,
      },
    });

    const today = new Date().toISOString().split('T')[0];
    const delta = isCorrect ? (newLevel >= 2 ? 15 : 8) : 2;
    await this.socialService.recordMmrEvent(card.userId, {
      reason: 'SRS_REVIEW',
      delta,
      actionKey: `srs:${card.id}:${today}`,
      meta: card.word,
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    return this.prisma.japaneseCard.deleteMany({
      where: { id, userId },
    });
  }

  async removeAll(userId: string, section?: string, language?: string) {
    const baseWhere = { userId, ...(language ? { language } : {}) };

    if (section === 'KANA') {
      const cards = await this.prisma.japaneseCard.findMany({
        where: baseWhere,
      });
      const hasKanji = (str: string) =>
        /[\u4e00-\u9faf\u3400-\u4dbf]/.test(str);
      const targetIds = cards
        .filter(
          (c) =>
            c.type === 'KANA' ||
            (!hasKanji(c.word) && c.type !== 'KANJI'),
        )
        .map((c) => c.id);
      return this.prisma.japaneseCard.deleteMany({
        where: { id: { in: targetIds }, userId },
      });
    }

    if (section === 'KANJI') {
      const cards = await this.prisma.japaneseCard.findMany({
        where: baseWhere,
      });
      const hasKanji = (str: string) =>
        /[\u4e00-\u9faf\u3400-\u4dbf]/.test(str);
      const targetIds = cards
        .filter((c) => c.type === 'KANJI' || hasKanji(c.word))
        .map((c) => c.id);
      return this.prisma.japaneseCard.deleteMany({
        where: { id: { in: targetIds }, userId },
      });
    }

    if (section === 'VOCABULARY' || section === 'GRAMMAR') {
      return this.prisma.japaneseCard.deleteMany({
        where: { ...baseWhere, type: section as any },
      });
    }

    return this.prisma.japaneseCard.deleteMany({
      where: baseWhere,
    });
  }

  async listPassages(userId: string, language?: string, kind?: string) {
    return this.prisma.studyPassage.findMany({
      where: {
        userId,
        ...(language ? { language } : {}),
        ...(kind ? { kind } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPassage(
    userId: string,
    data: {
      language?: string;
      kind?: string;
      level?: string;
      title: string;
      content: string;
      translation: string;
      notes?: string;
    },
  ) {
    const created = await this.prisma.studyPassage.create({
      data: {
        userId,
        language: data.language || 'ja',
        kind: data.kind || 'READING',
        level: data.level || 'A1',
        title: data.title,
        content: data.content,
        translation: data.translation,
        notes: data.notes,
      },
    });

    await this.socialService.recordMmrEvent(userId, {
      reason: 'PASSAGE_ADD',
      delta: 20,
      actionKey: `passage:${created.id}`,
      meta: created.title,
    });

    return created;
  }

  async removePassage(id: string, userId: string) {
    return this.prisma.studyPassage.deleteMany({
      where: { id, userId },
    });
  }

  private normalizeTtsLang(lang?: string): string {
    const clean = (lang || 'ja').trim().toLowerCase();
    if (clean.startsWith('ja')) return 'ja';
    if (clean === 'en-gb' || clean === 'en_gb') return 'en-GB';
    if (clean.startsWith('en')) return 'en';
    if (clean.startsWith('de')) return 'de';
    return 'ja';
  }

  private splitTtsChunks(text: string, maxLen = 170): string[] {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxLen) return [normalized];

    const chunks: string[] = [];
    let rest = normalized;
    while (rest.length > 0) {
      if (rest.length <= maxLen) {
        chunks.push(rest);
        break;
      }
      const slice = rest.slice(0, maxLen);
      let cut = Math.max(
        slice.lastIndexOf('。'),
        slice.lastIndexOf('. '),
        slice.lastIndexOf('! '),
        slice.lastIndexOf('? '),
        slice.lastIndexOf('、'),
        slice.lastIndexOf(', '),
        slice.lastIndexOf(' '),
      );
      if (cut < Math.floor(maxLen * 0.4)) cut = maxLen;
      else cut += 1;
      chunks.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    return chunks.filter(Boolean);
  }

  private async fetchSingleTtsChunk(chunk: string, tl: string): Promise<Buffer> {
    const q = encodeURIComponent(chunk);
    const endpoints = [
      `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${tl}&q=${q}`,
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${tl}&q=${q}`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            Referer: 'https://translate.google.com/',
          },
        });
        if (res.ok) {
          const arr = await res.arrayBuffer();
          if (arr.byteLength > 200) {
            return Buffer.from(arr);
          }
        }
      } catch {
        // пробовать резервный URL
      }
    }
    throw new ServiceUnavailableException('TTS service unavailable');
  }

  getTtsCacheStats() {
    let totalBytes = 0;
    this.ttsCache.forEach((buf) => {
      totalBytes += buf.byteLength;
    });
    return {
      entries: this.ttsCache.size,
      bytes: totalBytes,
    };
  }

  clearTtsCache() {
    const cleared = this.ttsCache.size;
    this.ttsCache.clear();
    return { cleared };
  }

  async getSpeechAudio(text: string, lang?: string): Promise<Buffer> {
    const cleanText = (text || '').trim();
    if (!cleanText) {
      throw new BadRequestException('Text is required');
    }
    if (cleanText.length > 1500) {
      throw new BadRequestException('Text is too long (max 1500 chars)');
    }

    const tl = this.normalizeTtsLang(lang);
    const cacheKey = `${tl}::${cleanText}`;
    const cached = this.ttsCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const chunks = this.splitTtsChunks(cleanText, 170);
    const buffers = await Promise.all(
      chunks.map((c) => this.fetchSingleTtsChunk(c, tl)),
    );
    const combined = Buffer.concat(buffers);

    if (this.ttsCache.size >= 400) {
      const oldestKey = this.ttsCache.keys().next().value;
      if (oldestKey) this.ttsCache.delete(oldestKey);
    }
    this.ttsCache.set(cacheKey, combined);

    return combined;
  }
}
