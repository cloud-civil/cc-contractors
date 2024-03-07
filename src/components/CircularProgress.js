import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ProgressRing} from 'react-native-progress-ring';
import Colors from '../styles/Colors';

const CircularProgress = ({progress}) => {
  const length = progress.toString().length;
  const valueStyle = {left: length === 1 ? 42 : length === 2 ? 38 : 36};

  return (
    <View style={customStyle.container}>
      <ProgressRing
        size={100}
        trackWidth={6}
        progress={!progress ? 100 : progress}
        trackColor={!progress ? '#eee' : Colors.primary}
        // containerStyle={{backgroundColor: 'white'}}
        // backgroundColor="white"
        inActiveTrackColor="white"
      />
      <View style={[customStyle.valueContainer, valueStyle]}>
        <Text style={customStyle.value}>{progress || 0}%</Text>
      </View>
    </View>
  );
};

const customStyle = StyleSheet.create({
  container: {position: 'relative'},
  valueContainer: {
    position: 'absolute',
    top: 44,
  },
  value: {fontWeight: 600, fontSize: 12},
});

export default CircularProgress;
