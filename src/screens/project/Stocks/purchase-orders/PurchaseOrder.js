import {useEffect, useMemo, useState} from 'react';
import {View, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {shallowEqual, useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import {CreatePOModal} from './CreatePOModal';
import FloatingButton from '../../../../components/FloatingButton';
import PurchaseOrderGroup from './PurchaseOrderGroup';
import {getPermissions} from '../../../../utils';
import {useHooks} from '../hooks';
import {GoBack} from '../../../../components/HeaderButtons';
import {ReceivePOModal} from './ReceivePOModal';
import styles from '../../../../styles/styles';
import {ApprovePOModal} from './ApprovePoModal';
import {useNavigation} from '@react-navigation/native';

const PurchaseOrder = ({route}) => {
  const {project_id, user_roles, project_permissions, vendors, activeVendor} =
    route.params;
  const navigation = useNavigation();
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1016);
  const permission = x && JSON.parse(x.permission);

  const stocks__ = useSelector(state => state.stock.stocks, shallowEqual);
  const stocksObject =
    (stocks__[project_id] && stocks__[project_id].asObject) || [];
  const app = useSelector(state => state.app, shallowEqual);
  const stock = useSelector(state => state.stock, shallowEqual);
  const runHooks = useMemo(() => {
    return useHooks(project_id, app, stock);
  }, [stock, project_id, app]);

  const {purchasedOrders, receivedOrders} = runHooks;
  const [showReceivePOModal, setShowReceivePOModal] = useState(false);
  const [showCreatePOModal, setShowCreatePOModal] = useState(false);
  const [showApprovePOModal, setShowApprovePOModal] = useState(false);
  const [activePurchaseGroup, setActivePurchaseGroup] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const [poState, setPoState] = useState({
    groupedReceivedOrders: null,
    printInvoice: false,
    printData: null,
    activeOrder: null,
  });

  useEffect(() => {
    let activeOrder = null;
    const groupedReceivedOrders = {};
    receivedOrders.forEach(y => {
      if (!groupedReceivedOrders[y.porder_id]) {
        groupedReceivedOrders[y.porder_id] = [y];
      } else {
        groupedReceivedOrders[y.porder_id] = [
          ...groupedReceivedOrders[y.porder_id],
          y,
        ];
      }
    });
    if (poState.activeOrder && poState.activeOrder.length > 0) {
      activeOrder = groupedReceivedOrders[poState.activeOrder[0].porder_id];
    }
    setPoState({
      ...poState,
      groupedReceivedOrders,
      activeOrder,
    });
  }, [receivedOrders]);

  const allPurchasedOrders = purchasedOrders.reduce((result, currentItem) => {
    const groupId =
      currentItem.pgroup_id === null
        ? currentItem.porder_id
        : currentItem.pgroup_id;

    if (!result[groupId]) {
      result[groupId] = [];
    }

    result[groupId].push(currentItem);

    return result;
  }, {});

  const totalItem = Object.values(allPurchasedOrders).filter(
    item => item[0].vendor_id === activeVendor.vendor_id,
  );

  return (
    <>
      <View style={{paddingTop: 44, backgroundColor: 'white'}} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            {activeVendor?.name}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        {totalItem.length !== 0 ? (
          <FlatList
            key={allPurchasedOrders}
            data={Object.values(allPurchasedOrders)}
            contentContainerStyle={{paddingBottom: 70}}
            showsVerticalScrollIndicator={false}
            renderItem={({item, idx}) => {
              let purchaseOrderId = null;
              item.forEach(x => {
                if (!purchaseOrderId) {
                  purchaseOrderId = x.porder_id;
                }
                if (purchaseOrderId && x.porder_id < purchaseOrderId) {
                  purchaseOrderId = x.porder_id;
                }
              });
              const orderGroup = item.map(x => {
                return {...x, purchaseOrderId};
              });
              const v = item[0];
              if (v.vendor_id !== activeVendor.vendor_id) return null;

              return (
                <PurchaseOrderGroup
                  key={idx}
                  stocksObject={stocksObject}
                  orderGroup={orderGroup}
                  poState={poState}
                  setActiveOrderId={setActiveOrderId}
                  setActivePurchaseGroup={setActivePurchaseGroup}
                  setShowReceivePOModal={setShowReceivePOModal}
                  setShowApprovePOModal={setShowApprovePOModal}
                  project_id={project_id}
                  permission={permission}
                />
              );
            }}
          />
        ) : (
          <View style={styles.emptyTabView}>
            <Text>There is no Purchase order</Text>
          </View>
        )}
      </View>
      {permission && permission.write && (
        <FloatingButton
          onClick={() => setShowCreatePOModal(true)}
          buttonStyle={{margin: 10}}>
          <MaterialCommunityIcons name="cart-plus" size={28} color={'white'} />
        </FloatingButton>
      )}
      {showCreatePOModal && (
        <CreatePOModal
          project_id={project_id}
          vendors={vendors}
          project_permissions={project_permissions}
          user_roles={user_roles}
          showModal={showCreatePOModal}
          setShowModal={setShowCreatePOModal}
          activeVendor={activeVendor}
        />
      )}
      {activePurchaseGroup && (
        <ReceivePOModal
          project_id={project_id}
          vendors={vendors}
          project_permissions={project_permissions}
          user_roles={user_roles}
          showModal={showReceivePOModal}
          setShowModal={setShowReceivePOModal}
          activeVendor={activeVendor}
          receivedOrders={receivedOrders}
          eachPurchasedOrderAsGroup={activePurchaseGroup}
          activeOrderId={activeOrderId}
        />
      )}
      {activePurchaseGroup && (
        <ApprovePOModal
          showModal={showApprovePOModal}
          setShowModal={setShowApprovePOModal}
          eachPurchasedOrderAsGroup={activePurchaseGroup}
          purchasedOrders={purchasedOrders}
          project_id={project_id}
          activeOrderId={activeOrderId}
        />
      )}
    </>
  );
};

export default PurchaseOrder;
