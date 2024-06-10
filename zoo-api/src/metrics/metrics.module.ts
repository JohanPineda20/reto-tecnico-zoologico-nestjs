import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { AreasModule } from 'src/areas/areas.module';
import { SpeciesModule } from 'src/species/species.module';
import { CommentsModule } from 'src/comments/comments.module';
import { AnimalsModule } from 'src/animals/animals.module';

@Module({
  imports: [AuthModule, UsersModule, AreasModule, SpeciesModule, CommentsModule, AnimalsModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
