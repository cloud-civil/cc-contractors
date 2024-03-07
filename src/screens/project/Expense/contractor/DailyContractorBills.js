import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import SizeButton from '../../../../components/SizeButton';
import styles from '../../../../styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import {formateAmount} from '../../../../utils';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateComponent from '../../../../components/DateComponent';

const DailyContractorBills = props => {
  const {project_id} = props;
  const token = useSelector(state => state.auth.token);
  const authUser = useSelector(state => state.auth.user);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reRender, setRender] = useState(0);

  useEffect(() => {
    axiosInstance(token)
      .get(`/expense/contractor/${project_id}/getContractorAttendanceBills`)
      .then(res => {
        setBills(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [reRender]);

  const payBill = (bill, amount) => {
    axiosInstance(token)
      .post('/payContractorAndWorkersBill', {
        attendance_id: bill.attendance_id,
        amount,
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Bill paid succesfully.',
        });
        setRender(prev => prev + 1);
      })
      .catch(err => {
        console.log(
          err,
          '/expense/contractor/${project_id}/getContractorAttendanceBills',
          err?.response?.data?.message,
        );
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Coud not pay the bill.',
        });
      });
  };

  const approveBill = bill => {
    axiosInstance(token)
      .post('/expense/contractor/verifyBill', {
        attendance_id: bill.attendance_id,
        verification: JSON.stringify({
          verified: true,
          verified_by: authUser.user_id,
        }),
      })
      .then(() => {
        setBills(prevState => {
          return prevState.map(x => {
            if (x.attendance_id === bill.attendance_id) {
              return {
                ...x,
                verification: JSON.stringify({
                  verified: true,
                  verified_by: authUser.user_id,
                }),
              };
            }
            return x;
          });
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Bill Verified succesfully.',
        });
        setRender(prev => prev + 1);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to verify Bill.',
        });
        console.log(
          err,
          '/expense/contractor/verifyBill',
          err?.response?.data?.message,
        );
      });
  };

  return (
    <View style={{marginTop: 10}}>
      {isLoading ? (
        <View style={styles.emptyTabView}>
          <ActivityIndicator isLoading={isLoading} color={Colors.primary} />
        </View>
      ) : (
        <>
          <FlatList
            data={bills}
            renderItem={({item}) => {
              const metadata = JSON.parse(item.metadata);
              const verification = JSON.parse(item.verification);
              return (
                <SizeButton key={item.payment_id} scale={1}>
                  <View style={styles.card}>
                    <View style={styles.assIcon}>
                      <MaterialIcons
                        name="receipt-long"
                        color={'white'}
                        size={26}
                      />
                    </View>
                    <View style={{marginLeft: 15, flex: 4}}>
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>
                          {formateAmount(metadata.totalAmount)} INR
                        </Text>{' '}
                        Payable
                      </Text>
                      <DateComponent
                        date={item.created_at}
                        style={{marginTop: 3}}
                      />
                    </View>
                    <View>
                      {verification.verified ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 'auto',
                          }}>
                          <MaterialCommunityIcons
                            name="check-decagram"
                            color={'green'}
                          />
                          <Text
                            style={{
                              color: 'green',
                              fontSize: 13,
                              marginLeft: 4,
                              fontWeight: '600',
                            }}>
                            Approved
                          </Text>
                        </View>
                      ) : null}
                      {!verification.verified ? (
                        <CustomButton
                          buttonStyle={{
                            backgroundColor: Colors.primary,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 4,
                          }}
                          onClick={() => {
                            approveBill(item, setBills);
                          }}>
                          <Text style={{textAlign: 'center', color: 'white'}}>
                            Approve
                          </Text>
                        </CustomButton>
                      ) : null}

                      {item.status === 'verified' ? (
                        <CustomButton
                          buttonStyle={{
                            backgroundColor: Colors.primary,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 4,
                          }}
                          onClick={() => {
                            payBill(item, metadata.totalAmount);
                          }}>
                          <Text style={{textAlign: 'center', color: 'white'}}>
                            Pay
                          </Text>
                        </CustomButton>
                      ) : null}
                    </View>
                  </View>
                </SizeButton>
              );
            }}
          />
          {bills.length === 0 ? (
            <View style={[styles.emptyTabView, {marginTop: -180}]}>
              <Text>No daily bill</Text>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
};

export default DailyContractorBills;
