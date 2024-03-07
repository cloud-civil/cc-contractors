import {StyleSheet, View} from 'react-native';
import SizeButton from './SizeButton';
import Colors from '../styles/Colors';

const FloatingButton = ({
  size = 56,
  onClick,
  buttonColor,
  buttonStyle,
  children,
}) => {
  return (
    <View style={[styles.floatingButton, buttonStyle]}>
      <SizeButton
        scale={0.8}
        buttonStyle={{
          backgroundColor: buttonColor || Colors.primary,
          width: size,
          height: size,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={onClick}>
        {children}
      </SizeButton>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingButton;
