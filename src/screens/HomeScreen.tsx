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
import SegmentedChart from '../weather/components/SegmentedChart';
import {getJSON, setJSON} from '../shared/storage/storage';
import {type Unit, UNIT_KEY} from '../weather/utils/units';
import {getBackgroundVariant} from '../weather/utils/weatherCodes';
import {getFavorites} from '../weather/utils/favorites';
import {SearchNormal1, Heart} from 'iconsax-react-nativejs';
import {Screen, Card, Pill} from '../design-system';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_SECONDARY,
  ERROR_TEXT,
  WARNING_BG,
  WARNING_TEXT,
  BG_SURFACE_PRESSED,
  BG_ACCENT,
  WHITE,
} from '../styles/Color';
import {
  SIZE_2XL,
  SIZE_BASE,
  SIZE_SM,
  BOLD,
  SEMIBOLD,
  TRACKING_TIGHT,
} from '../styles/Fonts';
import {
  MT_4,
  M_4,
  P_SCREEN_X,
  P_PILL_X,
  P_PILL_Y,
  P_PILL_ICON_X,
  P_PILL_ICON_Y,
} from '../styles/Spacing';
import {ICON_SM, RADIUS_INPUT} from '../styles/Sizing';
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

  const goToGps = useCallback(async () => {
    const gps = gpsCoordsRef.current;
    if (!gps) return;
    setCoords({latitude: gps.latitude, longitude: gps.longitude});
    setCityName(undefined);
    searchedRef.current = false;
    scrollRef.current?.scrollTo({y: 0, animated: true});

    const result = await reverseGeocode(gps.latitude, gps.longitude);
    if (result && !searchedRef.current) setCityName(result.label);
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
      <Screen variant="clear" background="image">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="white" />
          <Text className={`${TEXT_PRIMARY} ${MT_4} ${SIZE_BASE}`}>
            Getting your location...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen variant={variant} background="image">
      <View className="flex-1">
        <View className="flex-row justify-between items-center px-6 py-4">
          <Text
            className={`${TEXT_PRIMARY} ${SIZE_2XL} ${BOLD} ${TRACKING_TIGHT}`}>
            Weather
          </Text>
          <View className="flex-row items-center gap-2">
            <Pill>
              <TouchableOpacity
                onPress={toggleUnit}
                className={`${P_PILL_X} ${P_PILL_Y} ${SIZE_BASE} ${
                  unit === 'C'
                    ? `${BG_ACCENT} ${TEXT_PRIMARY} ${SEMIBOLD}`
                    : TEXT_MUTED
                }`}>
                <Text
                  className={`${
                    unit === 'C' ? `${TEXT_PRIMARY} ${SEMIBOLD}` : TEXT_MUTED
                  }`}>
                  °C
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleUnit}
                className={`${P_PILL_X} ${P_PILL_Y} ${SIZE_BASE} ${
                  unit === 'F'
                    ? `${BG_ACCENT} ${TEXT_PRIMARY} ${SEMIBOLD}`
                    : TEXT_MUTED
                }`}>
                <Text
                  className={`${
                    unit === 'F' ? `${TEXT_PRIMARY} ${SEMIBOLD}` : TEXT_MUTED
                  }`}>
                  °F
                </Text>
              </TouchableOpacity>
            </Pill>
            <Pill>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                className={`${P_PILL_ICON_X} ${P_PILL_ICON_Y}`}>
                <SearchNormal1 size={ICON_SM} color={WHITE} variant="Linear" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Favorites')}
                className={`${P_PILL_ICON_X} ${P_PILL_ICON_Y}`}>
                <Heart size={ICON_SM} color={WHITE} variant="Linear" />
              </TouchableOpacity>
            </Pill>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          className={`flex-1 ${P_SCREEN_X}`}
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
                className={`${TEXT_SECONDARY} ${SIZE_BASE} text-center${M_4}`}>
                {gpsError}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                className={`${BG_SURFACE_PRESSED} ${RADIUS_INPUT} py-3 px-6`}>
                <Text className={`${TEXT_PRIMARY} ${SEMIBOLD}`}>
                  Search City
                </Text>
              </TouchableOpacity>
            </Card>
          )}

          {error && (
            <Card variant="default" className="items-center">
              <Text className={`${ERROR_TEXT} ${SIZE_BASE} text-center mb-1`}>
                {error}
              </Text>
              <Text className={`${TEXT_MUTED} ${SIZE_SM} text-center${M_4}`}>
                {stale
                  ? 'Showing cached data. Pull to retry.'
                  : 'Pull down to retry.'}
              </Text>
              <TouchableOpacity
                onPress={handleRefresh}
                className={`${BG_SURFACE_PRESSED} ${RADIUS_INPUT} py-2 px-5`}>
                <Text className={`${TEXT_PRIMARY} ${SEMIBOLD}`}>Retry</Text>
              </TouchableOpacity>
            </Card>
          )}

          {stale && !error && (
            <View className={`${WARNING_BG} ${RADIUS_INPUT} py-2 px-4${M_4}`}>
              <Text className={`${WARNING_TEXT} ${SIZE_SM} text-center`}>
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
                <SegmentedChart data={data.hourly} unit={unit} />
              )}
            </>
          )}

          {loading && !data && !error && (
            <View className="items-center py-20">
              <ActivityIndicator size="large" color="white" />
              <Text className={`${TEXT_PRIMARY} ${MT_4} ${SIZE_BASE}`}>
                Loading weather...
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
