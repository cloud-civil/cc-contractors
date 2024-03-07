/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, Animated, StyleSheet, ActivityIndicator} from 'react-native';
import Colors from '../styles/Colors';

export const Skeleton = ({style}) => {
  const [opacity] = useState(new Animated.Value(1));
  const pulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  useEffect(() => {
    pulse();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulse, style, {opacity}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
  },
});

export const ImageLoadingSkeleton = ({width, height}) => {
  const style = {
    width: width || 60,
    height: height || 80,
    borderRadius: 8,
    backgroundColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View style={style}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
};
