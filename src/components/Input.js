import {useState} from 'react';
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';

const Input = props => {
  const [isFocused, setFocused] = useState(false);

  return (
    <View style={{flex: 1}}>
      <View
        style={[
          styles.inputContainer,
          {
            borderWidth: isFocused ? 2 : 1,
            borderColor: isFocused ? 'black' : '#bbb',
          },
        ]}>
        <View
          style={[
            styles.label,
            {
              top: isFocused ? (Platform.OS === 'ios' ? -11 : -12) : -10,
              left: isFocused ? 10 : 11,
            },
          ]}>
          <View
            style={{
              backgroundColor: 'white',
              height: 3,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: isFocused ? 44 : 45,
            }}
          />
          <Text numberOfLines={1} style={{fontSize: 12, color: '#2d2d2d'}}>
            {props.label}
          </Text>
        </View>
        <TextInput
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            paddingHorizontal: isFocused ? 15 : 16,
            marginTop: isFocused ? 1 : 2,
            color: '#2d2d2d',
            flex: 1,
          }}
          selectionColor={'#ccc'}
        />
      </View>
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

export default Input;
