export default function toTimeString(totalSeconds: number): string {
  let totalSeconds2 = totalSeconds;
  const hours = Math.floor(totalSeconds2 / 3600);
  totalSeconds2 %= 3600;
  const minutes = Math.floor(totalSeconds2 / 60);
  const seconds = totalSeconds2 % 60;
  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? `0${v}` : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
}
