import { IsDateString, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class UpdateJournalEntryDto {
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  workTypeId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  volume?: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  executorName?: string;
}
