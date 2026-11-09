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
    const dataWithUser = items.map((item) => ({
      ...item,
      userId,
    }));
    return this.prisma.resource.createMany({
      data: dataWithUser,
      skipDuplicates: true,
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
