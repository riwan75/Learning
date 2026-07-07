import {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type {GeolocationResponse} from '@react-native-community/geolocation';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';
import type {LocationCoords, FavoriteCity} from '../weather/types';
import {useWeather} from '../weather/hooks/useWeather';
import CurrentWeatherCard from '../weather/components/CurrentWeatherCard';
import DailyForecastList from '../weather/components/DailyForecastList';
import CitySelector from '../weather/components/CitySelector';
import DetailMetricsCard from '../weather/components/DetailMetricsCard';
import HourlyChart from '../weather/components/HourlyChart';
import {getJSON, setJSON} from '../shared/storage/storage';
import {type Unit, UNIT_KEY} from '../weather/utils/units';
import {getBackgroundVariant} from '../weather/utils/weatherCodes';
import {getFavorites} from '../weather/utils/favorites';
import {
  Screen,
  Card,
  Pill,
  IconButton,
  TabBar,
  colors,
  spacing,
  radius,
} from '../design-system';
import {SearchNormal1} from 'iconsax-react-nativejs';
import {reverseGeocode} from '../weather/api/reverseGeocode';

type Props = Readonly<NativeStackScreenProps<RootStackParamList, 'Home'>>;

export default function HomeScreen({route, navigation}: Props) {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [locating, setLocating] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cityName, setCityName] = useState<string | undefined>();
  const [unit, setUnit] = useState<Unit>('C');
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const searchedRef = useRef(false);
  const gpsCoordsRef = useRef<LocationCoords | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const {data, loading, error, stale, refresh} = useWeather(coords);

  useEffect(() => {
    getJSON<Unit>(UNIT_KEY).then((saved) => {
      if (saved === 'C' || saved === 'F') setUnit(saved);
    });
    getFavorites().then(setFavorites);
  }, []);

  const getLocation = useCallback(async () => {
    setLocating(true);
    setGpsError(null);

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setGpsError('Location permission denied. Search for a city instead.');
          setLocating(false);
          return;
        }
      }

      const position = await new Promise<GeolocationResponse>(
        (resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
          });
        },
      );

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      setCoords({latitude: lat, longitude: lon});
      gpsCoordsRef.current = {latitude: lat, longitude: lon};

      reverseGeocode(lat, lon).then((result) => {
        if (result && !searchedRef.current) setCityName(result.label);
      });
    } catch {
      setGpsError('Could not get your location. Search for a city instead.');
    } finally {
      setLocating(false);
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    const lat = route.params?.latitude;
    const lon = route.params?.longitude;
    const name = route.params?.cityName;
    if (lat !== undefined && lon !== undefined) {
      setCoords({latitude: lat, longitude: lon});
      setCityName(name);
      searchedRef.current = true;
      setGpsError(null);
    }
  }, [route.params?.latitude, route.params?.longitude, route.params?.cityName]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next: Unit = prev === 'C' ? 'F' : 'C';
      setJSON(UNIT_KEY, next);
      return next;
    });
  }, []);

  const goToGps = useCallback(() => {
    const gps = gpsCoordsRef.current;
    if (!gps) return;
    setCoords({latitude: gps.latitude, longitude: gps.longitude});
    setCityName(undefined);
    searchedRef.current = false;
    scrollRef.current?.scrollTo({y: 0, animated: true});
  }, []);

  const handleFavoriteSelect = useCallback((city: FavoriteCity) => {
    setCoords({latitude: city.latitude, longitude: city.longitude});
    setCityName(
      city.admin1
        ? `${city.name}, ${city.admin1}, ${city.country}`
        : `${city.name}, ${city.country}`,
    );
    searchedRef.current = true;
    scrollRef.current?.scrollTo({y: 0, animated: true});
  }, []);

  const variant = data
    ? getBackgroundVariant(data.current.weatherCode)
    : 'clear';

  if (locating) {
    return (
      <Screen variant={variant}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="white" />
          <Text className={`${colors.textPrimary} mt-4 text-base`}>
            Getting your location...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen variant={variant}>
      <View className="flex-1">
        <View className="flex-row justify-between items-center px-6 py-4">
          <Text className="text-white text-2xl font-bold tracking-tight">
            Weather
          </Text>
          <View className="flex-row items-center gap-2">
            <Pill>
              <TouchableOpacity
                onPress={toggleUnit}
                className={`px-3 py-1 text-base ${
                  unit === 'C'
                    ? `${colors.accentBg} ${colors.textPrimary} font-semibold`
                    : colors.textMuted
                }`}>
                <Text
                  className={`${
                    unit === 'C'
                      ? `${colors.textPrimary} font-semibold`
                      : colors.textMuted
                  }`}>
                  °C
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleUnit}
                className={`px-3 py-1 text-base ${
                  unit === 'F'
                    ? `${colors.accentBg} ${colors.textPrimary} font-semibold`
                    : colors.textMuted
                }`}>
                <Text
                  className={`${
                    unit === 'F'
                      ? `${colors.textPrimary} font-semibold`
                      : colors.textMuted
                  }`}>
                  °F
                </Text>
              </TouchableOpacity>
            </Pill>
            <IconButton onPress={() => navigation.navigate('Search')}>
              <SearchNormal1 size={20} color="#fff" />
            </IconButton>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          className={`flex-1 ${spacing.screenPadding}`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="white"
            />
          }>
          <CitySelector
            favorites={favorites}
            currentLat={coords?.latitude ?? 0}
            currentLon={coords?.longitude ?? 0}
            gpsLat={gpsCoordsRef.current?.latitude ?? 0}
            gpsLon={gpsCoordsRef.current?.longitude ?? 0}
            onSelect={handleFavoriteSelect}
            onBackToGps={goToGps}
          />

          {gpsError && !coords && (
            <Card variant="default" className="items-center">
              <Text
                className={`${colors.textSecondary} text-base text-center mb-4`}>
                {gpsError}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                className={`${colors.surfacePressed} rounded-xl py-3 px-6`}>
                <Text className={`${colors.textPrimary} font-semibold`}>
                  Search City
                </Text>
              </TouchableOpacity>
            </Card>
          )}

          {error && (
            <Card variant="default" className="items-center">
              <Text className={`${colors.error} text-base text-center mb-1`}>
                {error}
              </Text>
              <Text className={`${colors.textMuted} text-sm text-center mb-4`}>
                {stale
                  ? 'Showing cached data. Pull to retry.'
                  : 'Pull down to retry.'}
              </Text>
              <TouchableOpacity
                onPress={handleRefresh}
                className={`${colors.surfacePressed} rounded-xl py-2 px-5`}>
                <Text className={`${colors.textPrimary} font-semibold`}>
                  Retry
                </Text>
              </TouchableOpacity>
            </Card>
          )}

          {stale && !error && (
            <View className={`${colors.warningBg} rounded-xl py-2 px-4 mb-4`}>
              <Text className={`${colors.warningText} text-sm text-center`}>
                Showing cached data. Pull to refresh.
              </Text>
            </View>
          )}

          {data && !error && (
            <>
              <CurrentWeatherCard
                data={data.current}
                cityName={cityName}
                unit={unit}
              />
              <DetailMetricsCard data={data.details} unit={unit} />
              <DailyForecastList data={data.daily} unit={unit} />
              {data.hourly && data.hourly.length > 0 && (
                <HourlyChart data={data.hourly} unit={unit} />
              )}
            </>
          )}

          {loading && !data && !error && (
            <View className="items-center py-20">
              <ActivityIndicator size="large" color="white" />
              <Text className={`${colors.textPrimary} mt-4 text-base`}>
                Loading weather...
              </Text>
            </View>
          )}
        </ScrollView>

        <TabBar />
      </View>
    </Screen>
  );
}
