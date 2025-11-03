export function formatDate(dateString: string | null, withSeconds = false): string {
  if (!dateString) return '不明';
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
  };

  return date.toLocaleString('ja-JP', options);
}