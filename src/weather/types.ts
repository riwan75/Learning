export interface CurrentWeather {
  temperature: number;
  relativeHumidity: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
}

export interface HourlyDataPoint {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface WeatherDetailMetrics {
  apparentTemperature: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationProbabilityMax: number;
  windSpeed: number;
  humidity: number;
  visibility: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyDataPoint[];
  details: WeatherDetailMetrics;
  fetchedAt: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
  cityName?: string;
}

export interface FavoriteCity {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country: string;
}
