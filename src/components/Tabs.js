import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Colors from '../styles/Colors';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Tabs = ({
  data,
  numOfTab,
  activeTab,
  setActiveTab,
  minusWidth,
  badge,
  badgeColor,
  badgebackgroundColor,
  tabWidth,
  backgroundColor,
  icons,
}) => {
  const customStyle = StyleSheet.create({
    activeTab: {
      paddingBottom: 6,
      paddingTop: 14,
      color: Colors.primary,
      width:
        tabWidth ||
        (Dimensions.get('window').width -
          (minusWidth !== undefined ? minusWidth : 40)) /
          numOfTab,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tab: {
      paddingTop: 14,
      paddingBottom: 7,
      width:
        tabWidth ||
        (Dimensions.get('window').width -
          (minusWidth !== undefined ? minusWidth : 40)) /
          numOfTab,
    },
    activeTabText: {
      color: Colors.primary,
      textAlign: 'center',
      fontWeight: '500',
    },
    tabText: {textAlign: 'center', fontWeight: '500'},
    badgeView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: badgebackgroundColor,
      width: 16,
      height: 16,
      borderRadius: 30,
      marginLeft: 6,
    },
    badgeContent: {
      color: badgeColor,
      fontSize: 10,
    },
  });

  const screenWidth = Dimensions.get('window').width - (minusWidth || 0);
  const fullTabWidth = tabWidth ? tabWidth : screenWidth / numOfTab;

  const translateAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: withTiming(fullTabWidth * data.indexOf(activeTab))},
      ],
    };
  });

  return (
    <>
      {activeTab && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            maxHeight: icons
              ? Platform.OS === 'android'
                ? 64
                : 60
              : Platform.OS === 'android'
              ? 42
              : 39.5,
            backgroundColor: backgroundColor,
          }}>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              maxHeight: icons
                ? Platform.OS === 'android'
                  ? 64
                  : 60
                : Platform.OS === 'android'
                ? 42
                : 39.5,
              minWidth: screenWidth,
            }}>
            <View style={{flexDirection: 'row'}}>
              {data.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.5}
                    onPress={() => {
                      setActiveTab(item);
                    }}
                    style={
                      activeTab === item
                        ? customStyle.activeTab
                        : customStyle.tab
                    }>
                    {icons && (
                      <Text
                        style={[
                          activeTab === item
                            ? customStyle.activeTabText
                            : customStyle.tabText,
                          {
                            maxHeight: Platform.OS === 'android' ? 21 : 20,
                          },
                        ]}>
                        {icons[index]}
                      </Text>
                    )}
                    <View style={customStyle.labelContainer}>
                      <Text
                        style={
                          activeTab === item
                            ? customStyle.activeTabText
                            : customStyle.tabText
                        }>
                        {item}
                      </Text>
                      {badge && badge[index] ? (
                        <View style={customStyle.badgeView}>
                          <Text style={customStyle.badgeContent}>
                            {badge[index]}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Animated.View
              style={[
                {width: fullTabWidth, marginBottom: -1},
                translateAnimation,
              ]}>
              <View
                style={{
                  height: 2,
                  width: fullTabWidth - 20,
                  backgroundColor: Colors.primary,
                  marginHorizontal: 10,
                }}
              />
            </Animated.View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default Tabs;
