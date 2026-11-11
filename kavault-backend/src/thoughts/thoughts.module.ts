import { Module } from '@nestjs/common';
import { ThoughtsController } from './thoughts.controller';
import { ThoughtsService } from './thoughts.service';
import { PrismaService } from '../prisma/prisma.service';
import { SocialModule } from '../social/social.module';

@Module({
  imports: [SocialModule],
  controllers: [ThoughtsController],
  providers: [ThoughtsService, PrismaService],
})
export class ThoughtsModule {}
