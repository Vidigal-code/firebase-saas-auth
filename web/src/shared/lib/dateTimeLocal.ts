const TWO_DIGITS = 2;
const MONTH_INDEX_OFFSET = 1;

const pad = (value: number): string => String(value).padStart(TWO_DIGITS, '0');

const DATE_TIME_LOCAL_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

export const toDateTimeLocalValue = (date: Date): string => {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + MONTH_INDEX_OFFSET)}-${pad(date.getDate())}`;
  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// datetime-local values carry no timezone: they are interpreted in the browser's local time.
export const parseDateTimeLocal = (value: string): Date | null => {
  const match = DATE_TIME_LOCAL_PATTERN.exec(value);
  if (!match) return null;

  const [year, month, day, hours, minutes] = match.slice(1).map(Number);
  const date = new Date(year, month - MONTH_INDEX_OFFSET, day, hours, minutes);
  const isSameMoment = toDateTimeLocalValue(date) === value;
  return isSameMoment ? date : null;
};
