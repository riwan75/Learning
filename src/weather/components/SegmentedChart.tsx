import {useState} from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import {LineChart, BarChart} from 'react-native-chart-kit';
import type {HourlyDataPoint} from '../types';
import type {Unit} from '../utils/units';
import {formatLocalTime} from '../utils/time';
import {Card, Pill} from '../../design-system';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_SUBTLE,
  BG_ACCENT,
  BG_CHART_OVERLAY,
  CHART_BG,
  CHART_GRID_LINE,
  CHART_LABEL,
  CHART_AXIS,
  CHART_FILL_FROM,
  CHART_FILL_TO,
  CHART_DOT_FILL,
  CHART_LINE,
  CHART_PRECIP_LINE,
  CHART_PRECIP_BAR,
  CHART_PRECIP_FILL_FROM,
  CHART_PRECIP_FILL_TO,
} from '../../styles/Color';
import {SIZE_LG, SIZE_XS, SEMIBOLD} from '../../styles/Fonts';
import {
  M_2,
  M_3,
  MT_NEG_1,
  P_ROW_X,
  P_SM_TAG_X,
  P_PILL_Y,
} from '../../styles/Spacing';
import {CHART_HEIGHT, RADIUS_DETAIL} from '../../styles/Sizing';

type Metric = 'temperature' | 'precipProbability' | 'precipitation';

const METRICS: {key: Metric; label: string}[] = [
  {key: 'temperature', label: 'Temp'},
  {key: 'precipProbability', label: 'Rain %'},
  {key: 'precipitation', label: 'Precip mm'},
];

interface Props {
  data: HourlyDataPoint[];
  unit: Unit;
}

function formatHour(iso: string): string {
  return formatLocalTime(iso, undefined, {
    hour: 'numeric',
    hour12: true,
  });
}

const screenWidth = Dimensions.get('window').width - 32;
const chartBaseStyle = {marginLeft: 0, borderRadius: 22};

export default function SegmentedChart({data, unit}: Readonly<Props>) {
  const [metric, setMetric] = useState<Metric>('temperature');

  if (data.length === 0) return null;

  const labels = data
    .filter((_, i) => i % 3 === 0)
    .map((d) => formatHour(d.time));

  const subtitleMap: Record<Metric, string> = {
    temperature: 'Hourly Temperature',
    precipProbability: 'Hourly Rain Probability',
    precipitation: 'Hourly Precipitation (mm)',
  };

  const baseChartConfig = {
    backgroundColor: CHART_BG,
    backgroundGradientFrom: CHART_BG,
    backgroundGradientTo: CHART_BG,
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    decimalCount: 0,
    color: () => CHART_AXIS,
    labelColor: () => CHART_LABEL,
    propsForBackgroundLines: {stroke: CHART_GRID_LINE},
    propsForLabels: {fontSize: 10, fontWeight: '600'},
  };

  const renderChart = () => {
    if (metric === 'precipitation') {
      const values = data.map((d) => d.precipitation ?? 0);
      return (
        <BarChart
          data={{
            labels,
            datasets: [{data: values}],
          }}
          width={screenWidth - 16}
          height={CHART_HEIGHT}
          yAxisLabel=""
          yAxisSuffix="mm"
          chartConfig={{
            ...baseChartConfig,
            color: () => CHART_PRECIP_BAR,
            fillShadowGradientFrom: CHART_PRECIP_FILL_FROM,
            fillShadowGradientTo: CHART_PRECIP_FILL_TO,
          }}
          fromZero
          withHorizontalLabels
          withVerticalLabels
          segments={4}
          showBarTops={false}
          style={chartBaseStyle}
        />
      );
    }

    const values = data.map((d) => {
      if (metric === 'precipProbability') return d.precipitationProbability;
      return unit === 'F' ? (d.temperature * 9) / 5 + 32 : d.temperature;
    });

    const color =
      metric === 'precipProbability'
        ? () => CHART_PRECIP_LINE
        : () => CHART_LINE;

    return (
      <LineChart
        data={{
          labels,
          datasets: [{data: values, color, strokeWidth: 2}],
        }}
        width={screenWidth - 16}
        height={CHART_HEIGHT}
        chartConfig={{
          ...baseChartConfig,
          propsForDots: {r: '4', strokeWidth: '2', stroke: CHART_DOT_FILL},
          fillShadowGradientFrom: CHART_FILL_FROM,
          fillShadowGradientTo: CHART_FILL_TO,
        }}
        bezier
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLabels
        withVerticalLabels
        withHorizontalLines={false}
        fromZero={metric === 'precipProbability'}
        segments={4}
        formatYLabel={(y) =>
          metric === 'precipProbability'
            ? `${Math.round(Number(y))}%`
            : `${Math.round(Number(y))}°`
        }
        style={chartBaseStyle}
      />
    );
  };

  return (
    <Card variant="compact">
      <View
        className={`flex-row justify-between items-center ${M_2} ${P_ROW_X}`}>
        <Text className={`${TEXT_PRIMARY} ${SEMIBOLD} ${SIZE_LG}`}>
          24-Hour Trend
        </Text>
        <Pill>
          {METRICS.map((m) => (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMetric(m.key)}
              className={`${P_SM_TAG_X} ${P_PILL_Y} ${
                metric === m.key
                  ? `${BG_ACCENT} ${TEXT_PRIMARY} ${SEMIBOLD}`
                  : ''
              }`}>
              <Text
                className={`${SIZE_XS} ${
                  metric === m.key ? `${TEXT_PRIMARY} ${SEMIBOLD}` : TEXT_MUTED
                }`}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Pill>
      </View>
      <Text
        className={`${TEXT_SUBTLE} ${SIZE_XS} ${M_3} ${P_ROW_X} ${MT_NEG_1}`}>
        {subtitleMap[metric]}
      </Text>
      <View className={`overflow-hidden ${RADIUS_DETAIL} ${BG_CHART_OVERLAY}`}>
        {renderChart()}
      </View>
    </Card>
  );
}
