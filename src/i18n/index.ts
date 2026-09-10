import { he, type MessageKey } from './he';

const catalogs: Record<string, Partial<Record<MessageKey, string>>> = { he };

let current = 'he';

export function setLocale(locale: string): void {
  current = catalogs[locale] ? locale : 'he';
}

export function t(key: MessageKey, vars?: Record<string, string | number>): string {
  const template = catalogs[current]?.[key] ?? he[key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export type { MessageKey };
