import {Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatDate} from '../utils';

const DateComponent = ({date, style}) => {
  if (date === null || date === undefined) return null;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
        style,
      ]}>
      <MaterialCommunityIcons
        // name="clock-time-three-outline"
        name="calendar-month-outline"
        size={14}
        color="#333"
      />
      <Text style={{color: '#333', marginLeft: 4}}>{formatDate(date)}</Text>
    </View>
  );
};

export default DateComponent;
