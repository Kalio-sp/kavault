import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JapaneseService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    data: {
      word: string;
      reading?: string;
      meaning: string;
      example?: string;
      type?: any;
      language?: string;
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
      userId,
    }));
    return this.prisma.japaneseCard.createMany({
      data: dataWithUser,
    });
  }

  async findAll(userId: string, language?: string) {
    return this.prisma.japaneseCard.findMany({
      where: {
        userId,
        ...(language ? { language } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Метод обработки интервального повторения
  async processReview(id: string, isCorrect: boolean) {
    const card = await this.prisma.japaneseCard.findUnique({ where: { id } });
    if (!card) throw new Error('Card not found');

    let newLevel = card.level;
    if (isCorrect) {
      newLevel += 1;
    } else {
      newLevel = Math.max(0, newLevel - 1);
    }

    const nextReview = new Date();
    const hoursToAdd = Math.pow(2, newLevel) * 12;
    nextReview.setHours(nextReview.getHours() + hoursToAdd);

    return this.prisma.japaneseCard.update({
      where: { id },
      data: {
        level: newLevel,
        nextReview,
      },
    });
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
    return this.prisma.studyPassage.create({
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
  }

  async removePassage(id: string, userId: string) {
    return this.prisma.studyPassage.deleteMany({
      where: { id, userId },
    });
  }
}
