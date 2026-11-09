import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ResourcesModule } from './resources/resources.module';
import { JapaneseModule } from './japanese/japanese.module';
import { StatsModule } from './stats/stats.module';
import { AdminModule } from './admin/admin.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    AuthModule,
    ResourcesModule,
    JapaneseModule,
    StatsModule,
    AdminModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
