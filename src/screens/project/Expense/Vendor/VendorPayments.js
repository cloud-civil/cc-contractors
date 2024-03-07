import {FlatList, Text, View} from 'react-native';
import styles from '../../../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import DateComponent from '../../../../components/DateComponent';
import {useState} from 'react';
import {ApproveVendorBillModal} from './ApproveVendorBillmodal';
import {PayVendorBillModal} from './PayVendorBillModal';

const VendorPayments = ({
  paymentsByBillId,
  setRender,
  project_id,
  permission,
}) => {
  const [activeItem, setActiveItem] = useState(null);
  const [showApproveBillModal, setShowApproveBillModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  return (
    <View style={{marginTop: 10}}>
      <FlatList
        data={Object.values(paymentsByBillId)}
        renderItem={({item: bills, index}) => {
          return (
            <View key={index} style={styles.card}>
              <View style={{padding: 4}}>
                <Text style={{fontWeight: 600}}>
                  Bill Id: {bills[0].bill_id}
                </Text>
                <FlatList
                  data={bills}
                  renderItem={({item, index: id}) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '100%',
                          paddingVertical: 10,
                          borderBottomWidth: bills.length - 1 === id ? 0 : 1,
                          borderBottomColor: '#ccc',
                        }}>
                        <View>
                          <Text>
                            Amount:{' '}
                            <Text style={{fontWeight: 600}}>
                              {item.amount.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </Text>{' '}
                            INR
                          </Text>
                          <DateComponent
                            date={item.created_at}
                            style={{marginTop: 4}}
                          />
                        </View>
                        <View style={{marginLeft: 'auto'}}>
                          {item.status === 105 ? (
                            <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                              Payment Completed
                            </Text>
                          ) : null}
                          {item.status === 101 && permission.verify ? (
                            <CustomButton
                              buttonStyle={{
                                backgroundColor: Colors.primary,
                                borderRadius: 4,
                                paddingVertical: 4,
                                width: 80,
                              }}
                              onClick={() => {
                                setActiveItem(item);
                                setShowApproveBillModal(true);
                              }}>
                              <Text
                                style={{color: 'white', textAlign: 'center'}}>
                                Approve
                              </Text>
                            </CustomButton>
                          ) : null}

                          {item.status === 102 && permission.write ? (
                            <CustomButton
                              buttonStyle={{
                                backgroundColor: Colors.primary,
                                borderRadius: 4,
                                paddingVertical: 4,
                                width: 80,
                              }}
                              onClick={() => {
                                setActiveItem(item);
                                setShowPayModal(true);
                              }}>
                              <Text
                                style={{color: 'white', textAlign: 'center'}}>
                                Pay
                              </Text>
                            </CustomButton>
                          ) : null}

                          {item.status === 103 ? (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                paddingVertical: 4,
                              }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: 'green',
                                  marginRight: 3,
                                }}>
                                Paid
                              </Text>
                              <MaterialCommunityIcons
                                name="check-decagram"
                                color={'green'}
                                size={14}
                              />
                            </View>
                          ) : null}
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          );
        }}
      />
      {Object.values(paymentsByBillId).length === 0 ? (
        <View style={[styles.emptyTabView, {marginTop: -134}]}>
          <Text>No payments done</Text>
        </View>
      ) : null}
      {activeItem && (
        <ApproveVendorBillModal
          activeItem={activeItem}
          showModal={showApproveBillModal}
          setShowModal={setShowApproveBillModal}
          setRender={setRender}
          project_id={project_id}
        />
      )}
      {activeItem && (
        <PayVendorBillModal
          activeItem={activeItem}
          showModal={showPayModal}
          setShowModal={setShowPayModal}
          setRender={setRender}
          project_id={project_id}
        />
      )}
    </View>
  );
};

export default VendorPayments;
