import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JapaneseService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    data: { word: string; reading?: string; meaning: string; type?: any },
  ) {
    return this.prisma.japaneseCard.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.japaneseCard.findMany({
      where: { userId },
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

  async removeAll(userId: string, section?: string) {
    if (section === 'KANA') {
      const cards = await this.prisma.japaneseCard.findMany({
        where: { userId },
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
        where: { userId },
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

    return this.prisma.japaneseCard.deleteMany({
      where: { userId },
    });
  }
}
