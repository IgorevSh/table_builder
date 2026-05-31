import { useEffect } from 'react';
import { EntryForm } from './EntryForm';
import type { JournalEntry, JournalEntryInput, WorkType } from '../types';

interface EntryDialogProps {
  open: boolean;
  workTypes: WorkType[];
  initial?: JournalEntry | null;
  onSubmit: (data: JournalEntryInput) => Promise<void>;
  onClose: () => void;
}

export function EntryDialog({
  open,
  workTypes,
  initial,
  onSubmit,
  onClose,
}: EntryDialogProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="dialog-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        <EntryForm
          workTypes={workTypes}
          initial={initial}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
