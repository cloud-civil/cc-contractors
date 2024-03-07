import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../styles/Colors';
import Animated, {
  useAnimatedStyle,
  //   withSpring,
  withTiming,
} from 'react-native-reanimated';

export const MaterialTopTab = ({state, descriptors, navigation, icons}) => {
  const screenWidth = Dimensions.get('window').width;
  const numOfTabs = state.routes.length;
  const tabWidth = screenWidth / numOfTabs;

  const translateAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(tabWidth * state.index)}],
    };
  });

  return (
    <>
      <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}>
              <View
                style={{
                  padding: 10,
                  width: screenWidth / state.routes.length,
                }}>
                {icons ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: isFocused ? Colors.primary : 'black',
                    }}>
                    {icons?.[index]}
                  </Text>
                ) : null}
                <Text
                  style={{
                    textAlign: 'center',
                    color: isFocused ? Colors.primary : 'black',
                  }}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <Animated.View
        style={[
          {width: tabWidth},
          translateAnimation,
          styles.slidingTabContainer,
        ]}>
        <View
          style={{
            height: 2,
            width: tabWidth - 20,
            backgroundColor: Colors.primary,
            marginHorizontal: 10,
          }}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  slidingTabContainer: {},
});
