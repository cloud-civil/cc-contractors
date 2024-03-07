import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import InStock from './in-hand/InStock';
import {shallowEqual, useSelector} from 'react-redux';
import {GoBack} from '../../../components/HeaderButtons';
import {View, Text, StyleSheet} from 'react-native';
import POVendors from './poVendors';
import RequestStock from './request/RequestStock';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import Tabs from '../../../components/Tabs';
import AddStock from './add-stock/AddStock';
import styles from '../../../styles/styles';
import ForeCast from './forecast/ForeCast';

const tabs = ['In Stock', 'Add Stock', 'P.O', 'Requests', 'Forecast'];

const StockNavigation = ({route}) => {
  const {project_id} = route.params;
  const navigation = useNavigation();
  const vendors = useSelector(state => state.app.vendors.asArray, shallowEqual);
  const stocks__ = useSelector(state => state.stock.stocks, shallowEqual);
  const purchasedOrders__ = useSelector(
    state => state.app.porders,
    shallowEqual,
  );
  const receivedOrders__ = useSelector(
    state => state.app.rorders,
    shallowEqual,
  );
  const user_roles__ = useSelector(state => state.app.user_roles, shallowEqual);
  const project_permissions__ = useSelector(
    state => state.project.permissions,
    shallowEqual,
  );
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const stocksObject =
    (stocks__[project_id] && stocks__[project_id].asObject) || [];

  const purchasedOrders =
    (purchasedOrders__[project_id] && purchasedOrders__[project_id].asArray) ||
    [];
  const receivedOrders =
    (receivedOrders__[project_id] && receivedOrders__[project_id].asArray) ||
    [];
  const user_roles =
    (user_roles__[project_id] && user_roles__[project_id].asArray) || [];

  const project_permissions =
    (project_permissions__[project_id] &&
      project_permissions__[project_id].asArray) ||
    [];

  const props = {
    ...route.params,
    vendors,
    purchasedOrders,
    receivedOrders,
    user_roles,
    project_permissions,
    stocksObject,
  };

  return (
    <>
      <View style={{backgroundColor: 'white'}}>
        <View style={styles.statusBar} />
        <View style={styles.headerContainer}>
          <GoBack onClick={() => navigation.goBack()} />
          <View>
            <Text style={customStyle.header}>Materials</Text>
          </View>
        </View>

        <Tabs
          data={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          numOfTab={4.5}
          minusWidth={0}
          icons={icons}
        />
      </View>

      {activeTab === tabs[0] && <InStock {...props} />}
      {activeTab === tabs[1] && <AddStock {...props} />}
      {activeTab === tabs[2] && <POVendors {...props} />}
      {activeTab === tabs[3] && <RequestStock {...props} />}
      {activeTab === tabs[4] && <ForeCast {...props} />}
    </>
  );
};

const icons = [
  <MaterialCommunityIcons key={0} name="hand-extended-outline" size={20} />,
  <MaterialCommunityIcons key={1} name="note-edit-outline" size={20} />,
  <SimpleLineIcons key={2} name="handbag" size={19} />,
  <Feather key={3} name="git-pull-request" size={20} />,
  <Octicons key={4} name="arrow-switch" size={20} />,
];

const customStyle = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: '500',
    color: '#3e3e3e',
  },
});

export default StockNavigation;
