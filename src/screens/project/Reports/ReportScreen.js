/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import styles from '../../../styles/styles';
import {GoBack} from '../../../components/HeaderButtons';
import {useSelector} from 'react-redux';
import {getPermissions} from '../../../utils';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import PODelivery from './PODelivery';
import VendorPayments from './VendorPayments';
import UserExpense from './UserExpenses';
import StockUsage from './StockUsage';
import Tasks from './TasksReport';
import {Menu, PaperProvider} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from 'react-native-ui-datepicker';
import CustomModal from '../../../components/CustomModal';
import {useNavigation} from '@react-navigation/native';
import Tabs from '../../../components/Tabs';

const tabs = [
  'Stock Usage',
  'Tasks Done',
  'User Expense',
  'PO Delivery',
  'Vendor Pay',
];

const currentDate = new Date();

const ReportScreen = ({route}) => {
  const {project_id} = route.params;
  const navigation = useNavigation();
  const pems = useSelector(state => state.auth.permissions);
  const token = useSelector(state => state.auth.token);
  const x = getPermissions(pems, 1026);
  const permission = x && JSON.parse(x.permission);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [stockData, setStockData] = useState([]);
  const [vendorPaymentData, setVendorPaymentData] = useState([]);
  const [PODeliveryData, setPODeliveryData] = useState([]);
  const [userExpenseData, setUserExpenseData] = useState([]);

  const [dateFilter, setDateFilter] = useState('');
  const [start_date, setStartDate] = useState(
    new Date().setDate(currentDate.getDate() - 7),
  );
  const [end_date, setEndDate] = useState(currentDate);
  const [showMenu, setShowMenu] = React.useState(false);
  const [isStartDateVisible, setStartDateVisible] = useState(false);
  const [isEndDateVisible, setEndDateVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const targetPdfRefStock = useRef();
  const targetPdfReftasks = useRef();
  const targetPdfRefVendorPayment = useRef();
  const targetPdfRefPODelivery = useRef();
  const targetPdfRefUserExpense = useRef();

  useEffect(() => {
    getStocksByProjectId();
    getVendorPaymentByProjectId();
    getPODeliveryByProjectId();
    getUserExpenseProjectId();
  }, []);

  async function getStocksByProjectId() {
    const response = await axiosInstance(token).get(
      `/getAllStockUsageReportByProjectId?project_id=${project_id}`,
    );
    setStockData(response.data.data);
    setLoading(false);
  }

  async function getVendorPaymentByProjectId() {
    const response = await axiosInstance(token).get(
      `/getAllVendorPayment?project_id=${project_id}`,
    );
    setVendorPaymentData(response.data.data);
  }

  async function getPODeliveryByProjectId() {
    const response = await axiosInstance(token).get(
      `/getAllPurchasedOrderByProjectId?project_id=${project_id}`,
    );
    setPODeliveryData(response.data.data);
  }

  async function getUserExpenseProjectId() {
    const response = await axiosInstance(token).get(
      `/getAllUserExpense?project_id=${project_id}`,
    );
    setUserExpenseData(response.data.data);
  }

  const formatDate = date => {
    try {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      } else if (typeof date === 'string') {
        return new Date(date).toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Error formatting date:', error);
    }
    return '';
  };

  const filterTableData = (data, filterType, start_date = null) => {
    const today = new Date().toISOString().split('T')[0];
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    return data.filter(item => {
      try {
        const itemDate = item.created_at ? new Date(item.created_at) : null;

        if (itemDate && isNaN(itemDate.getTime())) {
          console.error(`Invalid date format for item: ${item.updated_at}`);
          return false; // Skip items with invalid date formats
        }

        if (filterType === 'today') {
          return itemDate && formatDate(itemDate) === today;
        } else if (filterType === 'last7days') {
          return itemDate && itemDate > last7Days;
        } else if (filterType === 'custom' && start_date) {
          const customDateStart = new Date(start_date);
          const customDateEnd = new Date(end_date);
          customDateEnd.setDate(customDateEnd.getDate() + 1);

          return (
            itemDate && itemDate >= customDateStart && itemDate < customDateEnd
          );
        }

        return true;
      } catch (error) {
        console.error('Error processing date:', error);
        return false; // Skip items with errors in date processing
      }
    });
  };

  const filteredStockData = filterTableData(stockData, dateFilter, start_date);
  const filteredVendorData = filterTableData(
    vendorPaymentData,
    dateFilter,
    start_date,
  );
  const filteredPODeliveryData = filterTableData(
    PODeliveryData,
    dateFilter,
    start_date,
  );
  const filteredUserExpenseData = filterTableData(
    userExpenseData,
    dateFilter,
    start_date,
  );

  if (permission && permission.read) {
    return (
      <PaperProvider>
        <View style={{}}>
          <View style={{backgroundColor: 'white'}}>
            <View style={styles.statusBar} />
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <GoBack onClick={() => navigation.goBack()} />
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '500',
                    color: '#3e3e3e',
                  }}>
                  Reports
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 'auto',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                <RenderCustomDateField
                  dateFilter={dateFilter}
                  isEndDateVisible={isEndDateVisible}
                  setEndDateVisible={setEndDateVisible}
                  isStartDateVisible={isStartDateVisible}
                  setStartDateVisible={setStartDateVisible}
                  end_date={end_date}
                  start_date={start_date}
                  formatDate={formatDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                />
                <MenuComponent
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  setDateFilter={setDateFilter}
                />
              </View>
            </View>

            <Tabs
              data={tabs}
              numOfTab={3.6}
              minusWidth={20}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              icons={icons}
            />
          </View>
          <View style={{padding: 10}}>
            <View style={{height: '92%'}}>
              {activeTab === tabs[0] ? (
                <StockUsage
                  loading={loading}
                  project_id={project_id}
                  targetPdfRefStock={targetPdfRefStock}
                  formatDate={formatDate}
                  stockData={stockData}
                  filteredStockData={filteredStockData}
                  setStockData={setStockData}
                />
              ) : null}
              {activeTab === tabs[1] ? (
                <Tasks
                  targetPdfReftasks={targetPdfReftasks}
                  project_id={project_id}
                />
              ) : null}
              {activeTab === tabs[2] ? (
                <UserExpense
                  filteredUserExpenseData={filteredUserExpenseData}
                  targetPdfRefUserExpense={targetPdfRefUserExpense}
                  formatDate={formatDate}
                />
              ) : null}
              {activeTab === tabs[3] ? (
                <PODelivery
                  project_id={project_id}
                  targetPdfRefPODelivery={targetPdfRefPODelivery}
                  formatDate={formatDate}
                  filteredPODeliveryData={filteredPODeliveryData}
                />
              ) : null}
              {activeTab === tabs[4] ? (
                <VendorPayments
                  formatDate={formatDate}
                  filteredVendorData={filteredVendorData}
                  targetPdfRefVendorPayment={targetPdfRefVendorPayment}
                  vendorPaymentData={vendorPaymentData}
                />
              ) : null}
            </View>
          </View>
        </View>
      </PaperProvider>
    );
  }

  return (
    <View style={[styles.container, {marginTop: 40}]}>
      <Text>No permissions to view reports.</Text>
    </View>
  );
};

