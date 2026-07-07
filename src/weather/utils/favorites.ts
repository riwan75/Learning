import {getJSON, setJSON} from '../../shared/storage/storage';
import type {FavoriteCity} from '../types';

const FAVORITES_KEY = 'favorites:cities';

export async function getFavorites(): Promise<FavoriteCity[]> {
  const data = await getJSON<FavoriteCity[]>(FAVORITES_KEY);
  return data ?? [];
}

export async function addFavorite(city: FavoriteCity): Promise<void> {
  const list = await getFavorites();
  const exists = list.some(
    (c) =>
      Math.abs(c.latitude - city.latitude) < 0.01 &&
      Math.abs(c.longitude - city.longitude) < 0.01,
  );
  if (!exists) {
    list.push(city);
    await setJSON(FAVORITES_KEY, list);
  }
}

export async function removeFavorite(
  latitude: number,
  longitude: number,
): Promise<void> {
  const list = await getFavorites();
  const filtered = list.filter(
    (c) =>
      Math.abs(c.latitude - latitude) >= 0.01 ||
      Math.abs(c.longitude - longitude) >= 0.01,
  );
  await setJSON(FAVORITES_KEY, filtered);
}

export async function isFavorite(
  latitude: number,
  longitude: number,
): Promise<boolean> {
  const list = await getFavorites();
  return list.some(
    (c) =>
      Math.abs(c.latitude - latitude) < 0.01 &&
      Math.abs(c.longitude - longitude) < 0.01,
  );
}
