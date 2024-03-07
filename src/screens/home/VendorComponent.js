import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import styles from '../../styles/styles';
import Colors from '../../styles/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const VendorComponent = ({vendors, navigation}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: -20,
        }}>
        <View style={styles.headerContent}>
          <Text style={styles.heading}>Vendors</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Vendors')}>
          <Text style={{color: Colors.primary, fontWeight: '500'}}>
            View all
          </Text>
        </TouchableOpacity>
      </View>
      {vendors && vendors.asArray && vendors.asArray.length > 0 && (
        <FlatList
          data={vendors.asArray.slice(0, 5)}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <View key={item.vendor_id} style={styles.card}>
                <View style={styles.assIcon}>
                  <MaterialIcons
                    name="person"
                    color={Colors.textColor}
                    size={28}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardContentHeader}>{item.name}</Text>
                  <Text>{item.phone}</Text>
                </View>
                <View style={styles.cardButton}>
                  <TouchableOpacity activeOpacity={0.6}>
                    <MaterialCommunityIcons
                      name="phone"
                      color={Colors.primary}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default VendorComponent;
