import {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {GoBack} from '../../../../components/HeaderButtons';
import SizeButton from '../../../../components/SizeButton';
import {useNavigation} from '@react-navigation/native';
import Tabs from '../../../../components/Tabs';
import DateComponent from '../../../../components/DateComponent';
import styles from '../../../../styles/styles';

const UserBalance = ({route}) => {
  const {activeUser, project_id, userAllowancePem, userExpensePem} =
    route.params;
  const navigation = useNavigation();
  const allowancePermission =
    userAllowancePem && JSON.parse(userAllowancePem.permission);
  const expensePermission =
    userExpensePem && JSON.parse(userExpensePem.permission);
  const {user, balance} = activeUser;
  const token = useSelector(state => state.auth.token);
  const tabs = ['Allowances', 'Expenses'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [allowances, setAllowances] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axiosInstance(token)
      .get(`/expense/user/${project_id}/${user.user_id}/getUserAllowances`)
      .then(({data}) => {
        setAllowances(data.data);
      })
      .catch(err => console.error('getUserAllowances', err));
  }, []);

  useEffect(() => {
    axiosInstance(token)
      .get(`/expense/user/${project_id}/${user.user_id}/getUserExpenses`)
      .then(({data}) => {
        setExpenses(data.data);
      })
      .catch(err => console.error('getUserExpenses', err));
  }, []);

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
            User Allowance And Expenses
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
          marginBottom: 8,
        }}>
        {user.fname} {user.lname}
      </Text>
      <View style={{marginBottom: 10}}>
        <Text>
          Balance:{' '}
          <Text style={{fontWeight: 'bold', fontSize: 14}}>
            {balance.balance} INR
          </Text>
        </Text>
      </View>
      <Tabs
        data={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        numOfTab={2}
        minusWidth={20}
      />
      {activeTab === 'Allowances' &&
      allowancePermission &&
      allowancePermission.read ? (
        <View style={{marginTop: 10}}>
          <FlatList
            data={allowances}
            renderItem={({item: all}) => {
              return (
                <SizeButton key={all.allowance_id}>
                  <View style={styles.card}>
                    <View style={styles.assIcon}>
                      <MaterialCommunityIcons
                        name="credit-card-check"
                        size={26}
                        color={'white'}
                      />
                    </View>
                    <View style={{marginLeft: 10}}>
                      <Text style={{fontWeight: 'bold'}}>
                        {all.allowance} INR
                      </Text>
                    </View>
                    <View style={{marginLeft: 'auto'}}>
                      <DateComponent date={all.created_at} />
                    </View>
                  </View>
                </SizeButton>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View style={[styles.emptyTabView, {height: 400}]}>
                  <Text>No allowances</Text>
                </View>
              );
            }}
          />
        </View>
      ) : activeTab === 'Allowances' ? (
        <View style={styles.emptyTabView}>
          <Text>No permission to view allowances.</Text>
        </View>
      ) : null}
      {activeTab === 'Expenses' &&
      expensePermission &&
      expensePermission.read ? (
        <View style={{marginTop: 10}}>
          <FlatList
            data={expenses}
            renderItem={({item: all}) => (
              <SizeButton key={all.expense_id} style={styles.card}>
                <View style={styles.card}>
                  <View style={styles.assIcon}>
                    <MaterialCommunityIcons
                      name="credit-card-minus"
                      size={26}
                      color={'white'}
                    />
                  </View>
                  <View style={{marginLeft: 15}}>
                    <Text style={{fontWeight: 'bold'}}>{all.expense} INR</Text>
                  </View>
                  <View style={{marginLeft: 'auto'}}>
                    <DateComponent date={all.created_at} />
                  </View>
                </View>
              </SizeButton>
            )}
            ListEmptyComponent={() => {
              return (
                <View style={[styles.emptyTabView, {height: 400}]}>
                  <Text>No expenses</Text>
                </View>
              );
            }}
          />
        </View>
      ) : activeTab === 'Expenses' ? (
        <View style={styles.emptyTabView}>
          <Text>No permission to view expenses.</Text>
        </View>
      ) : null}
    </View>
  );
};

export default UserBalance;
