import {View} from 'react-native';
import {CARD} from '../variants';

type Variant = keyof typeof CARD;

interface Props {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export default function Card({
  variant = 'compact',
  className = '',
  children,
}: Readonly<Props>) {
  const base = CARD[variant] ?? CARD.compact;
  return <View className={`${base} ${className}`.trim()}>{children}</View>;
}
