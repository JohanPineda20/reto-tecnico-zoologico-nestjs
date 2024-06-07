import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { Species } from './entities/species.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasModule } from 'src/areas/areas.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Species]), AuthModule, UsersModule, AreasModule],
  controllers: [SpeciesController],
  providers: [SpeciesService],
  exports:[SpeciesService]
})
export class SpeciesModule {}
