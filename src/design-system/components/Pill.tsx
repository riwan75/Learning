import {View} from 'react-native';
import {BG_SURFACE} from '../../styles/Color';
import {RADIUS_PILL} from '../../styles/Sizing';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function Pill({className = '', children}: Readonly<Props>) {
  return (
    <View
      className={`${BG_SURFACE} ${RADIUS_PILL} flex-row overflow-hidden ${className}`.trim()}>
      {children}
    </View>
  );
}
