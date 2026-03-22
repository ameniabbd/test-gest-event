export function formatDate(isoDate?: string) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  return new Intl.DateTimeFormat('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'}).format(d);
}