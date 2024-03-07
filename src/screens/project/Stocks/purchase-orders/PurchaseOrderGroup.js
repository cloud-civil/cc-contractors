import {Dimensions, FlatList} from 'react-native';
import PurchasedOrderItem from './PurchasedOrderItem';

const PurchaseOrderGroup = ({
  stocksObject,
  orderGroup,
  poState,
  setActiveOrderId,
  setActivePurchaseGroup,
  setShowReceivePOModal,
  setShowApprovePOModal,
  project_id,
  permission,
}) => {
  return (
    <FlatList
      data={orderGroup}
      horizontal={orderGroup.length > 1 ? true : false}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      snapToAlignment="start"
      snapToInterval={Dimensions.get('window').width - 20}
      decelerationRate="fast"
      renderItem={({item, index}) => {
        const currentReceivedOrders =
          poState.groupedReceivedOrders?.[item.porder_id];

        const unit = stocksObject?.[item?.stock_id]?.unit || null;

        return (
          <PurchasedOrderItem
            currentReceivedOrders={currentReceivedOrders}
            item={item}
            unit={unit}
            setActiveOrderId={setActiveOrderId}
            setActivePurchaseGroup={setActivePurchaseGroup}
            setShowReceivePOModal={setShowReceivePOModal}
            setShowApprovePOModal={setShowApprovePOModal}
            orderGroup={orderGroup}
            index={index}
            project_id={project_id}
            permission={permission}
          />
        );
      }}
    />
  );
};

export default PurchaseOrderGroup;
