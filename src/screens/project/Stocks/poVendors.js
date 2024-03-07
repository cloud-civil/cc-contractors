import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import styles from '../../../styles/styles';
import {shallowEqual, useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import SizeButton from '../../../components/SizeButton';
import {getPermissions} from '../../../utils';
import {useNavigation} from '@react-navigation/native';
import VendorCard from '../../../components/cards/VendorCard';

const POVendors = props => {
  const {project_permissions, vendors} = props;
  const navigation = useNavigation();
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1016);
  const permission = x && JSON.parse(x.permission);
  const appReRender = useSelector(state => state.app.reRender, shallowEqual);

  return (
    <View style={styles.container} key={appReRender}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={vendors}
        renderItem={({item}) => (
          <SizeButton
            onClick={() => {
              navigation.navigate('PurchasedOrders', {
                props,
                activeVendor: item,
                project_permissions,
              });
            }}
            key={item.vendor_id}>
            <VendorCard item={item} />
          </SizeButton>
        )}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').height - 200,
            }}>
            <Text style={{textAlign: 'center'}}>
              There is no vendor to show{'\n'} purchase order.
            </Text>
          </View>
        }
      />
      {permission && !permission.read && (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text>Don&apos;t have permission to view tasks stocks.</Text>
        </View>
      )}
    </View>
  );
};

export default POVendors;
