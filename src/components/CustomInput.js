import {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

const CustomInput = props => {
  const value = props.value || '';
  const [isFocused, setFocused] = useState(false);

  const inputOnBlur = () => {
    setFocused(false);
  };

  const inputOnFocus = () => {
    setFocused(true);
  };

  const translateAnimation = useAnimatedStyle(() => {
    return {
      top: withTiming(isFocused || value !== '' ? -12 : 10, {
        duration: 150,
      }),
    };
  });

  return (
    <View
      style={[
        styles.inputContainer,
        {
          borderWidth: isFocused || value !== '' ? 2 : 1,
          borderColor: isFocused || value !== '' ? 'black' : '#666',
        },
      ]}>
      <Animated.View
        key={props.value}
        style={[
          translateAnimation,
          styles.label,
          {left: isFocused || value !== '' ? 9 : 10},
        ]}>
        <View
          style={{
            backgroundColor: 'white',
            height: 3,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 43,
          }}
        />
        <Text style={{zIndex: 10}}>Rate</Text>
      </Animated.View>
      <TextInput
        {...props}
        onFocus={inputOnFocus}
        onBlur={inputOnBlur}
        style={{paddingHorizontal: 16}}
        selectionColor={'#ccc'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    marginVertical: 10,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  label: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 6,
  },
});

export default CustomInput;
