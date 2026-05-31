import { useEffect, useMemo, useState } from 'react';
import type { JournalEntry } from '../types';
import { formatDate, formatVolume } from '../utils';

const PAGE_SIZE = 10;

type SortKey = 'completedAt' | 'workType' | 'volume' | 'executorName';
type SortDir = 'asc' | 'desc';

interface JournalTableProps {
  entries: JournalEntry[];
  hasDateFilter: boolean;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entry: JournalEntry) => void;
}

function compareEntries(
  a: JournalEntry,
  b: JournalEntry,
  key: SortKey,
  dir: SortDir,
): number {
  let cmp = 0;
  switch (key) {
    case 'completedAt':
      cmp = a.completedAt.localeCompare(b.completedAt);
      break;
    case 'workType':
      cmp = a.workType.name.localeCompare(b.workType.name, 'ru');
      break;
    case 'volume':
      cmp = a.volume - b.volume;
      break;
    case 'executorName':
      cmp = a.executorName.localeCompare(b.executorName, 'ru');
      break;
  }
  return dir === 'asc' ? cmp : -cmp;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="sort-icon sort-icon-idle">↕</span>;
  return <span className="sort-icon">{dir === 'asc' ? '↑' : '↓'}</span>;
}

export function JournalTable({
  entries,
  hasDateFilter,
  onEdit,
  onDelete,
}: JournalTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('completedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [entries]);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => compareEntries(a, b, sortKey, sortDir)),
    [entries, sortKey, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageEntries = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, safePage]);

  function toggleSort(key: SortKey) {
    setPage(1);
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'completedAt' ? 'desc' : 'asc');
    }
  }

  if (entries.length === 0) {
    return (
      <p className="empty-state">
        {hasDateFilter
          ? 'По указанным датам записей нет. Попробуйте изменить фильтр.'
          : 'Записей пока нет. Добавьте первую запись о выполненных работах.'}
      </p>
    );
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: 'completedAt', label: 'Дата' },
    { key: 'workType', label: 'Вид работ' },
    { key: 'volume', label: 'Объём' },
    { key: 'executorName', label: 'Исполнитель' },
  ];

  return (
    <>
      <div className="table-wrap">
        <table className="journal-table">
          <thead>
            <tr>
              {columns.map(({ key, label }) => (
                <th key={key}>
                  <button
                    type="button"
                    className="th-sort"
                    onClick={() => toggleSort(key)}
                  >
                    {label}
                    <SortIcon active={sortKey === key} dir={sortDir} />
                  </button>
                </th>
              ))}
              <th aria-label="Действия" />
            </tr>
          </thead>
          <tbody>
            {pageEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{formatDate(entry.completedAt)}</td>
                <td>{entry.workType.name}</td>
                <td>{formatVolume(entry.volume, entry.workType.unit)}</td>
                <td>{entry.executorName}</td>
                <td className="actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => onEdit(entry)}
                    title="Редактировать"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Изменить</title><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" /></svg>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => onDelete(entry)}
                    title="Удалить"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Удалить</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length > PAGE_SIZE && (
        <div className="pagination">
          <span className="pagination-info">
            {sorted.length} записей · стр. {safePage} из {totalPages}
          </span>
          <div className="pagination-controls">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Назад
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Вперёд
            </button>
          </div>
        </div>
      )}
    </>
  );
}
