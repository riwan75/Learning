import {TouchableOpacity} from 'react-native';
import {BG_SURFACE} from '../../styles/Color';
import {RADIUS_PILL} from '../../styles/Sizing';
import {P_CARD} from '../../styles/Spacing';

interface Props {
  onPress: () => void;
  children: React.ReactNode;
}

export default function IconButton({onPress, children}: Readonly<Props>) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${BG_SURFACE} ${RADIUS_PILL} ${P_CARD}`}>
      {children}
    </TouchableOpacity>
  );
}
