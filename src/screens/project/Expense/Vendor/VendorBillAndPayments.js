import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import {GoBack} from '../../../../components/HeaderButtons';
import styles from '../../../../styles/styles';
import VendorBills from './VendorBills';
import {useNavigation} from '@react-navigation/native';
import Tabs from '../../../../components/Tabs';
import VendorPayments from './VendorPayments';

const tabs = ['Payments', 'Bills'];

const VendorBillsAndPayments = ({route}) => {
  const {activeVendor, project_id, vendorBillsPem, vendorPaymentsPem} =
    route.params;
  const navigation = useNavigation();
  const paymentPermission =
    vendorPaymentsPem && JSON.parse(vendorPaymentsPem.permission);
  const billPermission =
    vendorBillsPem && JSON.parse(vendorBillsPem.permission);

  const token = useSelector(state => state.auth.token);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [reRender, setRender] = useState(0);
  const [paymentsByBillId, setPaymentsByBillId] = useState([]);
  const [vendorBills, setVendorBills] = useState([]);

  useEffect(() => {
    console.log('changed');
    callApi();
    callApi2();
  }, [reRender]);

  const callApi = () => {
    axiosInstance(token)
      .get(
        `/expense/vendor/${project_id}/${activeVendor.vendor_id}/getVendorPayments`,
      )
      .then(({data}) => {
        const ll = {};
        data.data.forEach(p => {
          if (!ll[p.bill_id]) {
            ll[p.bill_id] = [p];
          } else {
            ll[p.bill_id].push(p);
          }
        });
        setPaymentsByBillId(ll);
      })
      .catch(() => {});
  };

  const callApi2 = () => {
    axiosInstance(token)
      .get(
        `/expense/vendor/${project_id}/${activeVendor.vendor_id}/getMaterialVendorBills`,
      )
      .then(({data}) => {
        const vBills = data.data.reduce((result, currentItem) => {
          const groupId =
            currentItem.pgroup_id === null
              ? currentItem.porder_id
              : currentItem.pgroup_id;

          if (!result[groupId]) {
            result[groupId] = [];
          }

          result[groupId].push(currentItem);

          return result;
        }, {});

        setVendorBills(vBills);
      })
      .catch(() => {});
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 34}} />
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: -10,
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            Vendor Bill And Payments
          </Text>
        </View>
      </View>
      <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 8}}>
        {activeVendor.name}
      </Text>
      {/* <View style={{marginBottom: 10}}>
        <Text>
          Total amount paid :{' '}
          <Text style={{fontWeight: 'bold', fontSize: 14}}>
            {formateAmount(totalPaid) || 0} INR
          </Text>
        </Text>
      </View> */}

      <Tabs
        data={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        numOfTab={2}
        minusWidth={20}
        badgeColor={'white'}
        badgebackgroundColor={'red'}
      />

      {activeTab === tabs[0] && paymentPermission && paymentPermission.read ? (
        <VendorPayments
          paymentsByBillId={paymentsByBillId}
          setRender={setRender}
          project_id={project_id}
          permission={paymentPermission}
        />
      ) : activeTab === tabs[0] ? (
        <View style={styles.emptyTabView}>
          <Text>No permissions to view payments</Text>
        </View>
      ) : null}
      {activeTab === tabs[1] && billPermission && billPermission.read ? (
        <VendorBills
          activeVendor={activeVendor}
          project_id={project_id}
          reRender={reRender}
          setRender={setRender}
          vendorBills={vendorBills}
          paymentsByBillId={paymentsByBillId}
          permission={billPermission}
        />
      ) : activeTab === tabs[1] ? (
        <View style={styles.emptyTabView}>
          <Text>No permissions to view bills</Text>
        </View>
      ) : null}
    </View>
  );
};

export default VendorBillsAndPayments;
