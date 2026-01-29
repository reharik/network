/**
 * "Pinned to today" contact IDs stored in sessionStorage, keyed by date.
 * Used when user clicks "Contact Now" from Contacts/ContactDetail so the contact
 * appears on Today without mutating nextDueAt.
 */

const KEY_PREFIX = 'todayPinned_';

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${KEY_PREFIX}${y}-${m}-${day}`;
}

function readIds(): string[] {
  try {
    const raw = sessionStorage.getItem(todayKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]): void {
  sessionStorage.setItem(todayKey(), JSON.stringify(ids));
}

export function getTodayPinnedIds(): string[] {
  return readIds();
}

export function addToTodayPinned(contactId: string): void {
  const ids = readIds();
  if (ids.includes(contactId)) return;
  writeIds([...ids, contactId]);
}

export function removeFromTodayPinned(contactId: string): void {
  const ids = readIds().filter((id) => id !== contactId);
  writeIds(ids);
}
