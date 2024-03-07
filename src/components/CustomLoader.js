// import {StatusBar} from 'expo-status-bar';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';

const CustomLoader = ({loading, text}) => {
  if (!loading) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      {/* <StatusBar style="dark" /> */}
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    // backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    color: '#3498db',
  },
});

export default CustomLoader;
