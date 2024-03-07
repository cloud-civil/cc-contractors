import {StyleSheet, Text, View} from 'react-native';
import Colors from '../styles/Colors';

const KeyValueCard = ({name, value, icon, backgroundColor, width, style}) => {
  const styles = StyleSheet.create({
    quantityCard: {
      backgroundColor: backgroundColor || '#f2f2f2',
      paddingVertical: 2,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      width: width || 'auto',
      borderWidth: 1,
      borderColor: '#ccc',
    },
    quantityCardBorder: {
      marginRight: 6,
      backgroundColor: Colors.primary,
      width: 1.5,
      height: 28,
      borderRadius: 10,
    },
    quantityCardHeading: {
      paddingBottom: 2,
    },
  });
  return (
    <View style={[styles.quantityCard, style]}>
      <View
        style={{
          margin: 10,
          width: 24,
          height: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {icon}
      </View>
      <View style={{marginVertical: 6, width: '70%'}}>
        <Text
          numberOfLines={2}
          style={{
            fontWeight: '600',
            fontSize: 14,
            marginBottom: 4,
          }}>
          {value}
        </Text>
        <Text numberOfLines={1} style={{fontSize: 12, color: '#666'}}>
          {name}
        </Text>
      </View>
    </View>
  );
};

export default KeyValueCard;
