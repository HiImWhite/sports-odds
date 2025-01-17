export default function getFormattedDay(): string {
  const today = new Date().toISOString().slice(5, 10);
  const [month, day] = today.split('-');
  return `${day}-${month}`;
}
