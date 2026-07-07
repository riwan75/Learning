import type {Icon} from 'iconsax-react-nativejs';
import {
  Sun1,
  CloudSunny,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  InfoCircle,
} from 'iconsax-react-nativejs';

export interface WeatherInfo {
  label: string;
  icon: Icon;
}

export type WeatherVariant = 'clear' | 'cloudy' | 'rain' | 'snow';

export const VARIANT_COLORS: Record<WeatherVariant, [string, string]> = {
  clear: ['#60a5fa', '#2563eb'],
  cloudy: ['#94a3b8', '#475569'],
  rain: ['#475569', '#1e293b'],
  snow: ['#cbd5e1', '#64748b'],
};

export function getWeatherInfo(code: number): WeatherInfo {
  if (code === 0) return {label: 'Clear', icon: Sun1};
  if (code === 1) return {label: 'Mainly Clear', icon: Sun1};
  if (code === 2) return {label: 'Partly Cloudy', icon: CloudSunny};
  if (code === 3) return {label: 'Overcast', icon: Cloud};
  if (code >= 45 && code <= 48) return {label: 'Fog', icon: CloudFog};
  if (code >= 51 && code <= 55) return {label: 'Drizzle', icon: CloudDrizzle};
  if (code >= 56 && code <= 57) return {label: 'Freezing Drizzle', icon: CloudDrizzle};
  if (code >= 61 && code <= 65) return {label: 'Rain', icon: CloudDrizzle};
  if (code >= 66 && code <= 67) return {label: 'Freezing Rain', icon: CloudDrizzle};
  if (code >= 71 && code <= 77) return {label: 'Snowfall', icon: CloudSnow};
  if (code >= 80 && code <= 82) return {label: 'Rain Showers', icon: CloudDrizzle};
  if (code >= 85 && code <= 86) return {label: 'Snow Showers', icon: CloudSnow};
  if (code >= 95) return {label: 'Thunderstorm', icon: CloudLightning};
  return {label: 'Unknown', icon: InfoCircle};
}

export function getBackgroundVariant(code: number): WeatherVariant {
  if (code <= 2) return 'clear';
  if (code === 3 || (code >= 45 && code <= 48)) return 'cloudy';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95)
    return 'rain';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow';
  return 'clear';
}
