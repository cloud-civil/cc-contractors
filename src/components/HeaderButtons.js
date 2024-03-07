import {DrawerActions, useNavigation} from '@react-navigation/native';
// import {TouchableOpacity} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const MenuIcon = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(DrawerActions.toggleDrawer());
      }}
      style={{margin: 10}}>
      <FontAwesome6
        name="bars-staggered"
        //color={Colors.primary}
        style={{marginRight: 6}}
        size={20}
      />
    </TouchableOpacity>
  );
};

export const GoBack = ({onClick}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.3}
      style={{
        padding: 10,
        marginLeft: 6,
        elevation: 8,
        // backgroundColor: 'red',
      }}>
      <MaterialIcons
        name="arrow-back-ios"
        //color={Colors.primary}
        style={{marginRight: 6}}
        size={24}
      />
    </TouchableOpacity>
  );
};
