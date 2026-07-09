const COMPASS_POINTS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
] as const;

export type CompassDirection = (typeof COMPASS_POINTS)[number];

export function degreesToCompass(degrees: number): CompassDirection {
  const index = Math.round(degrees / 22.5) % 16;
  return COMPASS_POINTS[index];
}
