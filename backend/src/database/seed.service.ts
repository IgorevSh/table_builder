import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkType } from '../entities/work-type.entity';

const WORK_TYPES = [
  { name: 'Кладка перегородок', unit: 'м³' },
  { name: 'Монтаж опалубки', unit: 'м²' },
  { name: 'Армирование фундамента', unit: 'т' },
  { name: 'Бетонирование плиты', unit: 'м³' },
  { name: 'Штукатурные работы', unit: 'м²' },
  { name: 'Монтаж оконных блоков', unit: 'шт' },
  { name: 'Кровельные работы', unit: 'м²' },
  { name: 'Земляные работы', unit: 'м³' },
];

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(WorkType)
    private readonly workTypeRepo: Repository<WorkType>,
  ) {}

  async onModuleInit() {
    for (const wt of WORK_TYPES) {
      const existing = await this.workTypeRepo.findOne({
        where: { name: wt.name },
      });
      if (!existing) {
        await this.workTypeRepo.save(this.workTypeRepo.create(wt));
      }
    }
  }
}
