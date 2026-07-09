import {View, Text} from 'react-native';
import {
  Sun1,
  Eye,
  Clock,
  Drop,
  CloudDrizzle,
  CloudSunny,
  ArrowUp,
  Cloud,
  Speedometer,
} from 'iconsax-react-nativejs';
import type {WeatherDetailMetrics} from '../types';
import {formatTemp, type Unit} from '../utils/units';
import {degreesToCompass} from '../utils/wind';
import {formatLocalTime} from '../utils/time';
import {Card} from '../../design-system';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_SUBTLE,
  BG_SURFACE_MUTED,
  WHITE,
  UV_LOW,
  UV_MODERATE,
  UV_HIGH,
  UV_VERY_HIGH,
  UV_EXTREME,
} from '../../styles/Color';
import {
  SIZE_LG,
  SIZE_XXS,
  SIZE_2XS,
  SEMIBOLD,
  BOLD,
  UPPERCASE,
  TRACKING_WIDEST,
} from '../../styles/Fonts';
import {M_1_5, MT_0_5, MT_1, M_3, P_CARD, P_ROW_X} from '../../styles/Spacing';
import {ICON_LG, RADIUS_DETAIL} from '../../styles/Sizing';

function MetricCard({
  icon: IconComp,
  label,
  value,
  sub,
  iconColor = WHITE,
}: {
  readonly icon: typeof Sun1;
  readonly label: string;
  readonly value: string;
  readonly sub: string;
  readonly iconColor?: string;
}) {
  return (
    <View className="flex-1">
      <View
        className={`${BG_SURFACE_MUTED} ${RADIUS_DETAIL} ${P_CARD} items-center`}>
        <View className={M_1_5}>
          <IconComp size={ICON_LG} color={iconColor} variant="Linear" />
        </View>
        <Text
          className={`${TEXT_MUTED} ${SIZE_XXS} ${SEMIBOLD} ${UPPERCASE} ${TRACKING_WIDEST}`}>
          {label}
        </Text>
        <Text className={`${TEXT_PRIMARY} ${BOLD} ${SIZE_LG} ${MT_1}`}>
          {value}
        </Text>
        <Text className={`${TEXT_SUBTLE} ${SIZE_2XS} ${MT_0_5}`}>{sub}</Text>
      </View>
    </View>
  );
}

function MetricRow({
  left,
  right,
}: {
  readonly left: React.ReactElement;
  readonly right: React.ReactElement;
}) {
  return (
    <View className="flex-row gap-[14px] mb-3">
      {left}
      {right}
    </View>
  );
}

function getUvLevel(index: number): {
  color: string;
  label: string;
} {
  if (index <= 2) {
    return {color: UV_LOW, label: 'Low'};
  }
  if (index <= 5) {
    return {color: UV_MODERATE, label: 'Moderate'};
  }
  if (index <= 7) {
    return {color: UV_HIGH, label: 'High'};
  }
  if (index <= 10) {
    return {color: UV_VERY_HIGH, label: 'Very High'};
  }
  return {color: UV_EXTREME, label: 'Extreme'};
}

function UvIndexCard({
  index,
  max,
}: {
  readonly index: number;
  readonly max: number;
}) {
  const {color, label} = getUvLevel(index);
  return (
    <MetricCard
      icon={Sun1}
      label="UV Index"
      value={`${index}`}
      sub={`${label} · Max ${max}`}
      iconColor={color}
    />
  );
}

function WindCard({
  speed,
  direction,
  gusts,
}: {
  readonly speed: number;
  readonly direction?: number;
  readonly gusts?: number;
}) {
  const dir = direction ?? 0;
  const compassDir = degreesToCompass(dir);
  const gustsText = gusts !== undefined ? ` · gusts ${Math.round(gusts)}` : '';
  return (
    <View className="flex-1">
      <View
        className={`${BG_SURFACE_MUTED} ${RADIUS_DETAIL} ${P_CARD} items-center`}>
        <View className={M_1_5} style={{transform: [{rotate: `${dir}deg`}]}}>
          <ArrowUp size={ICON_LG} color={WHITE} variant="Linear" />
        </View>
        <Text
          className={`${TEXT_MUTED} ${SIZE_XXS} ${SEMIBOLD} ${UPPERCASE} ${TRACKING_WIDEST}`}>
          Wind
        </Text>
        <Text className={`${TEXT_PRIMARY} ${BOLD} ${SIZE_LG} ${MT_1}`}>
          {Math.round(speed)} km/h
        </Text>
        <Text className={`${TEXT_SUBTLE} ${SIZE_2XS} ${MT_0_5}`}>
          {compassDir}
          {gustsText}
        </Text>
      </View>
    </View>
  );
}

function DewPointCard({
  value,
  unit,
}: {
  readonly value?: number;
  readonly unit: Unit;
}) {
  return (
    <MetricCard
      icon={Drop}
      label="Dew Point"
      value={value !== undefined ? formatTemp(value, unit) : '--'}
      sub="moisture"
    />
  );
}

function PressureCard({value}: {readonly value: number}) {
  return (
    <MetricCard
      icon={Speedometer}
      label="Pressure"
      value={`${Math.round(value)}`}
      sub="hPa"
    />
  );
}

interface Props {
  data: WeatherDetailMetrics;
  unit: Unit;
}

export default function DetailMetricsCard({data, unit}: Readonly<Props>) {
  const sunriseTime = data.sunrise ? formatLocalTime(data.sunrise) : '--';

  const sunsetTime = data.sunset ? formatLocalTime(data.sunset) : '--';

  const visKm =
    typeof data.visibility === 'number'
      ? `${(data.visibility / 1000).toFixed(1)} km`
      : data.visibility;

  return (
    <Card variant="compact">
      <Text
        className={`${TEXT_PRIMARY} ${SEMIBOLD} ${SIZE_LG} ${M_3} ${P_ROW_X}`}>
        Details
      </Text>

      <MetricRow
        left={
          <UvIndexCard
            index={Math.round(data.uvIndex)}
            max={Math.round(data.uvIndexMax)}
          />
        }
        right={
          <MetricCard
            icon={Clock}
            label="Sunrise"
            value={sunriseTime}
            sub={`Sunset ${sunsetTime}`}
          />
        }
      />

      <MetricRow
        left={
          <WindCard
            speed={data.windSpeed}
            direction={data.windDirection}
            gusts={data.windGusts}
          />
        }
        right={
          <MetricCard
            icon={Drop}
            label="Rainfall"
            value={`${Math.round(data.precipitationProbabilityMax)}%`}
            sub="precip"
          />
        }
      />

      <MetricRow
        left={
          <MetricCard
            icon={CloudSunny}
            label="Feels Like"
            value={formatTemp(data.apparentTemperature, unit)}
            sub={`${Math.round(data.precipitationProbabilityMax)}% precip`}
          />
        }
        right={
          <MetricCard
            icon={CloudDrizzle}
            label="Humidity"
            value={`${Math.round(data.humidity)}%`}
            sub="moisture"
          />
        }
      />

      <MetricRow
        left={<MetricCard icon={Eye} label="Visibility" value={visKm} sub="" />}
        right={
          <MetricCard
            icon={Cloud}
            label="Cloud Cover"
            value={data.cloudCover !== undefined ? `${data.cloudCover}%` : '--'}
            sub=""
          />
        }
      />

      <MetricRow
        left={<DewPointCard value={data.dewPoint} unit={unit} />}
        right={<PressureCard value={data.pressure} />}
      />
    </Card>
  );
}
