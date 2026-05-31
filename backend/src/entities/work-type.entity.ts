import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JournalEntry } from './journal-entry.entity';

@Entity('work_types')
export class WorkType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  unit!: string;

  @OneToMany(() => JournalEntry, (entry) => entry.workType)
  entries!: JournalEntry[];
}
