import {useState} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import styles from '../../../../styles/styles';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
// import {formateAmount} from '../../../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {ContractorBillPaymentModal} from './ContractorBillPaymentModal';
import FloatingButton from '../../../../components/FloatingButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CreateContractorBillModal from './CreateContractorBillModal';
import DateComponent from '../../../../components/DateComponent';

const ContractorBills = props => {
  const {
    activeContractor,
    project_id,
    setRender,
    contractorBills,
    paymentsByBillId,
    rates,
    loading,
  } = props;

  const contractor_id = activeContractor.contractor_id;
  const navigation = useNavigation();
  const [activity, setActivity] = useState({
    activeContractor: activeContractor,
    contractorPaymentModal: false,
    activeBill: null,
    createBill: false,
  });
  const tasks = useSelector(state => state.task.tasks[project_id]);
  const [showAddBillModal, setShowAddBillModal] = useState(false);

  const taskObject = tasks?.asObject;
  const crid = {};
  rates.forEach(x => {
    if (!crid[x.contractor_id]) {
      crid[x.contractor_id] = x;
    }
  });

  if (!crid[contractor_id] && !loading) {
    return (
      <View style={{margin: 10}}>
        <Text style={{marginVertical: 10, color: 'red', fontWeight: 'bold'}}>
          Contractor Rates not set.
        </Text>
        <View style={{flexDirection: 'row'}}>
          <CustomButton
            buttonStyle={{
              backgroundColor: Colors.primary,
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 6,
            }}
            onClick={() => {
              navigation.navigate('ContractorDetails', {
                activeContractor: activeContractor,
              });
            }}>
            <Text style={{color: 'white'}}>View Contractor</Text>
          </CustomButton>
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {!loading ? (
        <View style={{marginTop: 10}}>
          {contractorBills.length ? (
            <FlatList
              data={contractorBills}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 60}}
              renderItem={({item: bill}) => {
                return (
                  <View key={bill.bill_id} style={styles.card}>
                    <View style={{width: '100%'}}>
                      <View style={{flex: 4, padding: 3}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{fontWeight: 600, fontSize: 16}}>
                            {taskObject[bill.task_id].name}
                          </Text>
                          <DateComponent date={bill.created_at} />
                        </View>
                        <Text style={{marginTop: 2}}>
                          Bill Id: {bill.bill_id}
                        </Text>
                        <Text style={{marginTop: 2}}>
                          Unit: {bill.unit} {taskObject[bill.task_id].unit}
                        </Text>
                        <Text style={{marginTop: 2}}>
                          <Text style={{fontWeight: '600'}}>
                            {bill.amount.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Text>{' '}
                          INR after GST of {bill.gst}%.
                        </Text>
                      </View>
                      <View style={{marginTop: 6, marginBottom: 4}}>
                        {paymentsByBillId && paymentsByBillId[bill.bill_id] ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingVertical: 4,
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
                          <CustomButton
                            buttonStyle={{
                              backgroundColor: Colors.primary,
                              paddingVertical: 4,
                              paddingHorizontal: 12,
                              borderRadius: 6,
                            }}
                            onClick={() => {
                              setActivity({
                                ...activity,
                                contractorPaymentModal: true,
                                activeBill: {
                                  bill,
                                  task: taskObject[bill.task_id],
                                  netAmount: bill.amount,
                                },
                              });
                            }}>
                            <Text style={{color: 'white', textAlign: 'center'}}>
                              Initiate Payment
                            </Text>
                          </CustomButton>
                        )}
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View style={[styles.emptyTabView, {height: '98%'}]}>
              <Text>No bills created</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator size={30} color={Colors.primary} />
        </View>
      )}

      <FloatingButton onClick={() => setShowAddBillModal(true)}>
        <MaterialIcons name="receipt-long" color={'white'} size={28} />
      </FloatingButton>

      <CreateContractorBillModal
        {...props}
        setShowAddBillModal={setShowAddBillModal}
        showAddBillModal={showAddBillModal}
      />
      <ContractorBillPaymentModal
        activity={activity}
        setActivity={setActivity}
        setRender={setRender}
        project_id={project_id}
      />
    </View>
  );
};

export default ContractorBills;
