function leadingZero(x: number): string {
  if (x < 10) {
    return `0${x}`;
  } else {
    return String(x);
  }
}

export function formatTime(ts: number): string {
  const date = new Date(ts * 1000);
  const hours = leadingZero(date.getHours());
  const minutes = leadingZero(date.getMinutes());
  return `${hours}:${minutes}`;
}

export function nowTimestamp(): number {
  return Number(new Date()) / 1000;
}

export function dayStartTimestamp(): number {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return Number(date) / 1000;
}
