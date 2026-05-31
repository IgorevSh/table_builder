export interface WorkType {
  id: number;
  name: string;
  unit: string;
}

export interface JournalEntry {
  id: number;
  completedAt: string;
  volume: number;
  executorName: string;
  workTypeId: number;
  workType: WorkType;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryInput {
  completedAt: string;
  workTypeId: number;
  volume: number;
  executorName: string;
}

export interface JournalQuery {
  dateFrom?: string;
  dateTo?: string;
  sort?: 'asc' | 'desc';
}
