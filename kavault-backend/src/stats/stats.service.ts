import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getTrackerStats(userId: string) {
    const today = new Date();

    // Получаем дату 140 дней назад (ровно 20 недель для сетки 20x7)
    const past140Days = new Date();
    past140Days.setDate(today.getDate() - 139);
    past140Days.setHours(0, 0, 0, 0);

    // Ищем все созданные ресурсы за это время
    const resources = await this.prisma.resource.findMany({
      where: { userId, createdAt: { gte: past140Days } },
      select: { createdAt: true },
    });

    // Ищем все карточки, которые добавлялись или повторялись
    const cards = await this.prisma.japaneseCard.findMany({
      where: { userId, updatedAt: { gte: past140Days } },
      select: { updatedAt: true },
    });

    // Группируем активность по датам (YYYY-MM-DD -> количество действий)
    const activityMap = new Map<string, number>();

    const addDate = (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
    };

    resources.forEach((r) => addDate(r.createdAt));
    cards.forEach((c) => addDate(c.updatedAt));

    // 1. Формируем массив из 140 элементов для графика
    const heatmap = [];
    for (let i = 139; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = activityMap.get(dateStr) || 0;

      // Конвертируем количество действий в интенсивность цвета (0-3)
      let intensity = 0;
      if (count > 0) intensity = 1;
      if (count > 3) intensity = 2;
      if (count > 7) intensity = 3;

      heatmap.push(intensity);
    }

    // 2. Считаем стрик (дни подряд)
    let currentStreak = 0;
    for (let i = 0; i < 140; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = activityMap.get(dateStr) || 0;

      if (count > 0) {
        currentStreak++;
      } else if (i === 0) {
        // Если сегодня еще ничего не делал, стрик не ломается, проверяем вчерашний день
        continue;
      } else {
        break; // Стрик прервался
      }
    }

    // 3. Считаем недельные цели (с понедельника)
    const startOfWeek = new Date();
    const day = today.getDay() || 7; // Делаем воскресенье 7-м днем
    startOfWeek.setDate(today.getDate() - day + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekResources = await this.prisma.resource.count({
      where: { userId, createdAt: { gte: startOfWeek } },
    });

    const weekCards = await this.prisma.japaneseCard.count({
      where: { userId, updatedAt: { gte: startOfWeek } },
    });

    return {
      heatmap,
      currentStreak,
      goals: {
        resources: weekResources,
        cards: weekCards,
      },
    };
  }
}
