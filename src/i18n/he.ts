/** Chrome / UI strings only — deck content is authored per-locale in the deck file. */
export const he = {
  'chrome.sceneCounter': '{current} / {total}',
  'chrome.grid.title': 'מפת הסצנות',
  'chrome.grid.open': 'תצוגת רשת (Esc)',
  'chrome.notes.title': 'הערות למנחה',
  'chrome.notes.open': 'הערות למנחה (N)',
  'chrome.notes.empty': 'אין הערות לסצנה זו.',
  'chrome.fullscreen': 'מסך מלא (F)',
  'chrome.prev': 'הקודם',
  'chrome.next': 'הבא',
  'chrome.close': 'סגירה',
  'scene.unavailable': 'הסצנה מסוג "{type}" אינה זמינה.',
  'deeplink.unknown': 'הקישור מפנה לסצנה שלא קיימת — הוחזרת לסצנה הנוכחית.',
} as const;

export type MessageKey = keyof typeof he;
