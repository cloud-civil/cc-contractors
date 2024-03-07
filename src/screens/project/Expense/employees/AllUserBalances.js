/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {ActivityIndicator, Alert, FlatList, Text, View} from 'react-native';
import SizeButton from '../../../../components/SizeButton';
import styles from '../../../../styles/styles';
import {useNavigation} from '@react-navigation/native';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import {useEffect, useState} from 'react';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import AddAllowanceModal from './AddAllowanceModal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AllUserBalances = props => {
  // eslint-disable-next-line no-unused-vars
  const {users, userAllowancePem, project_id} = props;
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);
  const [userBalances, setUserBalances] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [reRender, setRender] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance(token)
      .get(`/expense/user/getAllUsersBalanceOfProject?project_id=${project_id}`)
      .then(({data}) => {
        const uBalances = {};
        data.data.forEach(item => {
          uBalances[item.user_id] = item;
        });
        setUserBalances(uBalances);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('getAllUsersBalanceOfProject', err);
      });
  }, [reRender]);

  return (
    <View>
      {!isLoading && users && (
        <FlatList
          data={users}
          renderItem={({item: user}) => {
            const balance = userBalances[user.user_id];
            return (
              <SizeButton
                key={user.user_id}
                onClick={() => {
                  if (balance) {
                    navigation.navigate('user_balance', {
                      activeUser: {user, balance},
                    });
                  } else {
                    Alert.alert(
                      'No Balance',
                      'Please initialize balance first.',
                    );
                  }
                }}>
                <View style={styles.card}>
                  <View style={styles.assIcon}>
                    <Ionicons name="wallet-outline" size={24} color={'white'} />
                  </View>
                  <View
                    style={{
                      marginLeft: 10,
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Text>
                        {user.fname} {user.lname}
                      </Text>
                      <Text style={{fontSize: 12, marginTop: 2}}>
                        <Text style={{fontWeight: 'bold'}}>Balance:</Text>{' '}
                        {balance ? balance.balance : 0} INR
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
                          setUser(user);
                          setShowModal(true);
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#fff',
                            textAlign: 'right',
                          }}>
                          Add Advance
                        </Text>
                      </CustomButton>
                      {/* )} */}
                    </View>
                  </View>
                </View>
              </SizeButton>
            );
          }}
          ListEmptyComponent={() => {
            return (
              <View style={[styles.emptyTabView, {height: 400}]}>
                <Text>No user to show balance.</Text>
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

      <AddAllowanceModal
        showModal={showModal}
        setShowModal={setShowModal}
        user={user}
        setRender={setRender}
        project_id={project_id}
      />
    </View>
  );
};

export default AllUserBalances;
