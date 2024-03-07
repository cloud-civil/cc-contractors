/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import DocumentScreen from './DocumentScreen';
import ReportScreen from './Reports/ReportScreen';
import AssetNavigation from './Assets/AssetNavigation';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {
  setPurchaseOrders,
  setReceiveOrders,
  setUserRolesData,
} from '../../cc-hooks/src/appSlice';
import {
  setProjectAssets,
  setProjectUsers,
} from '../../cc-hooks/src/projectSlice';
import {useDispatch, useSelector} from 'react-redux';
import {setStocksAndStockGroups} from '../../cc-hooks/src/stockSlice';
import {GoBack} from '../../components/HeaderButtons';
import ProjectHome from './home/ProjectHome';
import {setPermissions} from '../../cc-hooks/src/authSlice';
import {createStackNavigator} from '@react-navigation/stack';
import {GroupTaskCategories} from './Tasks/utils';
import {setTaskCategories, setTaskStocks} from '../../cc-hooks/src/taskSlice';
import TaskScreen from './Tasks/TaskScreen';
import TaskAndStockNavigation from './Tasks/TaskAndStockNavigation';
import TaskDoneHistory from './Tasks/TaskdoneHistory';
import TaskStockHistory from './Tasks/TaskStockHistory';
import TaskDoneDetails from './Tasks/TaskDoneDetails';
import StockNavigation from './Stocks/StockNavigation';
import ReceivedOrdersHistory from './Stocks/purchase-orders/ReceivedOrderHistory';
import ReceiveGRNHistory from './Stocks/add-stock/ReceiveGRNHistory';
import PurchaseOrder from './Stocks/purchase-orders/PurchaseOrder';
import ExpenseScreen from './Expense/ExpenseScreen';
import VendorBillsAndPayments from './Expense/Vendor/VendorBillAndPayments';
import ContractorBillsAndPayments from './Expense/contractor/ContractorBillsAndPayments';
import UserBalance from './Expense/employees/UserBalance';
import Employes from './Employes/EmployesScreen';
import AddEmploye from './Employes/AddEmployee';
import UserPermissions from './Employes/UserPermissions';
import IssueNavigation from './Issues/IssueNavigation';
import IssueCommnet from './Issues/comments/IssueCommnet';
import VendorAttendance from './Attendance/VendorAttendance';
import AttendanceScreen from './Attendance/AttendanceScreen';
import StockIssueHistory from './Stocks/in-hand/StockIssueHistory';

const Stack = createStackNavigator();

