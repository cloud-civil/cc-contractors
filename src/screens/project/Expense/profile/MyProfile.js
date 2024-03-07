/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import styles from '../../../../styles/styles';
import AddExpenseModal from './AddExpenseModal';
import Tabs from '../../../../components/Tabs';
import MyRequest from './MyRequest';
import MyExpense from './MyExpense';
import RequestAllowanceModal from './RequestAllowanceModal';

const tabs = ['My Expenses', 'My Requests'];

const Myprofile = ({project_id}) => {
  const token = useSelector(state => state.auth.token);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [expenses, setExpenses] = useState(null);
  const [requests, setRequets] = useState([]);
  const [state, setState] = useState({
    userBalance: null,
    expense: '',
    title: '',
    modalOpen: false,
    requestAllowance: false,
  });
  const [reRender, setReRender] = useState(0);
  const authUser = useSelector(state => state.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    Promise.all([
      axiosInstance(token).get(
        `/expense/user/getUserExpenses?project_id=${project_id}&user_id=${authUser.user_id}`,
      ),
      axiosInstance(token).get(
        `/expense/user/getUserBalanceOfProject?project_id=${project_id}&user_id=${authUser.user_id}`,
      ),
      axiosInstance(token).get(
        `/expense/getAllUserAllowanceRequests?project_id=${project_id}&user_id=${authUser.user_id}`,
      ),
    ])
      .then(([response1, response2, response3]) => {
        setExpenses(response1.data.data);
        setState({
          ...state,
          userBalance: response2.data.data,
        });
        setIsLoading(false);
        setRequets(response3.data.data);
      })
      .catch(err => {
        console.log(err, 'Expense My Profile');
      });
  }, [reRender]);

  return (
    <View key={reRender}>
      {!isLoading ? (
        <View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              paddingBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{}}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>Balance</Text>
              <Text style={{marginTop: 4}}>
                &#8377; {state.userBalance ? state.userBalance.balance : 0}
              </Text>
            </View>
            <View>
              <CustomButton
                buttonStyle={{
                  backgroundColor: Colors.primary,
                  borderRadius: 8,
                  marginTop: 6,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                }}
                onClick={() => setShowModal(true)}>
                <Text style={{color: '#fff', fontSize: 12, marginRight: 3}}>
                  Add expense
                </Text>
                <MaterialIcons
                  name="currency-rupee"
                  color={'white'}
                  size={12}
                  style={{marginTop: 2}}
                />
              </CustomButton>
              <CustomButton
                buttonStyle={{
                  backgroundColor: Colors.primary,
                  borderRadius: 8,
                  marginTop: 6,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                }}
                onClick={() => setShowRequestModal(true)}>
                <Text style={{color: '#fff', fontSize: 12, marginRight: 3}}>
                  Request Allowance
                </Text>
                <MaterialIcons
                  name="currency-rupee"
                  color={'white'}
                  size={12}
                  style={{marginTop: 2}}
                />
              </CustomButton>
            </View>
          </View>
          <View style={{marginBottom: 10}}>
            <Tabs
              data={tabs}
              numOfTab={3}
              minusWidth={20}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </View>

          {activeTab === tabs[0] ? <MyExpense expenses={expenses} /> : null}
          {activeTab === tabs[1] ? <MyRequest requests={requests} /> : null}
        </View>
      ) : (
        <View style={[styles.emptyTabView, {height: 500}]}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}

      <AddExpenseModal
        showModal={showModal}
        setShowModal={setShowModal}
        project_id={project_id}
        setReRender={setReRender}
        state={state}
        setState={setState}
      />

      <RequestAllowanceModal
        showModal={showRequestModal}
        setShowModal={setShowRequestModal}
        project_id={project_id}
        setReRender={setReRender}
        state={state}
        setState={setState}
      />
    </View>
  );
};

export default Myprofile;
