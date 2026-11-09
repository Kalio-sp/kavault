import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateResourceDto) {
    return this.prisma.resource.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async createBulk(userId: string, items: CreateResourceDto[]) {
    if (!items || items.length === 0) return { count: 0 };

    // Проверяем материалы по ссылкам, чтобы исключить дублирование стартовых наборов
    const existingResources = await this.prisma.resource.findMany({
      where: {
        userId,
        url: { in: items.map((i) => i.url) },
      },
      select: { url: true },
    });
    const existingUrls = new Set(existingResources.map((r) => r.url));

    const newItems = items.filter((item) => !existingUrls.has(item.url));
    if (newItems.length === 0) {
      return { count: 0, message: 'Все материалы уже присутствуют в вашем аккаунте' };
    }

    const dataWithUser = newItems.map((item) => ({
      ...item,
      userId,
    }));
    return this.prisma.resource.createMany({
      data: dataWithUser,
    });
  }

  async findAll(userId: string) {
    return this.prisma.resource.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Новые сверху
    });
  }

  async getStats(userId: string) {
    const totalResources = await this.prisma.resource.count({
      where: { userId },
    });
    return { totalResources };
  }

  async updateNote(id: string, note: string) {
    return this.prisma.resource.update({
      where: { id },
      data: { note },
    });
  }

  async updateStatus(id: string, userId: string, status: any) {
    return this.prisma.resource.updateMany({
      where: { id, userId },
      data: { status },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.resource.deleteMany({
      where: { id, userId },
    });
  }

  async removeAll(userId: string, type?: string) {
    if (type === 'REPOSITORY') {
      return this.prisma.resource.deleteMany({
        where: { userId, type: 'REPOSITORY' },
      });
    }
    if (type === 'DEVELOPER') {
      return this.prisma.resource.deleteMany({
        where: {
          userId,
          type: { not: 'REPOSITORY' },
        },
      });
    }
    return this.prisma.resource.deleteMany({
      where: { userId },
    });
  }
}
