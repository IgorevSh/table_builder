import { FormEvent, useEffect, useState } from 'react';
import type { JournalEntry, JournalEntryInput, WorkType } from '../types';
import { formatVolumeInput, maskFio, parseVolume, toInputDate } from '../utils';

interface EntryFormProps {
  workTypes: WorkType[];
  initial?: JournalEntry | null;
  onSubmit: (data: JournalEntryInput) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
  completedAt: string;
  workTypeId: string;
  volume: string;
  executorName: string;
}

interface FormErrors {
  completedAt?: string;
  workTypeId?: string;
  volume?: string;
  executorName?: string;
}

function emptyForm(): FormState {
  return {
    completedAt: new Date().toISOString().slice(0, 10),
    workTypeId: '',
    volume: '',
    executorName: '',
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.completedAt) errors.completedAt = 'Укажите дату';
  if (!form.workTypeId) errors.workTypeId = 'Выберите вид работ';
  const vol = parseVolume(form.volume);
  if (vol === null) {
    errors.volume = 'Укажите положительный объём (без отрицательных значений)';
  }
  const name = form.executorName.trim();
  if (!name || name.length < 2) {
    errors.executorName = 'Укажите ФИО исполнителя (мин. 2 символа)';
  } else if (!/^[a-zA-Zа-яА-ЯёЁ\s.\-]+$/.test(name)) {
    errors.executorName = 'ФИО может содержать только буквы, пробел, точку и дефис';
  }
  return errors;
}

export function EntryForm({ workTypes, initial, onSubmit }: EntryFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        completedAt: toInputDate(initial.completedAt),
        workTypeId: String(initial.workTypeId),
        volume: String(initial.volume),
        executorName: initial.executorName,
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [initial]);

  const selectedType = workTypes.find((w) => w.id === Number(form.workTypeId));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const volume = parseVolume(form.volume);
    if (volume === null) return;

    setSubmitting(true);
    try {
      await onSubmit({
        completedAt: form.completedAt,
        workTypeId: Number(form.workTypeId),
        volume,
        executorName: form.executorName.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleVolumeBlur() {
    const vol = parseVolume(form.volume);
    if (vol !== null) {
      setForm((f) => ({
        ...f,
        volume: Number.isInteger(vol) ? String(vol) : vol.toFixed(2),
      }));
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <h2 id="dialog-title">{initial ? 'Редактирование записи' : 'Новая запись'}</h2>

      <label>
        Дата выполнения *
        <input
          type="date"
          value={form.completedAt}
          onChange={(e) => setForm({ ...form, completedAt: e.target.value })}
        />
        {errors.completedAt && <span className="error">{errors.completedAt}</span>}
      </label>

      <label>
        Вид работ *
        <select
          value={form.workTypeId}
          onChange={(e) => setForm({ ...form, workTypeId: e.target.value })}
        >
          <option value="">— выберите —</option>
          {workTypes.map((wt) => (
            <option key={wt.id} value={wt.id}>
              {wt.name} ({wt.unit})
            </option>
          ))}
        </select>
        {errors.workTypeId && <span className="error">{errors.workTypeId}</span>}
      </label>

      <label>
        Объём {selectedType ? `(${selectedType.unit})` : ''} *
        <input
          type="text"
          inputMode="decimal"
          placeholder="24"
          value={form.volume}
          onChange={(e) =>
            setForm({ ...form, volume: formatVolumeInput(e.target.value) })
          }
          onBlur={handleVolumeBlur}
        />
        {errors.volume && <span className="error">{errors.volume}</span>}
      </label>

      <label>
        ФИО исполнителя *
        <input
          type="text"
          placeholder="Иванов И.И."
          value={form.executorName}
          onChange={(e) =>
            setForm({ ...form, executorName: maskFio(e.target.value) })
          }
        />
        {errors.executorName && <span className="error">{errors.executorName}</span>}
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Сохранение…' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}