const RenderCustomDateField = ({
  dateFilter,
  isEndDateVisible,
  setEndDateVisible,
  isStartDateVisible,
  setStartDateVisible,
  end_date,
  start_date,
  formatDate,
  setStartDate,
  setEndDate,
}) => {
  if (dateFilter === 'custom') {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            if (isEndDateVisible) {
              setEndDateVisible(false);
            }
            setStartDateVisible(!isStartDateVisible);
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              paddingHorizontal: 8,
              borderRadius: 6,
            }}>
            <TouchableOpacity
              onPress={() => {
                setStartDateVisible(true);
              }}>
              <Text>{new Date(start_date).toLocaleDateString()}</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 20}}> - </Text>
            <TouchableOpacity
              onPress={() => {
                setEndDateVisible(true);
              }}>
              <Text>{new Date(end_date).toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {isStartDateVisible && (
          <CustomModal
            title={`From: ${formatDate(start_date)}`}
            // showHeader={false}
            visible={isStartDateVisible}
            closeModal={() => setStartDateVisible(false)}>
            <View style={{marginTop: 10, marginBottom: -40}}>
              <DateTimePicker
                value={start_date}
                maximumDate={new Date()}
                onValueChange={date => {
                  setStartDate(date);
                  setStartDateVisible(false);
                }}
              />
            </View>
          </CustomModal>
        )}
        {isEndDateVisible && (
          <CustomModal
            title={`To: ${formatDate(end_date)}`}
            // showHeader={false}
            visible={isEndDateVisible}
            closeModal={() => setEndDateVisible(false)}>
            <View style={{marginBottom: -40}}>
              <DateTimePicker
                value={end_date}
                minimumDate={start_date}
                maximumDate={new Date()}
                onValueChange={date => {
                  setEndDate(date);
                  setEndDateVisible(false);
                }}
              />
            </View>
          </CustomModal>
        )}
      </View>
    );
  }
};

const MenuComponent = ({showMenu, setShowMenu, setDateFilter}) => {
  return (
    <Menu
      style={{
        marginTop: Platform.OS === 'android' ? -64 : 0,
        marginLeft: Platform.OS === 'android' ? -36 : -22,
      }}
      contentStyle={{
        backgroundColor: 'white',
        borderRadius: 6,
        paddingVertical: 0,
      }}
      visible={showMenu}
      onDismiss={() => setShowMenu(false)}
      anchorPosition="bottom"
      anchor={
        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={28} />
        </TouchableOpacity>
      }>
      <TouchableOpacity
        onPress={() => {
          setDateFilter('');
          setShowMenu(false);
        }}
        style={customStyles.menuTab}>
        <Text>All Dates</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setDateFilter('today');
          setShowMenu(false);
        }}
        style={customStyles.menuTab}>
        <Text>Today</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setDateFilter('last7days');
          setShowMenu(false);
        }}
        style={customStyles.menuTab}>
        <Text>Last 7 days</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setDateFilter('custom');
          setShowMenu(false);
        }}
        style={{padding: 8}}>
        <Text>Custom</Text>
      </TouchableOpacity>
    </Menu>
  );
};

const icons = [
  <Feather key={0} name="activity" size={20} />,
  <MaterialIcons key={1} name="task-alt" size={20} />,
  <Ionicons key={2} name="wallet-outline" size={19} />,
  <SimpleLineIcons key={3} name="handbag" size={20} />,
  <MaterialCommunityIcons key={3} name="credit-card-clock-outline" size={20} />,
];

const customStyles = StyleSheet.create({
  menuTab: {
    flex: 1,
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default ReportScreen;
