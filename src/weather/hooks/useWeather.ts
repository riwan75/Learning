import {useState, useEffect, useCallback} from 'react';
import type {WeatherData, LocationCoords} from '../types';
import {fetchWeather} from '../api/openMeteo';
import {getJSON, setJSON} from '../../shared/storage/storage';

const CACHE_TTL = 10 * 60 * 1000;

function cacheKey(lat: number, lon: number) {
  return `weather:${lat.toFixed(2)}:${lon.toFixed(2)}`;
}

interface UseWeatherResult {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  stale: boolean;
  refresh: () => Promise<void>;
}

export function useWeather(coords: LocationCoords | null): UseWeatherResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);

  const fetch = useCallback(async (lat: number, lon: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchWeather(lat, lon);
      await setJSON(cacheKey(lat, lon), result);
      setData(result);
      setStale(false);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to fetch weather';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!coords) return;

    const {latitude, longitude} = coords;
    const key = cacheKey(latitude, longitude);

    getJSON<WeatherData>(key).then((cached) => {
      const isValid =
        cached && cached.details && cached.hourly && cached.hourly.length > 0;

      if (isValid) {
        const age = Date.now() - cached.fetchedAt;
        if (age < CACHE_TTL) {
          setData(cached);
          setStale(false);
          return;
        }
        setData(cached);
        setStale(true);
      }

      fetch(latitude, longitude);
    });
  }, [coords, fetch]);

  const refresh = useCallback(async () => {
    if (!coords) return;
    await fetch(coords.latitude, coords.longitude);
  }, [coords, fetch]);

  return {data, loading, error, stale, refresh};
}
