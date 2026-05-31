import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { WorkTypesModule } from './work-types/work-types.module';

@Module({
  imports: [DatabaseModule, WorkTypesModule, JournalEntriesModule],
})
export class AppModule {}
