import {TouchableOpacity} from 'react-native';
import {colors, radius} from '../tokens';

interface Props {
  onPress: () => void;
  children: React.ReactNode;
}

export default function IconButton({onPress, children}: Readonly<Props>) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${colors.surface} ${radius.pill} p-3`}>
      {children}
    </TouchableOpacity>
  );
}
