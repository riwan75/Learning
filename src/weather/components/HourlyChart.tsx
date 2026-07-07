import {View, Text, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import type {HourlyDataPoint} from '../types';
import type {Unit} from '../utils/units';
import {Card, colors} from '../../design-system';

interface Props {
  data: HourlyDataPoint[];
  unit: Unit;
}

function formatHour(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}${ampm}`;
}

const screenWidth = Dimensions.get('window').width - 32;

export default function HourlyChart({data, unit}: Readonly<Props>) {
  if (data.length === 0) return null;

  const labels = data
    .filter((_, i) => i % 3 === 0)
    .map((d) => formatHour(d.time));
  const temps = data.map((d) =>
    unit === 'F' ? (d.temperature * 9) / 5 + 32 : d.temperature,
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: temps,
        color: () => 'rgba(255,255,255,0.8)',
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalCount: 0,
    color: () => 'rgba(255,255,255,0.3)',
    labelColor: () => 'rgba(255,255,255,0.7)',
    propsForDots: {r: '3', strokeWidth: '1', stroke: 'rgba(255,255,255,0.6)'},
    propsForBackgroundLines: {stroke: 'rgba(255,255,255,0.08)'},
    propsForLabels: {fontSize: 10},
  };

  return (
    <Card variant="compact">
      <Text
        className={`${colors.textPrimary} font-semibold text-lg mb-3 px-1`}>
        24-Hour Trend
      </Text>
      <LineChart
        data={chartData}
        width={screenWidth - 16}
        height={200}
        chartConfig={chartConfig}
        bezier
        withInnerLines
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        fromZero={false}
        segments={4}
        formatYLabel={(y) => `${Math.round(Number(y))}°`}
        style={{marginLeft: -8}}
      />
    </Card>
  );
}
