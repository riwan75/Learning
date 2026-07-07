import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {WeatherVariant} from '../../weather/utils/weatherCodes';
import {VARIANT_COLORS} from '../../weather/utils/weatherCodes';

interface Props {
  variant: WeatherVariant;
  children: React.ReactNode;
}

export default function Screen({variant, children}: Readonly<Props>) {
  const gradientColors = VARIANT_COLORS[variant] ?? VARIANT_COLORS.clear;
  return (
    <View className="flex-1">
      <LinearGradient colors={gradientColors} className="absolute inset-0" />
      <View className="absolute inset-0 bg-white/5" />
      <SafeAreaView className="flex-1">{children}</SafeAreaView>
    </View>
  );
}
