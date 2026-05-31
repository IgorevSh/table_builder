import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JournalEntry } from '../entities/journal-entry.entity';
import { WorkType } from '../entities/work-type.entity';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'journal',
    password: process.env.DB_PASSWORD ?? 'journal',
    database: process.env.DB_NAME ?? 'journal',
    entities: [WorkType, JournalEntry],
    synchronize: process.env.NODE_ENV !== 'production',
  };
}
