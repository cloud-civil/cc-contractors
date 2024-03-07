import {View, Text, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import styles from '../../../styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateComponent from '../../../components/DateComponent';

const VendorPayments = ({filteredVendorData}) => {
  const vendorsObject = useSelector(state => state.app.vendors.asObject);

  if (filteredVendorData?.length === 0) {
    return (
      <View style={styles.emptyTabView}>
        <Text>Vendor Payments empty.</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={filteredVendorData}
        renderItem={({item}) => {
          return (
            <View style={styles.card}>
              <View style={styles.assIcon}>
                <MaterialIcons name="payment" size={24} color={'white'} />
              </View>
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 600, marginBottom: 2}}>
                  {vendorsObject[item.vendor_id].name}
                </Text>
                <Text>{item.amount} INR</Text>
              </View>
              <View style={{marginLeft: 'auto'}}>
                <DateComponent date={item.created_at} />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default VendorPayments;
