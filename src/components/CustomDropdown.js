/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useEffect, useMemo, useState} from 'react';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CustomDropdown = ({
  label = 'Select Item',
  value,
  data,
  onSelect,
  renderDisplayItem = item => item,
  style,
  disabled,
  search,
}) => {
  const [activity, setActivity] = useState({
    isExpand: false,
    selectedItem: null,
    searchTerm: '',
  });

  const filteredData = useMemo(() => {
    return data.filter(item =>
      renderDisplayItem(item)
        .toLowerCase()
        .includes(activity.searchTerm.toLowerCase()),
    );
  }, [activity.searchTerm, data]);

  const contentHeight = useMemo(() => {
    return Math.min(filteredData.length, 4) * 40 || 40;
  }, [filteredData]);

  useEffect(() => {
    if (value) setActivity(prev => ({...prev, selectedItem: value}));
  }, [value]);

  const translateAnimation = useAnimatedStyle(() => {
    return {
      height: withTiming(
        activity.isExpand ? (search ? contentHeight + 44 : contentHeight) : 0,
        {
          duration: 200,
        },
      ),
    };
  });

  const renderItem = (item, idx) => {
    const selectedText = renderDisplayItem(item);
    return (
      <View
        key={idx}
        style={{
          borderBottomWidth: filteredData.length - 1 === idx ? 0 : 0.6,
          borderBottomColor: '#ccc',
        }}>
        <TouchableOpacity
          onPress={() => {
            onSelect && onSelect(item);
            setActivity(prev => ({
              ...prev,
              isExpand: false,
              selectedItem: selectedText,
              searchTerm: '',
            }));
          }}>
          <View style={styles.itemStyle}>
            <Text style={{textTransform: 'capitalize'}}>{selectedText}</Text>
            {activity.selectedItem == selectedText && (
              <MaterialIcons name="check-circle" color={'#aaa'} size={20} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[{flex: 1}, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          !disabled &&
          setActivity(prev => ({...prev, isExpand: !activity.isExpand}))
        }
        style={[
          styles.inputContainer,
          {
            borderWidth: activity.isExpand ? 2 : 1,
            borderColor: activity.isExpand ? 'black' : '#bbb',
          },
        ]}>
        {activity.selectedItem && (
          <View
            style={[
              styles.label,
              {
                top: activity.isExpand
                  ? Platform.OS === 'ios'
                    ? -11
                    : -12
                  : -10,
                left: activity.isExpand ? 10 : 11,
              },
            ]}>
            <View
              style={[
                styles.labelAdjustment,
                {bottom: activity.isExpand ? 44 : 45},
              ]}
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: disabled ? '#aaa' : '#2d2d2d',
                textTransform: 'capitalize',
              }}>
              {label}
            </Text>
          </View>
        )}
        <View key={activity.selectedItem || value} style={styles.selectedText}>
          <Text
            style={{
              color: disabled ? '#aaa' : '#2d2d2d',
              textTransform: 'capitalize',
              marginLeft: 6,
            }}>
            {activity.selectedItem || label}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={22} color={'#666'} />
        </View>
      </TouchableOpacity>
      <Animated.View
        style={[
          translateAnimation,
          styles.animatedView,
          {marginBottom: activity.isExpand ? 10 : 4},
        ]}>
        {search && (
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search..."
              style={{flex: 1}}
              value={activity.searchTerm}
              onChangeText={text =>
                setActivity(prev => ({...prev, searchTerm: text}))
              }
            />
            <TouchableOpacity style={{paddingHorizontal: 8}}>
              <MaterialIcons name="search" size={18} />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView>
          {filteredData && filteredData.length ? (
            filteredData.map(renderItem)
          ) : (
            <View style={[styles.noItem, {height: contentHeight}]}>
              <Text>No items</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    marginTop: 4,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  label: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 6,
  },
  selectedText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    width: '99%',
    paddingLeft: 10,
    paddingRight: 6,
  },
  itemStyle: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  animatedView: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginTop: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    margin: 4,
    height: 36,
    borderRadius: 6,
  },
  noItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelAdjustment: {
    backgroundColor: 'white',
    height: 3,
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

export default CustomDropdown;
