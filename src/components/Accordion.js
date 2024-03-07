import {useState} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Accordion = ({header, content, contentHeight, containerStyle}) => {
  const [isExpand, setExpand] = useState(false);

  const translateAnimation = useAnimatedStyle(() => {
    return {
      height: withTiming(isExpand ? contentHeight : 0, {
        duration: 200,
      }),
    };
  });

  const rotateAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {rotate: withTiming(isExpand ? '180deg' : '0deg', {duration: 200})},
      ],
    };
  });

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={() => {
          setExpand(!isExpand);
        }}
        activeOpacity={0.7}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {header}
          <View style={{marginLeft: 'auto', marginRight: 10}}>
            <Animated.View style={rotateAnimation}>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={28}
                color={'#bbb'}
              />
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
      <Animated.View style={[translateAnimation, {overflow: 'hidden'}]}>
        {content}
      </Animated.View>
    </View>
  );
};

export default Accordion;
