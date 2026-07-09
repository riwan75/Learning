import type {
  WeatherData,
  CurrentWeather,
  DailyForecast,
  HourlyDataPoint,
  WeatherDetailMetrics,
} from '../types';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    apparent_temperature: number;
    pressure_msl: number;
    uv_index: number;
    is_day: number;
    visibility: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    precipitation: number;
    rain: number;
    cloud_cover: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    precipitation: number[];
    dew_point_2m: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_probability_max: number[];
  };
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current:
      'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature,pressure_msl,uv_index,is_day,visibility,wind_direction_10m,wind_gusts_10m,precipitation,rain,cloud_cover',
    hourly:
      'temperature_2m,weather_code,precipitation_probability,precipitation,dew_point_2m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data: OpenMeteoResponse = await response.json();

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    relativeHumidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    time: data.current.time,
    isDay: data.current.is_day,
    visibility: data.current.visibility,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    precipitation: data.current.precipitation,
    rain: data.current.rain,
    cloudCover: data.current.cloud_cover,
  };

  const daily: DailyForecast[] = data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    temperatureMax: data.daily.temperature_2m_max[i],
    temperatureMin: data.daily.temperature_2m_min[i],
  }));

  const hourly: HourlyDataPoint[] = data.hourly.time
    .slice(0, 24)
    .map((time, i) => ({
      time,
      temperature: data.hourly.temperature_2m[i],
      weatherCode: data.hourly.weather_code[i],
      precipitationProbability: data.hourly.precipitation_probability[i],
      precipitation: data.hourly.precipitation[i],
      dewPoint: data.hourly.dew_point_2m[i],
    }));

  const details: WeatherDetailMetrics = {
    apparentTemperature: data.current.apparent_temperature,
    pressure: data.current.pressure_msl,
    uvIndex: data.current.uv_index,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    uvIndexMax: data.daily.uv_index_max[0],
    precipitationProbabilityMax: data.daily.precipitation_probability_max[0],
    windSpeed: data.current.wind_speed_10m,
    humidity: data.current.relative_humidity_2m,
    visibility: data.current.visibility,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    cloudCover: data.current.cloud_cover,
    dewPoint: data.hourly.dew_point_2m[0],
  };

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    current,
    daily,
    hourly,
    details,
    fetchedAt: Date.now(),
  };
}
