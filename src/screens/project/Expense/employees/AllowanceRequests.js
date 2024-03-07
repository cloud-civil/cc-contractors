/* eslint-disable react-hooks/exhaustive-deps */
import React, {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import styles from '../../../../styles/styles';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import ApproveAllowanceRequestModal from './ApproveAllowanceRequestModal';
import PayAllowanceRequestModal from './PayAllowanceRequestModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const initData = {
  approveModal: false,
  payModal: false,
  activeRequest: null,
  totalApprovedAmount: '',
  payAmount: '',
  approve_id: '',
};

const AllowanceRequests = props => {
  const {project_id} = props;
  const token = useSelector(state => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequets] = useState([]);
  const [activity, setActivity] = useState(initData);
  const [reRender, setRender] = useState(0);

  const usersAsObject = useSelector(state => state.app.users.asObject);

  useEffect(() => {
    axiosInstance(token)
      .get(
        `/expense/getAllUserAllowanceRequestsOfProject?project_id=${project_id}`,
      )
      .then(({data}) => {
        setRequets(data.data);
        setIsLoading(false);
      });
  }, [reRender]);

  return (
    <View>
      {!isLoading && (
        <FlatList
          data={requests}
          renderItem={({item: request}) => {
            let approved = 0;
            const metadata = request.metadata
              ? JSON.parse(request.metadata)
              : [];
            metadata.forEach(m => {
              approved += m.amount;
            });
            return (
              <View style={[styles.card, {padding: 10}]}>
                <View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      width: '100%',
                      borderBottomWidth: metadata.length ? 1 : 0,
                      borderBottomColor: '#ccc',
                      paddingBottom: metadata.length ? 10 : 0,
                    }}>
                    <View style={[styles.assIcon, {width: 34, height: 34}]}>
                      <MaterialCommunityIcons
                        name="credit-card-clock"
                        size={24}
                        color={'white'}
                      />
                    </View>
                    <View style={{marginLeft: 10}}>
                      <Text style={{fontWeight: 600}}>
                        {usersAsObject[request.user_id].fname}{' '}
                        {usersAsObject[request.user_id].lname}
                      </Text>
                      <Text>
                        Requested Amount:{' '}
                        <Text style={{fontWeight: 'bold', marginTop: 3}}>
                          {request.amount || 0} INR
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 'auto',
                      }}>
                      {/* {userAllowancePem.write && ( */}
                      <CustomButton
                        buttonStyle={{
                          backgroundColor: Colors.primary,
                          borderRadius: 4,
                          paddingVertical: 4,
                          paddingHorizontal: 8,
                        }}
                        onClick={() => {
                          setActivity({
                            ...activity,
                            activeRequest: request,
                            approveModal: true,
                            totalApprovedAmount: approved,
                          });
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#fff',
                            textAlign: 'right',
                          }}>
                          Approve
                        </Text>
                      </CustomButton>
                      {/* )} */}
                    </View>
                  </View>
                  <FlatList
                    data={metadata}
                    renderItem={({item, index}) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 10,
                            borderBottomWidth:
                              metadata.length - 1 === index ? 0 : 1,
                            borderBottomColor: '#ccc',
                          }}>
                          <Text>
                            {item.status === 102
                              ? 'Paid: '
                              : 'Approved Amount: '}{' '}
                            {item.amount} INR
                          </Text>

                          <View>
                            {item.status === 102 ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'center',
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
                            {item.status === 100 ? (
                              <CustomButton
                                buttonStyle={{
                                  backgroundColor: Colors.primary,
                                  borderRadius: 4,
                                  paddingVertical: 4,
                                  width: 50,
                                }}
                                onClick={() => {
                                  setActivity({
                                    ...activity,
                                    payModal: true,
                                    activeRequest: request,
                                    payAmount: item.amount,
                                    approve_id: item.id,
                                  });
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: '#fff',
                                    textAlign: 'center',
                                  }}>
                                  Pay
                                </Text>
                              </CustomButton>
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
          ListEmptyComponent={() => {
            return (
              <View style={[styles.emptyTabView, {height: 400}]}>
                <Text>No allowance request.</Text>
              </View>
            );
          }}
        />
      )}
      {isLoading && (
        <View style={{flex: 1, marginTop: '50%'}}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}

      <ApproveAllowanceRequestModal
        setRender={setRender}
        activity={activity}
        setActivity={setActivity}
      />
      <PayAllowanceRequestModal
        project_id={project_id}
        activity={activity}
        setActivity={setActivity}
        setRender={setRender}
      />
    </View>
  );
};

export default AllowanceRequests;
