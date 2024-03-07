import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Input from './Input';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../styles/Colors';

const LocationComponent = props => {
  const {location, setLocation} = props;
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    if (Platform.OS === 'android') {
      await requestLocationPermission();
    }
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        fetchAddressFromCoordinates(latitude, longitude);
      },
      error => console.log(error.message),
      {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000},
    );
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.address) {
        const street = data.address.road || '';
        const city = data.address.city || '';
        const state = data.address.state || '';
        const country = data.address.country || '';
        const address = `${street ? street + ', ' : ''}${
          city ? city + ', ' : ''
        }${state ? state + ', ' : ''}${country ? country + ', ' : ''}`;
        setLoading(false);
        setLocation({...location, address: address});
      } else {
        console.log('Error fetching address');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{flex: 1}}>
        <Input
          editable={false}
          selection={{start: 0}}
          value={location.address}
          label="Location"
        />
      </View>
      {!isLoading ? (
        <TouchableOpacity onPress={getLocation}>
          <View
            style={{
              width: 48,
              paddingLeft: 10,
            }}>
            <MaterialIcons
              name="my-location"
              color={Colors.primary}
              size={30}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={{width: 48}}>
          <ActivityIndicator color={Colors.primary} size={24} />
        </View>
      )}
    </View>
  );
};

export default LocationComponent;
