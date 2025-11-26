import type { TenderStatus } from '../types/tender';

export function formatDateTime(value: string | number | Date): string {
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    // Using ru-RU locale formatting and removing comma for cleaner look
    const formatted = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
    return formatted.replace(',', '');
  } catch {
    return '';
  }
}

export function formatDate(value: string | number | Date): string {
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return '';
  }
}

export function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getStatusMeta(status: TenderStatus): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  switch (status) {
    case 'bidding':
      return {
        label: 'Прием заявок',
        badgeClass:
          'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
        dotClass: 'bg-green-500',
      };
    case 'new':
      return {
        label: 'Новый',
        badgeClass:
          'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
        dotClass: 'bg-blue-500',
      };
    case 'evaluated':
      return {
        label: 'Оценка',
        badgeClass:
          'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
        dotClass: 'bg-yellow-500',
      };
    case 'finished':
      return {
        label: 'Завершен',
        badgeClass:
          'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20',
        dotClass: 'bg-purple-500',
      };
    case 'cancelled':
      return {
        label: 'Отменен',
        badgeClass:
          'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
        dotClass: 'bg-red-500',
      };
    default:
      return {
        label: String(status),
        badgeClass: 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20',
        dotClass: 'bg-gray-400',
      };
  }
}
