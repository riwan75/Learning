import {ImageBackground} from 'react-native';

const bgSrc = require('../../../Images/mainBackground.png');

interface Props {
  children: React.ReactNode;
}

export default function BackgroundImage({children}: Readonly<Props>) {
  return (
    <ImageBackground source={bgSrc} className="flex-1" resizeMode="cover">
      {children}
    </ImageBackground>
  );
}
