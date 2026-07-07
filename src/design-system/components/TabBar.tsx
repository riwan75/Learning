import {View, TouchableOpacity} from 'react-native';
import {Home2, Map, Heart} from 'iconsax-react-nativejs';
import {colors, radius} from '../tokens';

export default function TabBar() {
  return (
    <View
      className={`${colors.surface} ${radius.pill} mx-6 mb-4 px-6 py-3 flex-row justify-around items-center`}>
      <TouchableOpacity>
        <Home2 size={22} color="#fff" variant="Bold" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Map size={22} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Heart size={22} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>
    </View>
  );
}
