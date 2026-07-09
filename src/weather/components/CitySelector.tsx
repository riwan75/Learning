import {useRef} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {Location} from 'iconsax-react-nativejs';
import type {FavoriteCity} from '../types';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  BG_SURFACE,
  BG_SURFACE_PRESSED,
  WHITE,
  PLACEHOLDER,
} from '../../styles/Color';
import {SIZE_SM, SEMIBOLD} from '../../styles/Fonts';
import {ML_1_5, MR_2, M_3, P_SCREEN_X} from '../../styles/Spacing';
import {ICON_XS} from '../../styles/Sizing';

interface Props {
  favorites: FavoriteCity[];
  currentLat: number;
  currentLon: number;
  gpsLat: number;
  gpsLon: number;
  onSelect: (city: FavoriteCity) => void;
  onBackToGps: () => void;
}

function isSameCoords(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): boolean {
  return Math.abs(lat1 - lat2) < 0.01 && Math.abs(lon1 - lon2) < 0.01;
}

export default function CitySelector({
  favorites,
  currentLat,
  currentLon,
  gpsLat,
  gpsLon,
  onSelect,
  onBackToGps,
}: Readonly<Props>) {
  const scrollRef = useRef<ScrollView>(null);
  const isGpsActive = isSameCoords(currentLat, currentLon, gpsLat, gpsLon);

  return (
    <View className={`${P_SCREEN_X} ${M_3}`}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="overflow-visible">
        <TouchableOpacity
          onPress={onBackToGps}
          className={`flex-row items-center ${BG_SURFACE} rounded-full px-4 py-2 ${MR_2} ${
            isGpsActive ? BG_SURFACE_PRESSED : ''
          }`}>
          <Location
            size={ICON_XS}
            color={isGpsActive ? WHITE : PLACEHOLDER}
            variant="Bold"
          />
          <Text
            className={`${SIZE_SM} ${ML_1_5} ${
              isGpsActive ? `${TEXT_PRIMARY} ${SEMIBOLD}` : TEXT_MUTED
            }`}>
            Current Location
          </Text>
        </TouchableOpacity>

        {favorites.map((city) => {
          const isActive = isSameCoords(
            city.latitude,
            city.longitude,
            currentLat,
            currentLon,
          );

          return (
            <TouchableOpacity
              key={`${city.latitude.toFixed(2)}:${city.longitude.toFixed(2)}`}
              onPress={() => onSelect(city)}
              className={`flex-row items-center rounded-full px-4 py-2 ${MR_2} ${
                isActive ? BG_SURFACE_PRESSED : BG_SURFACE
              }`}>
              <Text
                className={`${SIZE_SM} ${
                  isActive ? `${TEXT_PRIMARY} ${SEMIBOLD}` : TEXT_MUTED
                }`}>
                {city.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
