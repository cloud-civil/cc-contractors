import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import styles from '../../../../styles/styles';
import SizeButton from '../../../../components/SizeButton';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

const Vendors = ({project_id}) => {
  const navigation = useNavigation();
  const vendors = useSelector(state => state.app.vendors.asArray);

  return (
    <View style={{}}>
      {
        <FlatList
          data={vendors}
          renderItem={({item: vendor}) => {
            if (vendor.type === 'contractor') {
              return null;
            }
            return (
              <SizeButton
                key={vendor.vendor_id}
                onClick={() => {
                  navigation.navigate('vendor_bill', {
                    project_id,
                    activeVendor: vendor,
                  });
                }}>
                <View style={styles.card}>
                  <View style={styles.assIcon}>
                    <FontAwesome6Icon name="shop" size={24} color={'white'} />
                  </View>
                  <Text style={{marginLeft: 10}}>{vendor.name}</Text>
                </View>
              </SizeButton>
            );
          }}
          ListEmptyComponent={() => {
            return (
              <View style={[styles.emptyTabView, {height: 400}]}>
                <Text>There is no vendor.</Text>
              </View>
            );
          }}
        />
      }
    </View>
  );
};

export default Vendors;
