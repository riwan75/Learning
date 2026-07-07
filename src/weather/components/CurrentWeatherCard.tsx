import {View, Text} from 'react-native';
import type {CurrentWeather} from '../types';
import {getWeatherInfo} from '../utils/weatherCodes';
import {formatTemp, type Unit} from '../utils/units';
import {Card, colors} from '../../design-system';

interface Props {
  data: CurrentWeather;
  cityName?: string;
  unit: Unit;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CurrentWeatherCard({data, cityName, unit}: Readonly<Props>) {
  const weather = getWeatherInfo(data.weatherCode);

  return (
    <Card variant="default" className="items-center">
      {cityName && (
        <Text className={`${colors.textPrimary} text-lg font-semibold mb-1`}>
          {cityName}
        </Text>
      )}
      <weather.icon size={72} color="#fff" variant="Bold" />
      <Text className={`${colors.textPrimary} text-6xl font-bold mb-1`}>
        {formatTemp(data.temperature, unit)}
      </Text>
      <Text className={`${colors.textSecondary} text-lg mb-4`}>{weather.label}</Text>

      <View className="flex-row justify-around w-full border-t border-white/20 pt-4">
        <View className="items-center">
          <Text className={`${colors.textMuted} text-sm`}>Humidity</Text>
          <Text className={`${colors.textPrimary} font-semibold text-base`}>
            {data.relativeHumidity}%
          </Text>
        </View>
        <View className="items-center">
          <Text className={`${colors.textMuted} text-sm`}>Wind</Text>
          <Text className={`${colors.textPrimary} font-semibold text-base`}>
            {data.windSpeed} km/h
          </Text>
        </View>
        <View className="items-center">
          <Text className={`${colors.textMuted} text-sm`}>Updated</Text>
          <Text className={`${colors.textPrimary} font-semibold text-sm`}>
            {formatDate(data.time)}
          </Text>
        </View>
      </View>
    </Card>
  );
}
