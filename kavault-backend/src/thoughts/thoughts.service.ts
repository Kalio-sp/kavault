import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocialService } from '../social/social.service';

export interface ThoughtPreferences {
  canvasStyle: 'minimal' | 'paper' | 'grid' | 'midnight' | 'vibe';
  layoutMode: 'masonry' | 'journal' | 'compact';
  fontStyle: 'sans' | 'serif' | 'mono';
  cardStyle: 'glass' | 'paper' | 'sharp';
  defaultColor: 'default' | 'amber' | 'blue' | 'emerald' | 'rose' | 'violet';
  showMoodBadge: boolean;
}

const DEFAULT_PREFS: ThoughtPreferences = {
  canvasStyle: 'vibe',
  layoutMode: 'masonry',
  fontStyle: 'sans',
  cardStyle: 'glass',
  defaultColor: 'default',
  showMoodBadge: true,
};

const VALID_CANVAS = new Set(['minimal', 'paper', 'grid', 'midnight', 'vibe']);
const VALID_LAYOUT = new Set(['masonry', 'journal', 'compact']);
const VALID_FONT = new Set(['sans', 'serif', 'mono']);
const VALID_CARD = new Set(['glass', 'paper', 'sharp']);
const VALID_COLOR = new Set(['default', 'amber', 'blue', 'emerald', 'rose', 'violet']);

@Injectable()
export class ThoughtsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socialService: SocialService,
  ) {}

  private normalizePrefs(raw: any): ThoughtPreferences {
    const src = raw && typeof raw === 'object' ? raw : {};
    return {
      canvasStyle: VALID_CANVAS.has(src.canvasStyle)
        ? src.canvasStyle
        : DEFAULT_PREFS.canvasStyle,
      layoutMode: VALID_LAYOUT.has(src.layoutMode)
        ? src.layoutMode
        : DEFAULT_PREFS.layoutMode,
      fontStyle: VALID_FONT.has(src.fontStyle)
        ? src.fontStyle
        : DEFAULT_PREFS.fontStyle,
      cardStyle: VALID_CARD.has(src.cardStyle)
        ? src.cardStyle
        : DEFAULT_PREFS.cardStyle,
      defaultColor: VALID_COLOR.has(src.defaultColor)
        ? src.defaultColor
        : DEFAULT_PREFS.defaultColor,
      showMoodBadge:
        typeof src.showMoodBadge === 'boolean'
          ? src.showMoodBadge
          : DEFAULT_PREFS.showMoodBadge,
    };
  }

  async listAll(userId: string) {
    const [items, user] = await Promise.all([
      this.prisma.thoughtNote.findMany({
        where: { userId },
        orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { thoughtPreferences: true },
      }),
    ]);

    return {
      items,
      preferences: this.normalizePrefs(user?.thoughtPreferences),
    };
  }

  async updatePreferences(
    userId: string,
    patch: Partial<ThoughtPreferences>,
  ): Promise<ThoughtPreferences> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { thoughtPreferences: true },
    });
    const merged = this.normalizePrefs({
      ...(user?.thoughtPreferences as Record<string, unknown> | null),
      ...patch,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { thoughtPreferences: merged as any },
    });

    return merged;
  }

  async create(
    userId: string,
    body: {
      title?: string;
      content: string;
      mood?: string;
      colorTag?: string;
      tags?: string[];
      isPinned?: boolean;
    },
  ) {
    const content = (body.content || '').trim();
    if (!content) {
      throw new BadRequestException('Текст мысли не может быть пустым');
    }

    const cleanTags = Array.isArray(body.tags)
      ? body.tags
          .map((t) => String(t).replace(/^#/, '').trim().toLowerCase())
          .filter((t, i, a) => t.length > 0 && a.indexOf(t) === i)
          .slice(0, 8)
      : [];

    const created = await this.prisma.thoughtNote.create({
      data: {
        userId,
        title: body.title?.trim().slice(0, 140) || null,
        content,
        mood: body.mood?.trim().slice(0, 12) || '💡',
        colorTag: VALID_COLOR.has(body.colorTag || '') ? body.colorTag! : 'default',
        tags: cleanTags,
        isPinned: Boolean(body.isPinned),
      },
    });

    // Начисляем небольшой MMR за осмысленную заметку (до 5 заметок в день для честности рейтинга)
    if (content.length >= 15) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayThoughtAwards = await this.prisma.mmrLog.count({
        where: {
          userId,
          reason: 'THOUGHT_JOURNAL',
          createdAt: { gte: todayStart },
        },
      });
      if (todayThoughtAwards < 5) {
        await this.socialService.recordMmrEvent(userId, {
          reason: 'THOUGHT_JOURNAL',
          delta: 8,
          actionKey: `thought:${created.id}`,
          meta: created.title || content.slice(0, 40),
        });
      }
    }

    return created;
  }

  async update(
    userId: string,
    id: string,
    body: {
      title?: string | null;
      content?: string;
      mood?: string | null;
      colorTag?: string;
      tags?: string[];
      isPinned?: boolean;
      isArchived?: boolean;
    },
  ) {
    const existing = await this.prisma.thoughtNote.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new NotFoundException('Запись не найдена');

    const data: Record<string, any> = {};
    if (body.title !== undefined) {
      data.title = body.title ? body.title.trim().slice(0, 140) : null;
    }
    if (body.content !== undefined) {
      const clean = body.content.trim();
      if (!clean) throw new BadRequestException('Текст не может быть пустым');
      data.content = clean;
    }
    if (body.mood !== undefined) {
      data.mood = body.mood ? body.mood.trim().slice(0, 12) : null;
    }
    if (body.colorTag !== undefined && VALID_COLOR.has(body.colorTag)) {
      data.colorTag = body.colorTag;
    }
    if (body.tags !== undefined && Array.isArray(body.tags)) {
      data.tags = body.tags
        .map((t) => String(t).replace(/^#/, '').trim().toLowerCase())
        .filter((t, i, a) => t.length > 0 && a.indexOf(t) === i)
        .slice(0, 8);
    }
    if (typeof body.isPinned === 'boolean') data.isPinned = body.isPinned;
    if (typeof body.isArchived === 'boolean') data.isArchived = body.isArchived;

    return this.prisma.thoughtNote.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    const res = await this.prisma.thoughtNote.deleteMany({
      where: { id, userId },
    });
    if (res.count === 0) throw new NotFoundException('Запись не найдена');
    return { success: true };
  }
}
