import { Module } from '@nestjs/common';
import { JapaneseService } from './japanese.service';
import { JapaneseController } from './japanese.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [JapaneseController],
  providers: [JapaneseService, PrismaService],
})
export class JapaneseModule {}
