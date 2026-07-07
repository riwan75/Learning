import {useRef} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {Location, CloseCircle} from 'iconsax-react-nativejs';
import type {FavoriteCity} from '../types';
import {colors} from '../../design-system';

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
    <View className="px-4 mb-3">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="overflow-visible">
        <TouchableOpacity
          onPress={onBackToGps}
          className={`${colors.surface} rounded-full px-4 py-2 mr-2 ${
            isGpsActive ? colors.surfacePressed : ''
          }`}>
          <Text
            className={`text-sm ${
              isGpsActive
                ? `${colors.textPrimary} font-semibold`
                : colors.textMuted
            }`}>
            <Location size={16} color="#fff" variant="Bold" /> Current Location
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
            <View key={`${city.latitude.toFixed(2)}:${city.longitude.toFixed(2)}`} className="flex-row items-center mr-2">
              <TouchableOpacity
                onPress={() => onSelect(city)}
                className={`${colors.surface} rounded-l-full px-4 py-2 ${
                  isActive ? colors.surfacePressed : ''
                }`}>
                <Text
                  className={`text-sm ${
                    isActive
                      ? `${colors.textPrimary} font-semibold`
                      : colors.textMuted
                  }`}>
                  {city.name}
                </Text>
              </TouchableOpacity>
              {isActive && (
                <TouchableOpacity
                  onPress={onBackToGps}
                  className={`${colors.surfacePressed} rounded-r-full px-2 py-2`}>
                  <CloseCircle size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
