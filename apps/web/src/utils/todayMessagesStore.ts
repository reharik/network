/**
 * Per-contact custom messages for the Today page, stored in sessionStorage and keyed by date.
 * Persists the message the user typed so it still shows after they mark the contact done.
 */

const KEY_PREFIX = 'todayMessages_';

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${KEY_PREFIX}${y}-${m}-${day}`;
}

function readMessages(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(todayKey());
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed == null || typeof parsed !== 'object') return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof k === 'string' && typeof v === 'string') out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function writeMessages(messages: Record<string, string>): void {
  sessionStorage.setItem(todayKey(), JSON.stringify(messages));
}

export function getTodayCustomMessages(): Record<string, string> {
  return readMessages();
}

export function setTodayCustomMessage(contactId: string, message: string): void {
  const messages = readMessages();
  messages[contactId] = message;
  writeMessages(messages);
}
