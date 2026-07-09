import {View, Text} from 'react-native';
import type {CurrentWeather} from '../types';
import {getWeatherInfo} from '../utils/weatherCodes';
import {formatTemp, type Unit} from '../utils/units';
import {Card} from '../../design-system';
import {
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  TEXT_WHITE_60,
  WHITE,
  BORDER_DEFAULT,
} from '../../styles/Color';
import {
  SIZE_LG,
  SIZE_6XL,
  SIZE_BASE,
  SIZE_SM,
  SEMIBOLD,
  BOLD,
} from '../../styles/Fonts';
import {M_1, M_4, ML_2, PT_4} from '../../styles/Spacing';
import {ICON_HERO} from '../../styles/Sizing';

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

export default function CurrentWeatherCard({
  data,
  cityName,
  unit,
}: Readonly<Props>) {
  const weather = getWeatherInfo(data.weatherCode, data.isDay);

  return (
    <Card variant="default" className="items-center">
      {cityName && (
        <Text className={`${TEXT_PRIMARY} ${SIZE_LG} ${SEMIBOLD} ${M_1}`}>
          {cityName}
        </Text>
      )}
      <weather.icon size={ICON_HERO} color={WHITE} variant="Bold" />
      <Text className={`${TEXT_PRIMARY} ${SIZE_6XL} ${BOLD} ${M_1}`}>
        {formatTemp(data.temperature, unit)}
      </Text>
      <Text className={`${TEXT_SECONDARY} ${SIZE_LG} ${M_4}`}>
        {weather.label}
        {data.precipitation !== undefined && data.precipitation > 0 && (
          <Text className={`${TEXT_WHITE_60} ${SIZE_BASE} ${ML_2}`}>
            · {data.precipitation}mm
          </Text>
        )}
      </Text>

      <View
        className={`flex-row justify-around w-full border-t ${BORDER_DEFAULT} ${PT_4}`}>
        <View className="items-center">
          <Text className={`${TEXT_MUTED} ${SIZE_SM}`}>Humidity</Text>
          <Text className={`${TEXT_PRIMARY} ${SEMIBOLD} ${SIZE_BASE}`}>
            {data.relativeHumidity}%
          </Text>
        </View>
        <View className="items-center">
          <Text className={`${TEXT_MUTED} ${SIZE_SM}`}>Wind</Text>
          <Text className={`${TEXT_PRIMARY} ${SEMIBOLD} ${SIZE_BASE}`}>
            {data.windSpeed} km/h
          </Text>
        </View>
        <View className="items-center">
          <Text className={`${TEXT_MUTED} ${SIZE_SM}`}>Updated</Text>
          <Text className={`${TEXT_PRIMARY} ${SEMIBOLD} ${SIZE_SM}`}>
            {formatDate(data.time)}
          </Text>
        </View>
      </View>
    </Card>
  );
}
