
export function timeAgo(date: string | Date): string {
  if (!date) return 'неизвестно';

  // TODO: верное отображение даты
  const now = Date.now();
  const past = new Date(date).getTime();
  const diffMs = now - past;

  if (diffMs < 0) return 'в будущем';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const rtf = new Intl.RelativeTimeFormat('ru', {
    numeric: 'auto',           // "вчера", "сегодня", "1 день назад"
    style: 'short',            // короткий стиль: "1 д. назад"
  });

  if (seconds < 45)   return rtf.format(-seconds, 'second');
  if (minutes < 45)   return rtf.format(-minutes, 'minute');
  if (hours < 24)     return rtf.format(-hours,   'hour');
  if (days < 7)       return rtf.format(-days,    'day');
  if (weeks < 4)      return rtf.format(-weeks,   'week');
  if (months < 12)    return rtf.format(-months,  'month');

  return rtf.format(-years, 'year');
}

export function formatBirthDate(dateStr: string | Date): string {
  if (!dateStr) return '';

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}