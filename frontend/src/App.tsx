import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { EntryDialog } from './components/EntryDialog';
import { JournalTable } from './components/JournalTable';
import type { JournalEntry, JournalEntryInput, JournalQuery, WorkType } from './types';

export default function App() {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | null>(null);

  const buildQuery = useCallback((): JournalQuery => {
    const query: JournalQuery = {};
    if (dateFrom) query.dateFrom = dateFrom;
    if (dateTo) query.dateTo = dateTo;
    return query;
  }, [dateFrom, dateTo]);

  const loadEntries = useCallback(async (query: JournalQuery = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEntries(query);
      setEntries(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить записи');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api
      .getWorkTypes()
      .then(setWorkTypes)
      .catch((e) =>
        setError(e instanceof Error ? e.message : 'Не удалось загрузить список работ'),
      );
  }, []);

  useEffect(() => {
    loadEntries(buildQuery());
  }, [dateFrom, dateTo, loadEntries, buildQuery]);

  function resetFilters() {
    setDateFrom('');
    setDateTo('');
  }

  async function handleSubmit(data: JournalEntryInput) {
    if (editing) {
      await api.updateEntry(editing.id, data);
    } else {
      await api.createEntry(data);
    }
    setDialogOpen(false);
    setEditing(null);
    await loadEntries(buildQuery());
  }

  async function handleDelete(entry: JournalEntry) {
    if (!window.confirm(`Удалить запись "${entry.workType.name}"?`)) return;
    try {
      await api.deleteEntry(entry.id);
      await loadEntries(buildQuery());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка при  удалиении,попробуйте позже');
    }
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(entry: JournalEntry) {
    setEditing(entry);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditing(null);
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Журнал работ</h1>
          <p className="subtitle">Учёт выполненных работ</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + Добавить запись
        </button>
      </header>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
          <button type="button" className="alert-close" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      <section className="filters card">
        <h2>Фильтры</h2>
        <div className="filters-row">
          <label>
            <span>С:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </label>
          <label>
            <span>По:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </label>
          {(dateFrom || dateTo) && (
            <button type="button" className="btn btn-secondary" onClick={resetFilters}>
              Сбросить
            </button>
          )}
        </div>
      </section>

      <section className="card">
        {loading ? (
          <p className="loading">Загрузка…</p>
        ) : (
          <JournalTable
            entries={entries}
            hasDateFilter={Boolean(dateFrom || dateTo)}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      <EntryDialog
        open={dialogOpen}
        workTypes={workTypes}
        initial={editing}
        onSubmit={handleSubmit}
        onClose={closeDialog}
      />
    </div>
  );
}
