import {Dimensions, Text, View} from 'react-native';
import styles from '../../styles/styles';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Colors from '../../styles/Colors';

const VendorCard = ({item}) => {
  return (
    <View style={styles.card}>
      <View style={styles.assIcon}>
        <FontAwesome6Icon name="shop" color={Colors.textColor} size={22} />
      </View>
      <View
        style={{
          width: Dimensions.get('window').width * 0.7,
          marginLeft: 10,
        }}>
        <Text numberOfLines={1} style={styles.cardContentHeader}>
          {item.name}
        </Text>
      </View>
    </View>
  );
};

export default VendorCard;
