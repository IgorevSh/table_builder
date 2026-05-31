import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { normalizeVolume } from '../common/volume.util';
import { JournalEntry } from '../entities/journal-entry.entity';
import { WorkType } from '../entities/work-type.entity';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { QueryJournalEntriesDto } from './dto/query-journal-entries.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';

@Injectable()
export class JournalEntriesService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly entryRepo: Repository<JournalEntry>,
    @InjectRepository(WorkType)
    private readonly workTypeRepo: Repository<WorkType>,
  ) {}

  findAll(query: QueryJournalEntriesDto) {
    const qb = this.entryRepo
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.workType', 'workType')
      .orderBy(
        'entry.completedAt',
        (query.sort ?? 'desc').toUpperCase() as 'ASC' | 'DESC',
      );

    if (query.dateFrom) {
      qb.andWhere('entry.completedAt >= :dateFrom', {
        dateFrom: query.dateFrom,
      });
    }
    if (query.dateTo) {
      qb.andWhere('entry.completedAt <= :dateTo', { dateTo: query.dateTo });
    }

    return qb.getMany();
  }

  async findOne(id: number) {
    const entry = await this.entryRepo.findOne({
      where: { id },
      relations: { workType: true },
    });
    if (!entry) {
      throw new NotFoundException(`Запись #${id} не найдена`);
    }
    return entry;
  }

  async create(dto: CreateJournalEntryDto) {
    await this.ensureWorkTypeExists(dto.workTypeId);
    const entry = this.entryRepo.create({
      completedAt: dto.completedAt,
      workTypeId: dto.workTypeId,
      volume: normalizeVolume(dto.volume),
      executorName: dto.executorName.trim(),
    });
    const saved = await this.entryRepo.save(entry);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateJournalEntryDto) {
    const entry = await this.findOne(id);
    if (dto.workTypeId !== undefined) {
      await this.ensureWorkTypeExists(dto.workTypeId);
    }

    if (dto.completedAt !== undefined) entry.completedAt = dto.completedAt;
    if (dto.workTypeId !== undefined) entry.workTypeId = dto.workTypeId;
    if (dto.volume !== undefined) entry.volume = normalizeVolume(dto.volume);
    if (dto.executorName !== undefined) {
      entry.executorName = dto.executorName.trim();
    }

    await this.entryRepo.save(entry);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.entryRepo.delete(id);
    return { ok: true };
  }

  private async ensureWorkTypeExists(workTypeId: number) {
    const wt = await this.workTypeRepo.findOne({ where: { id: workTypeId } });
    if (!wt) {
      throw new NotFoundException(`Вид работ #${workTypeId} не найден`);
    }
  }
}
