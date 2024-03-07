import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import styles from '../../../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateComponent from '../../../../components/DateComponent';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import {useState} from 'react';
import {ApproveContractorBillModal} from './ApproveContractorBillModal';
import {PayContractorBillModal} from './PayContractorBillModal';

const ContractorPayments = props => {
  const {paymentsByBillId, activeContractor, loading} = props;
  const [activity, setActivity] = useState({
    approveBill: null,
    approveModal: true,
    contractor_id: activeContractor.contractor_id,
    payModal: false,
    activePayBill: null,
  });

  return (
    <View style={{marginTop: 10}}>
      {!loading ? (
        <>
          {Object.values(paymentsByBillId).length ? (
            <FlatList
              data={Object.values(paymentsByBillId)}
              contentContainerStyle={{paddingBottom: 150}}
              showsVerticalScrollIndicator={false}
              renderItem={({item: bills, index}) => {
                return (
                  <View key={index} style={styles.card}>
                    <View style={{padding: 4}}>
                      <Text style={{fontWeight: 600}}>Bill Id: {index}</Text>
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
                                borderBottomWidth:
                                  bills.length - 1 === id ? 0 : 1,
                                borderBottomColor: '#ccc',
                              }}>
                              <View>
                                <Text>
                                  {item.status === 101 ? 'Bill Amount: ' : ''}
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
                                  <View style={[styles.tag, {marginLeft: 5}]}>
                                    <MaterialCommunityIcons
                                      name="check-decagram"
                                      size={14}
                                      color="#fff"
                                    />
                                    <Text style={styles.tagText}>Complete</Text>
                                  </View>
                                ) : null}
                                {item.status === 101 ? (
                                  <CustomButton
                                    buttonStyle={{
                                      backgroundColor: Colors.primary,
                                      borderRadius: 4,
                                      paddingVertical: 4,
                                      width: 80,
                                    }}
                                    onClick={() => {
                                      setActivity({
                                        ...activity,
                                        approveBill: item,
                                        approveModal: true,
                                      });
                                    }}>
                                    <Text
                                      style={{
                                        color: 'white',
                                        textAlign: 'center',
                                      }}>
                                      Approve
                                    </Text>
                                  </CustomButton>
                                ) : null}

                                {item.status === 102 ? (
                                  <CustomButton
                                    buttonStyle={{
                                      backgroundColor: Colors.primary,
                                      borderRadius: 4,
                                      paddingVertical: 4,
                                      width: 80,
                                    }}
                                    onClick={() => {
                                      setActivity({
                                        ...activity,
                                        activePayBill: item,
                                        payModal: true,
                                      });
                                    }}>
                                    <Text
                                      style={{
                                        color: 'white',
                                        textAlign: 'center',
                                      }}>
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
          ) : (
            <View style={styles.emptyTabView}>
              <Text>No payments done</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator size={30} color={Colors.primary} />
        </View>
      )}
      {activity.approveBill && (
        <ApproveContractorBillModal
          {...props}
          activity={activity}
          setActivity={setActivity}
        />
      )}
      {activity.activePayBill && (
        <PayContractorBillModal
          {...props}
          activity={activity}
          setActivity={setActivity}
        />
      )}
    </View>
  );
};

export default ContractorPayments;
