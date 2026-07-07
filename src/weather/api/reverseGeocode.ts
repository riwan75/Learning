export interface ReverseGeoResult {
  city: string;
  region?: string;
  country: string;
  label: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<ReverseGeoResult | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;

  try {
    const response = await fetch(url, {
      headers: {'User-Agent': 'LearningHub/1.0'},
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (!data?.address) return null;

    const addr = data.address;
    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.county;
    const region = addr.state;
    const country = addr.country;

    if (!city) return null;

    const label = region
      ? `${city}, ${region}, ${country}`
      : `${city}, ${country}`;

    return {city, region, country, label};
  } catch {
    return null;
  }
}
