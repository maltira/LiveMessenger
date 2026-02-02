
export function timeAgo(date: Date | string, now: Date = new Date()): string {
  const input = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(input.getTime())) {
    return "неизвестно";
  }

  const diffMs = now.getTime() - input.getTime();
  if (diffMs < 0) {
    return "только что";
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  // const diffDay = Math.floor(diffHour / 24);

  // До минуты
  if (diffSec < 60) {
    return "только что";
  }

  // До часа — минуты
  if (diffMin < 60) {
    return plural(diffMin, "минуту", "минуты", "минут") + " назад";
  }

  // До 23 часов включительно — часы
  if (diffHour <= 23) {
    return plural(diffHour, "час", "часа", "часов") + " назад";
  }

  // Проверяем, был ли это вчера (00:00 вчера — 23:59 вчера)
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const yesterdayEnd = new Date(todayStart); // 00:00 сегодня = конец вчера

  if (input >= yesterdayStart && input < yesterdayEnd) {
    const timeStr = input.toLocaleTimeString("ru-RU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
    return `вчера в ${timeStr}`;
  }

  // Всё остальное — просто дата дд.мм.гггг
  return formatDate(input);
}

function plural(n: number, one: string, two: string, five: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} ${two}`;
  return `${n} ${five}`;
}

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
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