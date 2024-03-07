import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import styles from '../../styles/styles';
import Colors from '../../styles/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AssetComponent = ({assets, navigation}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: -10,
        }}>
        <View style={styles.headerContent}>
          <Text style={styles.heading}>My Assets</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Assets')}>
          <Text style={{color: Colors.primary, fontWeight: '500'}}>
            View all
          </Text>
        </TouchableOpacity>
      </View>
      {assets && assets.asArray && assets.asArray.length > 0 && (
        <FlatList
          data={assets.asArray.slice(0, 5)}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <View key={item.asset_id} style={styles.card}>
                <View style={styles.assIcon}>
                  <MaterialCommunityIcons
                    name="fire-truck"
                    color={Colors.textColor}
                    size={28}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardContentHeader}>
                    {item.name} #{item.serial_no}
                  </Text>
                  <Text>
                    Rented at {item.rate}
                    {item.usage === 'daily' ? '/day' : '/month'}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default AssetComponent;
