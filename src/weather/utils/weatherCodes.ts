import type {Icon} from 'iconsax-react-nativejs';
import {
  Sun1,
  Moon,
  CloudSunny,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  InfoCircle,
} from 'iconsax-react-nativejs';
import {
  VAR_CLEAR_PRIMARY,
  VAR_CLEAR_SECONDARY,
  VAR_CLOUDY_PRIMARY,
  VAR_CLOUDY_SECONDARY,
  VAR_RAIN_PRIMARY,
  VAR_RAIN_SECONDARY,
  VAR_SNOW_PRIMARY,
  VAR_SNOW_SECONDARY,
} from '../../styles/Color';

export interface WeatherInfo {
  label: string;
  icon: Icon;
}

export type WeatherVariant = 'clear' | 'cloudy' | 'rain' | 'snow';

export const VARIANT_COLORS: Record<WeatherVariant, [string, string]> = {
  clear: [VAR_CLEAR_PRIMARY, VAR_CLEAR_SECONDARY],
  cloudy: [VAR_CLOUDY_PRIMARY, VAR_CLOUDY_SECONDARY],
  rain: [VAR_RAIN_PRIMARY, VAR_RAIN_SECONDARY],
  snow: [VAR_SNOW_PRIMARY, VAR_SNOW_SECONDARY],
};

const WEATHER_RANGES: {
  min: number;
  max: number;
  label: string;
  dayIcon: Icon;
  nightIcon?: Icon;
}[] = [
  {min: 0, max: 0, label: 'Clear', dayIcon: Sun1, nightIcon: Moon},
  {min: 1, max: 1, label: 'Mainly Clear', dayIcon: Sun1, nightIcon: Moon},
  {min: 2, max: 2, label: 'Partly Cloudy', dayIcon: CloudSunny},
  {min: 3, max: 3, label: 'Overcast', dayIcon: Cloud},
  {min: 45, max: 48, label: 'Fog', dayIcon: CloudFog},
  {min: 51, max: 55, label: 'Drizzle', dayIcon: CloudDrizzle},
  {min: 56, max: 57, label: 'Freezing Drizzle', dayIcon: CloudDrizzle},
  {min: 61, max: 65, label: 'Rain', dayIcon: CloudDrizzle},
  {min: 66, max: 67, label: 'Freezing Rain', dayIcon: CloudDrizzle},
  {min: 71, max: 77, label: 'Snowfall', dayIcon: CloudSnow},
  {min: 80, max: 82, label: 'Rain Showers', dayIcon: CloudDrizzle},
  {min: 85, max: 86, label: 'Snow Showers', dayIcon: CloudSnow},
  {min: 95, max: Infinity, label: 'Thunderstorm', dayIcon: CloudLightning},
];

const VARIANT_RANGES: {min: number; max: number; variant: WeatherVariant}[] = [
  {min: 0, max: 2, variant: 'clear'},
  {min: 45, max: 48, variant: 'cloudy'},
  {min: 51, max: 67, variant: 'rain'},
  {min: 71, max: 77, variant: 'snow'},
  {min: 80, max: 82, variant: 'rain'},
  {min: 85, max: 86, variant: 'snow'},
  {min: 95, max: Infinity, variant: 'rain'},
];

export function getWeatherInfo(code: number, isDay?: number): WeatherInfo {
  const night = isDay === 0;
  const match = WEATHER_RANGES.find((r) => code >= r.min && code <= r.max);
  if (match) {
    return {
      label: match.label,
      icon: night && match.nightIcon ? match.nightIcon : match.dayIcon,
    };
  }
  return {label: 'Unknown', icon: InfoCircle};
}

export function getBackgroundVariant(code: number): WeatherVariant {
  if (code === 3) return 'cloudy';
  const match = VARIANT_RANGES.find((r) => code >= r.min && code <= r.max);
  return match?.variant ?? 'clear';
}
