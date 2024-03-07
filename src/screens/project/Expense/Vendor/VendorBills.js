import {useState} from 'react';
import {useSelector} from 'react-redux';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {CustomButton} from '../../../../components/CustomButton';
import styles from '../../../../styles/styles';
import Colors from '../../../../styles/Colors';
import {VendorBillPaymentModal} from './VendorBillPaymentModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateComponent from '../../../../components/DateComponent';

const VendorBills = props => {
  const {
    activeVendor,
    project_id,
    reRender,
    setRender,
    vendorBills,
    paymentsByBillId,
    permission,
  } = props;
  const stocks__ = useSelector(state => state.stock.stocks[project_id]);
  const stocksAsObject = stocks__ && stocks__.asObject;

  const vendor_id = activeVendor.vendor_id;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeBill, setActiveBill] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  return (
    <View style={{paddingBottom: 40}}>
      {!loading ? (
        <View style={{marginTop: 10, marginBottom: 10}}>
          <FlatList
            data={Object.values(vendorBills)}
            renderItem={({item: bill}) => {
              const bill1 = bill[0];

              return (
                <View
                  key={bill.porder_id}
                  style={[
                    styles.card,
                    {flexDirection: 'column', alignItems: 'stretch'},
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flex: 1,
                      marginBottom: 10,
                    }}>
                    <Text style={{fontWeight: '600'}}>
                      Bill ID: {bill1.pgroup_id}
                    </Text>
                    <DateComponent date={bill1.created_at} />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      paddingVertical: 6,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}>
                    <Text style={{width: '25%'}}>Name</Text>
                    <Text style={{width: '25%'}}>Quantity</Text>
                    <Text style={{width: '25%'}}>Rate</Text>
                    <Text style={{width: '25%'}}>Discount</Text>
                  </View>
                  <FlatList
                    data={bill}
                    renderItem={({item: bill}) => {
                      const stock = stocksAsObject[bill.stock_id];
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            paddingVertical: 6,
                            borderBottomWidth: 1,
                            borderBottomColor: '#ccc',
                          }}>
                          <Text style={{width: '25%'}}>{stock.name}</Text>
                          <Text style={{width: '25%'}}>{bill.quantity}</Text>
                          <Text style={{width: '25%'}}>
                            {bill.rate || 'NA'}
                          </Text>
                          <Text style={{width: '25%'}}>
                            {bill.discount_price
                              ? `${bill.discount_price} INR`
                              : `${bill.discount_percent || 'NA'}%`}
                          </Text>
                        </View>
                      );
                    }}
                  />

                  {paymentsByBillId && paymentsByBillId[bill1.pgroup_id] ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 4,
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'green',
                          marginRight: 3,
                          fontWeight: 500,
                        }}>
                        Payment Initiated
                      </Text>
                      <MaterialCommunityIcons
                        name="check-decagram"
                        color={'green'}
                        size={14}
                      />
                    </View>
                  ) : (
                    <>
                      {permission.write && (
                        <CustomButton
                          buttonStyle={{
                            backgroundColor: Colors.primary,
                            paddingVertical: 4,
                            paddingHorizontal: 12,
                            borderRadius: 6,
                            marginTop: 10,
                          }}
                          onClick={() => {
                            setActiveBill({bill});
                            setShowPaymentModal(true);
                          }}>
                          <Text style={{color: 'white', textAlign: 'center'}}>
                            Initiate Payment
                          </Text>
                        </CustomButton>
                      )}
                    </>
                  )}
                </View>
              );
            }}
          />
          {/* {billState.length === 0 ? (
            <View style={styles.emptyTabView}>
              <Text>No bills created</Text>
            </View>
          ) : null} */}
        </View>
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}
      {showPaymentModal ? (
        <VendorBillPaymentModal
          reRender={reRender}
          setRender={setRender}
          showModal={showPaymentModal}
          setShowModal={setShowPaymentModal}
          activeBill={activeBill}
          project_id={project_id}
          vendor_id={vendor_id}
        />
      ) : null}
    </View>
  );
};

export default VendorBills;
