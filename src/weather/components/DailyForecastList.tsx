import {View, Text, FlatList} from 'react-native';
import type {DailyForecast} from '../types';
import {getWeatherInfo} from '../utils/weatherCodes';
import {formatTemp, type Unit} from '../utils/units';
import {Card} from '../../design-system';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_SUBTLE,
  WHITE,
  BORDER_SUBTLE,
  BG_SURFACE,
  BG_BAR_FILL,
} from '../../styles/Color';
import {SIZE_LG, SIZE_XS, MEDIUM, BOLD, SEMIBOLD} from '../../styles/Fonts';
import {M_3, MT_NEG_2, P_ROW_X, MX_2, MR_1} from '../../styles/Spacing';
import {ICON_XL, W_20, W_12, H_2} from '../../styles/Sizing';

interface Props {
  data: DailyForecast[];
  unit: Unit;
}

function getDayName(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {weekday: 'short'});
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
}

export default function DailyForecastList({data, unit}: Readonly<Props>) {
  return (
    <Card variant="compact">
      <Text
        className={`${TEXT_PRIMARY} ${SEMIBOLD} ${SIZE_LG} ${M_3} ${P_ROW_X}`}>
        7-Day Forecast
      </Text>
      <Text
        className={`${TEXT_SUBTLE} ${SIZE_XS} ${M_3} ${P_ROW_X} ${MT_NEG_2}`}>
        This Week
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.date}
        scrollEnabled={false}
        renderItem={({item, index}) => {
          const weather = getWeatherInfo(item.weatherCode);
          const dayName = getDayName(item.date);
          const isToday = dayName === 'Today';

          return (
            <View
              className={`flex-row items-center py-3 ${P_ROW_X} ${
                index < data.length - 1 ? `border-b ${BORDER_SUBTLE}` : ''
              }`}>
              <Text
                className={`${W_20} ${TEXT_PRIMARY} ${MEDIUM} ${
                  isToday ? BOLD : ''
                }`}>
                {dayName}
              </Text>
              <Text className={`${SIZE_XS} ${MR_1}`}>
                {formatDate(item.date)}
              </Text>
              <View className="flex-1 items-center">
                <weather.icon size={ICON_XL} color={WHITE} variant="Linear" />
              </View>
              <Text className={`${W_12} ${TEXT_MUTED} text-right`}>
                {formatTemp(item.temperatureMin, unit)}
              </Text>
              <View
                className={`${W_20} ${H_2} ${MX_2} rounded-full ${BG_SURFACE} overflow-hidden`}>
                <View
                  className={`h-full rounded-full ${BG_BAR_FILL}`}
                  style={{
                    marginLeft: `${Math.max(
                      0,
                      ((item.temperatureMin + 10) / 40) * 100,
                    )}%`,
                    width: `${Math.max(
                      10,
                      ((item.temperatureMax - item.temperatureMin) / 40) * 100,
                    )}%`,
                  }}
                />
              </View>
              <Text className={`${W_12} ${TEXT_PRIMARY} text-right ${MEDIUM}`}>
                {formatTemp(item.temperatureMax, unit)}
              </Text>
            </View>
          );
        }}
      />
    </Card>
  );
}
