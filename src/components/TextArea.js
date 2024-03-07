import {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

const TextArea = props => {
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
            {top: isFocused ? -11 : -10, left: isFocused ? 10 : 11},
          ]}>
          <View
            style={{
              backgroundColor: 'white',
              height: 3,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: isFocused ? 83 : 84,
            }}
          />
          <Text style={{fontSize: 12, color: '#2d2d2d'}}>{props.label}</Text>
        </View>
        <TextInput
          {...props}
          multiline={true}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            paddingHorizontal: isFocused ? 15 : 16,
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
    height: 88,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  label: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 6,
  },
});

export default TextArea;
