/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import styles from '../../../styles/styles';
import {GoBack} from '../../../components/HeaderButtons';
import {useDispatch, useSelector} from 'react-redux';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {setTasks} from '../../../cc-hooks/src/taskSlice';
import Vendors from './Vendor/VendorExpense';
import Contractors from './contractor/ContractorExpense';
import Employees from './EmployeeExpense';
import Myprofile from './profile/MyProfile';
import {useNavigation} from '@react-navigation/native';
import Tabs from '../../../components/Tabs';
import {getPermissions} from '../../../utils';

const ExpenseScreen = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {project_id} = route.params;
  const token = useSelector(state => state.auth.token);
  const vendors = useSelector(state => state.app.vendors);
  const userOrg = useSelector(state => state.auth.org);
  const pems = useSelector(
    state => state.project.permissions[route.params.project_id],
  );
  const pems_ = getPermissions(pems, [1004, 1005, 1006, 1008, 1009]);
  const permissions = {
    userBalancePem: pems_[1004],
    userAllowancePem: pems_[1005],
    userExpensePem: pems_[1006],
    vendorPaymentsPem: pems_[1008],
    vendorBillsPem: pems_[1009],
  };
  console.log(pems_);

  const contractors = useSelector(state => state.app.contractors.asArray);
  const hooksData = {
    vendors,
    userOrg,
    contractors,
    project_id,
  };
  const tabs = ['Vendors', 'Contractors', 'Employees', 'Profile'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getTasksByProjectId?project_id=${project_id}`)
      .then(({data}) => {
        dispatch(setTasks({project_id, data: data.data}));
      })
      .catch(err => console.error(err));

    axiosInstance(token)
      .get(
        `/expense/vendor/getAllVendorsBalanceOfProject?project_id=${project_id}`,
      )
      .then(({data}) => {
        const __balances = {};
        data.data.forEach(vendor => {
          __balances[vendor.vendor_id] = vendor;
        });
        // console.log('__balances', __balances, data.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <View>
      <View style={styles.statusBar} />
      <View style={styles.headerContainer}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            Expense
          </Text>
        </View>
      </View>
      <View style={{padding: 10}}>
        <Tabs
          data={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          numOfTab={4}
          minusWidth={20}
        />

        <View style={{paddingTop: 10}}>
          {activeTab === tabs[0] ? (
            <Vendors hooksData={hooksData} project_id={project_id} />
          ) : null}
          {activeTab === tabs[1] ? <Contractors hooksData={hooksData} /> : null}
          {activeTab === tabs[2] ? (
            <Employees
              project_id={project_id}
              permissions={permissions}
              hooksData={hooksData}
            />
          ) : null}
          {activeTab === tabs[3] ? (
            <Myprofile permissions={permissions} project_id={project_id} />
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default ExpenseScreen;
