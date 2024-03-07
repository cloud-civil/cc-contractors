import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseToast, ErrorToast} from 'react-native-toast-message';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={styles.baseToast}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  text1: {
    fontSize: 15,
  },
  text2: {
    fontSize: 13,
  },
  baseToast: {borderLeftColor: 'green'},
});

export default toastConfig;
