import { Module } from '@nestjs/common';
import { JapaneseService } from './japanese.service';
import { JapaneseController } from './japanese.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SocialModule } from '../social/social.module';

@Module({
  imports: [SocialModule],
  controllers: [JapaneseController],
  providers: [JapaneseService, PrismaService],
  exports: [JapaneseService],
})
export class JapaneseModule {}
