import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackgroundImage from './BackgroundImage';
import type {WeatherVariant} from '../../weather/utils/weatherCodes';
import {VARIANT_COLORS} from '../../weather/utils/weatherCodes';
import {BG_SCREEN_OVERLAY} from '../../styles/Color';

interface Props {
  variant: WeatherVariant;
  children: React.ReactNode;
  background?: 'gradient' | 'image';
}

export default function Screen({
  variant,
  children,
  background = 'gradient',
}: Readonly<Props>) {
  const gradientColors = VARIANT_COLORS[variant] ?? VARIANT_COLORS.clear;

  if (background === 'image') {
    return (
      <BackgroundImage>
        <SafeAreaView className="flex-1">{children}</SafeAreaView>
      </BackgroundImage>
    );
  }

  return (
    <View className="flex-1">
      <LinearGradient colors={gradientColors} className="absolute inset-0" />
      <View className={`absolute inset-0 ${BG_SCREEN_OVERLAY}`} />
      <SafeAreaView className="flex-1">{children}</SafeAreaView>
    </View>
  );
}
