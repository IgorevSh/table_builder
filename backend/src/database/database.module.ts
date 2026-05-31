import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkType } from '../entities/work-type.entity';
import { getDatabaseConfig } from './database.config';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    TypeOrmModule.forFeature([WorkType]),
  ],
  providers: [SeedService],
})
export class DatabaseModule {}
