import {View, Text} from 'react-native';
import {Sun1, Eye, Clock, Wind2, Drop, CloudDrizzle, CloudSunny} from 'iconsax-react-nativejs';
import type {Icon} from 'iconsax-react-nativejs';
import type {WeatherDetailMetrics} from '../types';
import {formatTemp, type Unit} from '../utils/units';
import {Card, colors} from '../../design-system';

interface Props {
  data: WeatherDetailMetrics;
  unit: Unit;
}

export default function DetailMetricsCard({data, unit}: Readonly<Props>) {
  const sunriseTime = data.sunrise
    ? new Date(data.sunrise).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--';

  const sunsetTime = data.sunset
    ? new Date(data.sunset).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--';

  const items: {icon: Icon; label: string; value: string; sub: string}[] = [
    {
      icon: Sun1,
      label: 'UV Index',
      value: `${Math.round(data.uvIndex)}`,
      sub: `Max ${Math.round(data.uvIndexMax)}`,
    },
    {
      icon: CloudSunny,
      label: 'Sunrise',
      value: sunriseTime,
      sub: `Sunset ${sunsetTime}`,
    },
    {
      icon: Wind2,
      label: 'Wind',
      value: `${Math.round(data.windSpeed)}`,
      sub: 'km/h',
    },
    {
      icon: Drop,
      label: 'Rainfall',
      value: `${Math.round(data.precipitationProbabilityMax)}%`,
      sub: 'precip',
    },
    {
      icon: Sun1,
      label: 'Feels Like',
      value: formatTemp(data.apparentTemperature, unit),
      sub: `${Math.round(data.precipitationProbabilityMax)}% precip`,
    },
    {
      icon: CloudDrizzle,
      label: 'Humidity',
      value: `${Math.round(data.humidity)}%`,
      sub: 'moisture',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: data.visibility,
      sub: 'visibility',
    },
    {
      icon: Clock,
      label: 'Pressure',
      value: `${Math.round(data.pressure)}`,
      sub: 'hPa',
    },
  ];

  return (
    <Card variant="compact">
      <Text className={`${colors.textPrimary} font-semibold text-lg mb-3 px-1`}>
        Details
      </Text>
      <View className="flex-row flex-wrap">
        {items.map((item) => {
          const IconComp = item.icon;
          return (
            <View key={item.label} className="w-1/2 px-1 mb-3">
              <View
                className={`${colors.surfaceMuted} rounded-[22px] p-3 items-center`}>
                <View className="mb-1">
                  <IconComp size={22} color="#fff" variant="Linear" />
                </View>
                <Text className={`${colors.textMuted} text-[11px] font-semibold uppercase tracking-wider`}>
                  {item.label}
                </Text>
                <Text
                  className={`${colors.textPrimary} font-semibold text-base mt-1`}>
                  {item.value}
                </Text>
                <Text className={`${colors.textSubtle} text-[10px] mt-0.5`}>
                  {item.sub}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
