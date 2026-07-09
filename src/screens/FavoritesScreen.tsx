import {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Heart, ArrowLeft, Location} from 'iconsax-react-nativejs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';
import type {FavoriteCity} from '../weather/types';
import {getFavorites, removeFavorite} from '../weather/utils/favorites';
import {Screen} from '../design-system';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  BG_SURFACE,
  WHITE_30,
  WHITE_50,
  WHITE,
} from '../styles/Color';
import {SIZE_BASE, SIZE_XL, SIZE_SM, SEMIBOLD} from '../styles/Fonts';
import {
  M_3,
  MT_4,
  MR_3,
  MX_3,
  P_SCREEN_X,
  P_INPUT,
  P_ACCENT_X_LG,
  PY_20,
} from '../styles/Spacing';
import {ICON_XL, ICON_MD, ICON_2XL, RADIUS_MD} from '../styles/Sizing';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen({navigation}: Readonly<Props>) {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await getFavorites();
    setFavorites(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRemove(city: FavoriteCity) {
    await removeFavorite(city.latitude, city.longitude);
    setFavorites((prev) =>
      prev.filter(
        (c) =>
          Math.abs(c.latitude - city.latitude) >= 0.01 ||
          Math.abs(c.longitude - city.longitude) >= 0.01,
      ),
    );
  }

  function handleSelect(city: FavoriteCity) {
    const label = city.admin1
      ? `${city.name}, ${city.admin1}, ${city.country}`
      : `${city.name}, ${city.country}`;
    navigation.navigate('Home', {
      latitude: city.latitude,
      longitude: city.longitude,
      cityName: label,
    });
  }

  return (
    <Screen variant="clear" background="image">
      <SafeAreaView className="flex-1">
        <View className={`flex-row items-center ${P_SCREEN_X} py-3`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={MR_3}>
            <ArrowLeft size={ICON_XL} color={WHITE} />
          </TouchableOpacity>
          <Text className={`${TEXT_PRIMARY} ${SIZE_XL} ${SEMIBOLD}`}>
            Favorite Cities
          </Text>
        </View>

        {loading && (
          <View className={`${PY_20} items-center`}>
            <ActivityIndicator size="large" color={WHITE} />
          </View>
        )}

        {!loading && favorites.length === 0 && (
          <View
            className={`flex-1 justify-center items-center ${P_ACCENT_X_LG}`}>
            <Heart size={ICON_2XL} color={WHITE_30} variant="Bold" />
            <Text className={`${TEXT_MUTED} ${SIZE_BASE} text-center ${MT_4}`}>
              No favorite cities yet. Search for a city and tap the star to add
              it.
            </Text>
          </View>
        )}

        {!loading && favorites.length > 0 && (
          <FlatList
            data={favorites}
            keyExtractor={(item) =>
              `${item.latitude.toFixed(4)}:${item.longitude.toFixed(4)}`
            }
            className={P_SCREEN_X}
            renderItem={({item}) => {
              const label = item.admin1
                ? `${item.name}, ${item.admin1}, ${item.country}`
                : `${item.name}, ${item.country}`;

              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className={`${BG_SURFACE} ${RADIUS_MD} ${P_INPUT} ${M_3} flex-row items-center`}>
                  <Location size={ICON_MD} color={WHITE_50} />
                  <View className={`flex-1 ${MX_3}`}>
                    <Text
                      className={`${TEXT_PRIMARY} ${SEMIBOLD} ${SIZE_BASE}`}>
                      {label}
                    </Text>
                    <Text className={`${TEXT_MUTED} ${SIZE_SM}`}>
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemove(item)}
                    className="p-2">
                    <Heart size={ICON_MD} color={WHITE} variant="Bold" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </SafeAreaView>
    </Screen>
  );
}
