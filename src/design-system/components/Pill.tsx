import {View} from 'react-native';
import {colors, radius} from '../tokens';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function Pill({className = '', children}: Readonly<Props>) {
  return (
    <View
      className={`${colors.surface} ${radius.pill} flex-row overflow-hidden ${className}`.trim()}>
      {children}
    </View>
  );
}
