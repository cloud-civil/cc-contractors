import {Text, View} from 'react-native';
import SizeButton from '../../../../components/SizeButton';
import {shallowEqual, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import QuantityCard from '../../../../components/QuantityCard';
import {appendZeroesToSixDigits} from '../../../../cc-utils/src';
import {formatDate} from '../../../../utils';
import {useNavigation} from '@react-navigation/native';
import styles from '../../../../styles/styles';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';

const PurchasedOrderItem = ({
  index,
  item,
  currentReceivedOrders,
  unit,
  setActiveOrderId,
  setActivePurchaseGroup,
  setShowReceivePOModal,
  setShowApprovePOModal,
  orderGroup,
  project_id,
  permission,
}) => {
  let approvalPending = false;
  let rverified = true;
  if (currentReceivedOrders && Array.isArray(currentReceivedOrders)) {
    currentReceivedOrders.forEach(x => {
      if (x.status === 'verification_pending') {
        approvalPending = true;
      }
      const f = JSON.parse(x.verification);
      if (!f.verified) {
        rverified = false;
      }
    });
  }

  const navigation = useNavigation();
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const stocks__ = useSelector(state => state.stock.stocks, shallowEqual);
  const stocksObject =
    (stocks__[project_id] && stocks__[project_id].asObject) || [];

  return (
    <SizeButton
      key={item}
      scale={currentReceivedOrders ? 0.97 : 1}
      onClick={() => {
        if (
          item.status === 'receive_order' &&
          currentReceivedOrders &&
          permission &&
          permission.read
        ) {
          navigation.navigate('receivedPO', {
            activeOrderId: item.porder_id,
            project_id,
          });
        }
      }}>
      <View
        style={[styles.card, {flexDirection: 'column', alignItems: 'stretch'}]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                alignItems: 'center',
              }}>
              {stocksObject[item.stock_id].name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="clock-time-three-outline"
              size={16}
              color="#333"
            />
            <Text style={{color: '#333', marginLeft: 4}}>
              {formatDate(item.order_date)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            {/* <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                alignItems: 'center',
              }}>
              {stocksObject[item.stock_id].name}
            </Text> */}

            <Text>
              PO{userOrg.org_id}
              {project_id}-{appendZeroesToSixDigits(item.pgroup_id)}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 6,
              }}>
              <QuantityCard
                headline={'Ordered'}
                quantity={item.quantity || 0}
                unit={unit}
              />
              <QuantityCard
                headline={'Received'}
                quantity={item.received || 0}
                unit={unit}
              />
            </View>
          </View>
          <View
            style={{
              marginLeft: 'auto',
              minWidth: 92,
            }}>
            {item.quantity === item.received && rverified && (
              <View style={[styles.tag, {marginLeft: 5}]}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={14}
                  color="#fff"
                />
                <Text style={styles.tagText}>Complete</Text>
              </View>
            )}

            {approvalPending ? (
              <CustomButton
                onClick={() => {
                  navigation.navigate('receivedPO', {
                    activeOrderId: item.porder_id,
                    project_id,
                  });
                }}
                buttonStyle={{
                  backgroundColor: 'white',
                  borderRadius: 4,
                  marginBottom: 6,
                  borderWidth: 1,
                  borderColor: '#ff5c33',
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                }}>
                <Text
                  style={{
                    color: '#ff5c33',
                    textAlign: 'center',
                  }}>
                  Verify R.O
                </Text>
              </CustomButton>
            ) : null}

            {permission &&
              permission.write &&
              item.status === 'receive_order' &&
              item.received < item.quantity && (
                <CustomButton
                  onClick={() => {
                    setActiveOrderId(item.porder_id);
                    setActivePurchaseGroup(orderGroup);
                    setShowReceivePOModal(true);
                  }}
                  buttonStyle={{
                    backgroundColor: Colors.primary,
                    borderRadius: 4,
                    width: 104,
                    marginBottom: 6,
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                    }}>
                    Receive
                  </Text>
                </CustomButton>
              )}

            {item.status === 'purchase_verified' ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  color={'#20A410'}
                  size={14}
                  style={{marginRight: 4}}
                />
                <Text style={{color: '#20A410'}}>P.O Verified</Text>
              </View>
            ) : null}

            {permission &&
            permission.verify &&
            item.status === 'verify_purchase' ? (
              <CustomButton
                onClick={() => {
                  setActiveOrderId(item.porder_id);
                  setActivePurchaseGroup(orderGroup);
                  setShowApprovePOModal(true);
                }}
                buttonStyle={{
                  backgroundColor: 'white',
                  borderRadius: 4,
                  marginBottom: 6,
                  borderWidth: 1,
                  borderColor: '#ff5c33',
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                }}>
                <Text
                  style={{
                    color: '#ff5c33',
                    textAlign: 'center',
                  }}>
                  Approve P.O
                </Text>
              </CustomButton>
            ) : null}
          </View>
        </View>

        {orderGroup.length > 1 && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 6,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
            }}>
            {[...Array(orderGroup.length)].map((item, idx) => {
              return (
                <View key={idx}>
                  <View
                    style={{
                      backgroundColor: idx === index ? 'black' : '#aaa',
                      width: 16,
                      height: 3,
                      margin: 6,
                      borderRadius: 50,
                    }}
                  />
                </View>
              );
            })}
          </View>
        )}
      </View>
    </SizeButton>
  );
};

export default PurchasedOrderItem;
