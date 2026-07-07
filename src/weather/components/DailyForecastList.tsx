import {View, Text, FlatList} from 'react-native';
import type {DailyForecast} from '../types';
import {getWeatherInfo} from '../utils/weatherCodes';
import {formatTemp, type Unit} from '../utils/units';
import {Card, colors} from '../../design-system';

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
      <Text className={`${colors.textPrimary} font-semibold text-lg mb-3 px-1`}>
        7-Day Forecast
      </Text>
      <Text className={`${colors.textSubtle} text-xs mb-3 px-1 -mt-2`}>
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
              className={`flex-row items-center py-3 px-1 ${
                index < data.length - 1 ? 'border-b border-white/10' : ''
              }`}>
              <Text
                className={`w-20 ${colors.textPrimary} font-medium ${
                  isToday ? 'font-bold' : ''
                }`}>
                {dayName}
              </Text>
              <Text className="text-xs mr-1">{formatDate(item.date)}</Text>
              <View className="flex-1 items-center">
                <weather.icon size={24} color="#fff" variant="Linear" />
              </View>
              <Text
                className={`w-12 ${colors.textMuted} text-right`}>
                {formatTemp(item.temperatureMin, unit)}
              </Text>
              <View className="w-20 h-2 mx-2 rounded-full bg-white/20 overflow-hidden">
                <View
                  className="h-full rounded-full bg-white/60"
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
              <Text
                className={`w-12 ${colors.textPrimary} text-right font-medium`}>
                {formatTemp(item.temperatureMax, unit)}
              </Text>
            </View>
          );
        }}
      />
    </Card>
  );
}
