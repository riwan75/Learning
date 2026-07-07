export type Unit = 'C' | 'F';

export const UNIT_KEY = 'pref:unit';

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function formatTemp(celsius: number, unit: Unit): string {
  if (unit === 'F') {
    return `${Math.round(celsiusToFahrenheit(celsius))}°`;
  }
  return `${Math.round(celsius)}°`;
}
