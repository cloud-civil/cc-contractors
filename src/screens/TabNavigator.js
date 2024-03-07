import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './home/HomeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../styles/Colors';
import AssetScreen from './org-assets/AssetScreen';
import SettingsScreen from './settings/SettingsScreen';
import {Platform} from 'react-native';
import UserScreen from './org-users/UserScreen';
import VendorScreen from './vendors-and-contractors/VendorScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const tabBarStyle =
    Platform.OS === 'android' ? {height: 64, paddingTop: 6} : {paddingTop: 6};

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: tabBarStyle,
        headerShown: false,
        tabBarLabelStyle: {
          marginBottom: Platform.OS === 'android' ? 14 : -4,
          fontWeight: 500,
          fontSize: 11,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => icons.home(focused),
        }}
      />
      <Tab.Screen
        name="Users"
        component={UserScreen}
        options={{
          tabBarLabel: 'User',
          tabBarIcon: ({focused}) => icons.user(focused),
        }}
      />
      <Tab.Screen
        name="Assets"
        component={AssetScreen}
        options={{
          tabBarLabel: 'Assets',
          tabBarIcon: ({focused}) => icons.assets(focused),
        }}
      />
      <Tab.Screen
        name="Vendors"
        component={VendorScreen}
        options={{
          tabBarLabel: 'Vendors',
          tabBarIcon: ({focused}) => icons.vendor(focused),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({focused}) => icons.settings(focused),
        }}
      />
    </Tab.Navigator>
  );
};

const icons = {
  home: focused => (
    <Ionicons
      name={focused ? 'home' : 'home-outline'}
      color={focused ? Colors.primary : '#555'}
      size={26}
    />
  ),
  user: focused => (
    <MaterialIcons
      name={focused ? 'person' : 'person-outline'}
      color={focused ? Colors.primary : '#555'}
      size={26}
    />
  ),
  assets: focused => (
    <MaterialCommunityIcons
      name={focused ? 'chart-box' : 'chart-box-outline'}
      color={focused ? Colors.primary : '#555'}
      size={26}
    />
  ),
  vendor: focused => (
    <MaterialCommunityIcons
      name={focused ? 'truck' : 'truck-outline'}
      color={focused ? Colors.primary : '#555'}
      size={26}
    />
  ),
  settings: focused => (
    <Ionicons
      name={focused ? 'settings' : 'settings-outline'}
      color={focused ? Colors.primary : 'black'}
      size={26}
    />
  ),
};

export default TabNavigator;
