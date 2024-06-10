import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AreasModule } from './areas/areas.module';
import { AnimalsModule } from './animals/animals.module';
import { SpeciesModule } from './species/species.module';
import { CommentsModule } from './comments/comments.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,}),
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
    logging: true
  }), 
  AuthModule, AreasModule, AnimalsModule, SpeciesModule, CommentsModule, MetricsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
