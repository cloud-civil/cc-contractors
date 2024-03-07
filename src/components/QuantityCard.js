import {StyleSheet, Text, View} from 'react-native';
import Colors from '../styles/Colors';
import {formateAmount} from '../utils';

const QuantityCard = ({headline, quantity, unit, backgroundColor, width}) => {
  const styles = StyleSheet.create({
    quantityCard: {
      marginRight: 10,
      backgroundColor: backgroundColor || '#f2f2f2',
      paddingVertical: 2,
      paddingHorizontal: 10,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      width: width || 'auto',
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
    <View style={styles.quantityCard}>
      <View style={styles.quantityCardBorder} />
      <View style={{marginVertical: 6, marginRight: 10}}>
        <Text numberOfLines={1} style={{fontWeight: 600}}>
          {headline}
        </Text>
        <Text numberOfLines={1}>
          {quantity && formateAmount(quantity)} {unit}
        </Text>
      </View>
    </View>
  );
};

export default QuantityCard;
