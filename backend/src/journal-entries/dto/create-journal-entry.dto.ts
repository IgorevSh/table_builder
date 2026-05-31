import { IsDateString, IsInt, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateJournalEntryDto {
  @IsDateString()
  completedAt!: string;

  @IsInt()
  @IsPositive()
  workTypeId!: number;

  @IsNumber()
  @IsPositive()
  volume!: number;

  @IsString()
  @MinLength(2)
  executorName!: string;
}
