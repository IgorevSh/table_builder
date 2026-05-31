import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkType } from '../entities/work-type.entity';

@Injectable()
export class WorkTypesService {
  constructor(
    @InjectRepository(WorkType)
    private readonly workTypeRepo: Repository<WorkType>,
  ) {}

  findAll() {
    return this.workTypeRepo.find({ order: { name: 'ASC' } });
  }
}
