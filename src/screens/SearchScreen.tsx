import {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';
import type {GeocodingResult} from '../weather/types';
import {searchCities} from '../weather/api/geocoding';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../weather/utils/favorites';
import {ArrowLeft, Star1, SearchNormal1} from 'iconsax-react-nativejs';
import {Input, colors} from '../design-system';

type Props = Readonly<NativeStackScreenProps<RootStackParamList, 'Search'>>;

export default function SearchScreen({navigation}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteSet, setFavoriteSet] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    getFavorites().then((list) => {
      setFavoriteSet(
        new Set(list.map((c) => `${c.latitude.toFixed(2)}:${c.longitude.toFixed(2)}`)),
      );
    });
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const cities = await searchCities(query);
        setResults(cities);
        if (cities.length === 0) {
          setError('No cities found. Try a different search.');
        }
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : 'Search failed. Try again.',
        );
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  function handleSelect(city: GeocodingResult) {
    Keyboard.dismiss();
    const label = city.admin1
      ? `${city.name}, ${city.admin1}, ${city.country}`
      : `${city.name}, ${city.country}`;
    navigation.navigate('Home', {
      latitude: city.latitude,
      longitude: city.longitude,
      cityName: label,
    });
  }

  async function toggleFavorite(city: GeocodingResult) {
    const key = `${city.latitude.toFixed(2)}:${city.longitude.toFixed(2)}`;
    const already = favoriteSet.has(key);

    if (already) {
      await removeFavorite(city.latitude, city.longitude);
      favoriteSet.delete(key);
      setFavoriteSet(new Set(favoriteSet));
    } else {
      await addFavorite({
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        admin1: city.admin1,
        country: city.country,
      });
      favoriteSet.add(key);
      setFavoriteSet(new Set(favoriteSet));
    }
  }

  function isFav(city: GeocodingResult): boolean {
    return favoriteSet.has(
      `${city.latitude.toFixed(2)}:${city.longitude.toFixed(2)}`,
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3">
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Search for a city..."
          returnKeyType="search"
          autoCorrect={false}
        />
      </View>

      {loading && (
        <View className="py-10 items-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      )}

      {error && !loading && (
        <View className="py-10 items-center px-6">
          <Text className={`${colors.textMuted} text-base text-center`}>
            {error}
          </Text>
        </View>
      )}

      {!loading && !error && query.trim() !== '' && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          className="px-4"
          renderItem={({item}) => {
            const label = item.admin1
              ? `${item.name}, ${item.admin1}, ${item.country}`
              : `${item.name}, ${item.country}`;
            const starred = isFav(item);

            return (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className={`${colors.surface} rounded-xl p-4 mb-2 flex-row items-center`}>
                <View className="flex-1">
                  <Text className={`${colors.textPrimary} font-semibold text-base`}>
                    {label}
                  </Text>
                  <Text className={`${colors.textMuted} text-sm`}>
                    {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleFavorite(item)}
                  className="ml-2 p-2">
                  {starred ? (
                    <Star1 size={24} color="#fff" variant="Bold" />
                  ) : (
                    <Star1 size={24} color="#fff" variant="Outline" />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {!query.trim() && (
        <View className="py-20 items-center px-6">
          <SearchNormal1 size={24} color="white" opacity={0.5} />
          <Text className={`${colors.textMuted} text-base text-center`}>
            Type a city name to search
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
