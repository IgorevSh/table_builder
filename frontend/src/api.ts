import type { JournalEntry, JournalEntryInput, JournalQuery, WorkType } from './types';

const API_BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      Array.isArray(body.message)
        ? body.message.join(', ')
        : body.message ?? `Ошибка ${res.status}`;
    throw new Error(message);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export const api = {
  getWorkTypes: () => request<WorkType[]>('/work-types'),

  getEntries: (query: JournalQuery = {}) => {
    const params = new URLSearchParams();
    if (query.dateFrom) params.set('dateFrom', query.dateFrom);
    if (query.dateTo) params.set('dateTo', query.dateTo);
    if (query.sort) params.set('sort', query.sort);
    const qs = params.toString();
    return request<JournalEntry[]>(`/journal-entries${qs ? `?${qs}` : ''}`);
  },

  createEntry: (data: JournalEntryInput) =>
    request<JournalEntry>('/journal-entries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEntry: (id: number, data: Partial<JournalEntryInput>) =>
    request<JournalEntry>(`/journal-entries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteEntry: (id: number) =>
    request<{ ok: boolean }>(`/journal-entries/${id}`, { method: 'DELETE' }),
};
