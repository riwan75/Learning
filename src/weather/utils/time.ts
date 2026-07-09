const WIB = 'Asia/Jakarta';

export function formatLocalTime(
  iso: string,
  _timezone?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = options ?? {
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleTimeString('en-US', {...opts, timeZone: WIB});
}