const ProjectStack = ({route}) => {
  const {project_id} = route.params;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const users = useSelector(state => state.app.users.asArray);
  const o_users = useSelector(state => state.app.users.asObject);
  const project_assets__ = useSelector(state => state.project.assets);
  const purchasedOrders__ = useSelector(state => state.app.porders);
  const receivedOrders__ = useSelector(state => state.app.rorders);
  const authUser = useSelector(state => state.auth.user);

  useEffect(() => {
    if (project_id) {
      axiosInstance(token)
        .get(
          `/pem/getAllUserTablePermissions?project_id=${project_id}&user_id=${authUser.user_id}`,
        )
        .then(({data}) => {
          console.log('getAllUserTablePermissions');
          dispatch(setPermissions(data.data));
        })
        .catch(err => console.error('getAllUserTablePermissions', err));
    }
  }, [project_id]);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getAllStocksForProject?project_id=${project_id}`)
      .then(({data}) => {
        console.log('getAllStocksForProject');
        const gob = {};
        const ob = {};
        data.data.forEach(x => {
          ob[x.stock_id] = x;
        });
        data.groups.forEach(x => {
          gob[x.group_id] = x;
        });
        dispatch(
          setStocksAndStockGroups({
            project_id,
            data: {
              asArray: data.data,
              asObject: ob,
            },
            groups: {
              asArray: data.groups,
              asObject: gob,
            },
          }),
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (users) {
      axiosInstance(token)
        .get(`/getUsersOfProject?project_id=${project_id}`)
        .then(({data}) => {
          const f = {};
          const g = [];
          data.data.forEach(x => {
            f[x.user_id] = o_users[x.user_id];
            g.push(o_users[x.user_id]);
          });
          dispatch(
            setProjectUsers({
              asArray: g,
              asObject: f,
            }),
          );
        })
        .catch(err => {
          'getUsersOfProject', err;
        });
    }
  }, [users]);

  useEffect(() => {
    if (!project_assets__[project_id]) {
      axiosInstance(token)
        .get(`/getAssetsByProjectId?project_id=${project_id}`)
        .then(({data}) => {
          dispatch(setProjectAssets({project_id, data: data.data}));
        })
        .catch(err => {
          console.log('/getAssetsByProjectId', err);
        });
    }
  }, []);

  useEffect(() => {
    if (!purchasedOrders__[project_id]) {
      axiosInstance(token)
        .get(`/getPurchasedOrderByProjectId?project_id=${project_id}`)
        .then(({data}) => {
          dispatch(setPurchaseOrders({project_id, data: data.data}));
        })
        .catch(err => {
          console.error('getPurchasedOrderByProjectId', err);
        });
    }
  }, [purchasedOrders__]);

  useEffect(() => {
    if (!receivedOrders__[project_id]) {
      axiosInstance(token)
        .get(`/getReceivedOrderByProjectId?project_id=${project_id}`)
        .then(({data}) => {
          dispatch(setReceiveOrders({project_id, data: data.data}));
        })
        .catch(err => {
          console.error('getReceivedOrderByProjectId', err);
        });
    }
  }, []);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getUserByRoleForProject?project_id=${project_id}`)
      .then(({data}) => {
        dispatch(setUserRolesData({project_id, data: data.data}));
      })
      .catch(err => {
        console.error('getUserByRoleForProject', err);
      });
  }, []);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getAllTaskStocksForProject?project_id=${project_id}`)
      .then(({data}) => {
        dispatch(setTaskStocks({project_id, data: data.data}));
      })
      .catch(err => {
        console.error(
          err,
          'getAllTaskStocksForProject',
          err?.response?.data?.message,
        );
      });
  }, []);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getTaskCategories?project_id=${project_id}`)
      .then(({data}) => {
        const {task_categories} = data.data;
        const {all_task_groups} = GroupTaskCategories(task_categories);
        dispatch(setTaskCategories({data: all_task_groups, project_id}));
      })
      .catch(err => {
        console.error('getTaskCategories', JSON.stringify(err));
      });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'left',
        headerTitleStyle: {marginLeft: -20},
      }}>
      <Stack.Screen
        name="projects"
        component={ProjectHome}
        initialParams={route.params}
        options={{
          headerShown: false,
          headerLeft: GoBack,
        }}
      />
      <Stack.Screen
        name="assets"
        component={AssetNavigation}
        initialParams={route.params}
        options={{
          headerShown: false,
          headerLeft: GoBack,
        }}
      />
      <Stack.Screen
        name="stocks"
        component={StockNavigation}
        initialParams={route.params}
        options={{
          headerShown: false,
          headerTitleAlign: 'left',
          headerLeft: GoBack,
        }}
      />
      <Stack.Screen
        name="issues"
        component={IssueNavigation}
        initialParams={route.params}
        options={{
          headerShown: false,
          headerTitleAlign: 'left',
          headerLeft: GoBack,
        }}
      />
      <Stack.Screen
        name="IssueComment"
        component={IssueCommnet}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="reports"
        component={ReportScreen}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="attendance"
        component={VendorAttendance}
        options={{
          headerShown: false,
        }}
        initialParams={route.params}
      />
      <Stack.Screen
        name="giveAttendance"
        component={AttendanceScreen}
        options={{
          headerShown: false,
        }}
        initialParams={route.params}
      />
      <Stack.Screen
        name="expenses"
        component={ExpenseScreen}
        options={{
          headerShown: false,
        }}
        initialParams={{...route.params}}
      />
      <Stack.Screen
        name="documents"
        component={DocumentScreen}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="employees"
        component={Employes}
        options={{
          headerShown: false,
        }}
        initialParams={route.params}
      />
      <Stack.Screen
        name="tasks"
        component={TaskScreen}
        options={{
          headerShown: false,
        }}
        initialParams={route.params}
      />
      <Stack.Screen
        name="TaskAndStock"
        component={TaskAndStockNavigation}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TaskDoneHistory"
        component={TaskDoneHistory}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TaskStockHistory"
        component={TaskStockHistory}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TaskDoneDetails"
        component={TaskDoneDetails}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="StockHistory"
        component={StockIssueHistory}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="receivedPO"
        component={ReceivedOrdersHistory}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="receivedGRN"
        component={ReceiveGRNHistory}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PurchasedOrders"
        component={PurchaseOrder}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="vendor_bill"
        component={VendorBillsAndPayments}
        options={{
          headerShown: false,
        }}
        initialParams={{...route.params}}
      />
      <Stack.Screen
        name="contractor_bill"
        component={ContractorBillsAndPayments}
        options={{
          headerShown: false,
        }}
        initialParams={{...route.params}}
      />
      <Stack.Screen
        name="user_balance"
        component={UserBalance}
        options={{
          headerShown: false,
        }}
        initialParams={{...route.params}}
      />
      <Stack.Screen
        name="AddEmploye"
        component={AddEmploye}
        options={{
          headerShown: false,
        }}
        initialParams={route.params}
      />
      <Stack.Screen
        name="UserPermission"
        component={UserPermissions}
        options={{
          headerShown: false,
        }}
        initialParams={route.params}
      />
    </Stack.Navigator>
  );
};

export default ProjectStack;
