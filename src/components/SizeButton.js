import {useRef} from 'react';
import {Animated} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const SizeButton = ({
  children,
  buttonStyle,
  onClick,
  handleLongPress,
  scale,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: scale ? scale : 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      onPress={onClick}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[{transform: [{scale: scaleValue}]}, buttonStyle]}
      activeOpacity={1}>
      {children}
    </TouchableOpacity>
  );
};

export default SizeButton;
