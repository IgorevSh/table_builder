export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function toInputDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Целое число или округление до сотых, если есть дробная часть */
export function normalizeVolume(value: number): number {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? rounded : rounded;
}

export function formatVolume(volume: number, unit: string): string {
  const normalized = normalizeVolume(volume);
  const formatted = Number.isInteger(normalized)
    ? String(normalized)
    : normalized.toFixed(2);
  return `${formatted} ${unit}`;
}

/** Маска ФИО: только буквы (RU/EN), пробел, точка, дефис */
export function maskFio(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Zа-яА-ЯёЁ\s.\-]/g, '');
  return cleaned.replace(/\s{2,}/g, ' ');
}

export function formatVolumeInput(raw: string): string {
  let value = raw.replace(',', '.');
  value = value.replace(/[^\d.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) {
    value = `${parts[0]}.${parts.slice(1).join('')}`;
  }
  if (parts.length === 2 && parts[1].length > 2) {
    value = `${parts[0]}.${parts[1].slice(0, 2)}`;
  }
  return value;
}

export function parseVolume(raw: string): number | null {
  if (!raw.trim()) return null;
  const vol = parseFloat(raw.replace(',', '.'));
  if (Number.isNaN(vol) || vol < 0) return null;
  if (vol === 0) return null;
  return normalizeVolume(vol);
}
