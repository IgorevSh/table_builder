import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkType } from './work-type.entity';

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: 'date' })
  completedAt!: string;

  @Column({ type: 'float' })
  volume!: number;

  @Column()
  executorName!: string;

  @Column()
  workTypeId!: number;

  @ManyToOne(() => WorkType, (workType) => workType.entries, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'workTypeId' })
  workType!: WorkType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
