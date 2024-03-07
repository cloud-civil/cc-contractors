import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {FlatList, Image, Text, View} from 'react-native';
import styles from '../../../../styles/styles';
import Colors from '../../../../styles/Colors';
import {GoBack} from '../../../../components/HeaderButtons';
import {IMAGE_URL} from '@env';
import {useMemo, useState} from 'react';
import QuantityCard from '../../../../components/QuantityCard';
import {formatDate} from '../../../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import Toast from 'react-native-toast-message';
import {
  setPurchaseOrders,
  setReceiveOrders,
} from '../../../../cc-hooks/src/appSlice';
import {useHooks} from '../hooks';
import {setStocks} from '../../../../cc-hooks/src/stockSlice';
import {CustomButton} from '../../../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import ImageView from 'react-native-image-viewing';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ReceivedOrdersHistory = ({route}) => {
  const {activeOrderId, project_id} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const users = useSelector(state => state.app.users.asObject, shallowEqual);
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const app = useSelector(state => state.app, shallowEqual);
  const stock = useSelector(state => state.stock, shallowEqual);
  const runHooks = useMemo(() => {
    return useHooks(project_id, app, stock);
  }, [stock, project_id, app]);
  const {receivedOrders, purchasedOrders} = runHooks;
  const stocksObject =
    (stock.stocks[project_id] && stock.stocks[project_id].asObject) || [];

  const receiveOrderData = receivedOrders.filter(
    item => item.porder_id === activeOrderId,
  );

  const verifyReceiveOrder = rorder => {
    const __data = {
      update_stocks: true,
      stock_id: rorder.stock_id,
      rorder_quantity: rorder.quantity,
      project_id: rorder.project_id,
      rorder_id: rorder.rorder_id,
      porder_id: rorder.porder_id,
      verification: JSON.stringify({
        verified: true,
        verified_by: authUser.user_id,
      }),
    };

    axiosInstance(token)
      .post('/verifyOrderByReceiveId', __data)
      .then(() => {
        dispatch(
          setReceiveOrders({
            project_id,
            data: receivedOrders.map(r => {
              if (r.rorder_id === rorder.rorder_id) {
                return {
                  ...r,
                  status: 'verified',
                  verification: JSON.stringify({
                    verified: true,
                    verified_by: authUser.user_id,
                  }),
                };
              }
              return r;
            }),
          }),
        );
        const newArr = purchasedOrders.map(item => {
          if (item.porder_id === rorder.porder_id) {
            var newData = {...item, received: item.received + rorder.quantity};
            return newData;
          } else {
            return item;
          }
        });

        dispatch(
          setPurchaseOrders({
            project_id,
            data: newArr,
          }),
        );

        const stocksAsObject = {};
        const stocksArray = stock.stocks[project_id].asArray.map(s => {
          if (s.stock_id === rorder.stock_id) {
            const f = {...s, total: rorder.quantity + s.total};
            stocksAsObject[s.stock_id] = f;
            return f;
          }
          stocksAsObject[s.stock_id] = s;
          return s;
        });
        dispatch(
          setStocks({
            project_id,
            data: {
              asArray: stocksArray,
              asObject: stocksAsObject,
            },
          }),
        );

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Order verified succesfully.',
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Order verification failed.',
        });
        console.error(
          err,
          '/verifyOrderByReceiveId',
          err.response.data.message,
        );
      });
  };

  return (
    <>
      <View style={{paddingTop: 34, backgroundColor: 'white'}} />
      <View
        style={{
          paddingBottom: 10,
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
            Received Orders
          </Text>
        </View>
      </View>
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        {receiveOrderData && (
          <FlatList
            data={receiveOrderData}
            renderItem={({item: rorder, index}) => {
              const user = users[parseInt(rorder.received_by, 10)];
              const images = rorder.images && JSON.parse(rorder.images);
              let address = null;
              try {
                const l = JSON.parse(rorder.location);
                address = l.address;
              } catch {
                address = rorder.location;
              }
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    borderBottomWidth:
                      index === receiveOrderData.length - 1 ? 0 : 1,
                    borderBottomColor: '#ccc',
                    paddingBottom: 10,
                    marginBottom: 10,
                  }}>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 4,
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              marginRight: 10,
                            }}>
                            {stocksObject[rorder.stock_id].name}
                          </Text>
                          {rorder && rorder.status === 'verified' && (
                            <View style={styles.tag}>
                              <MaterialCommunityIcons
                                name="check-decagram"
                                size={14}
                                color="#fff"
                              />
                              <Text style={styles.tagText}>Verified</Text>
                            </View>
                          )}
                        </View>
                        {rorder.vehicle_no && (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 3,
                            }}>
                            <MaterialCommunityIcons
                              name="truck"
                              size={16}
                              color="#333"
                            />
                            <Text style={{marginLeft: 4, fontWeight: '600'}}>
                              {rorder.vehicle_no}
                            </Text>
                          </View>
                        )}
                        <View style={{marginBottom: 3}}>
                          <Text style={{fontWeight: 500}}>
                            Received by : {user && user.fname}{' '}
                            {user && user.lname}
                          </Text>
                        </View>
                        {address && (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              marginVertical: 2,
                              width: '80%',
                            }}>
                            <Entypo name="location" size={18} color="#333" />
                            <Text
                              style={{
                                marginLeft: 4,
                              }}>
                              {address}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={{marginLeft: 'auto', height: '100%'}}>
                        {rorder.received_time && (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 6,
                            }}>
                            <MaterialCommunityIcons
                              name="clock-time-three-outline"
                              size={16}
                              color="#333"
                            />
                            <Text style={{color: '#333', marginLeft: 4}}>
                              {formatDate(rorder.received_time)}
                            </Text>
                          </View>
                        )}

                        {rorder.status === 'verification_pending' ? (
                          <CustomButton
                            buttonStyle={{
                              backgroundColor: Colors.primary,
                              borderRadius: 4,
                              marginBottom: 6,
                              paddingVertical: 4,
                              paddingHorizontal: 10,
                            }}
                            onClick={() => {
                              verifyReceiveOrder(rorder);
                            }}>
                            <Text style={{color: 'white', textAlign: 'center'}}>
                              Verify
                            </Text>
                          </CustomButton>
                        ) : null}
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 6,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <QuantityCard
                          headline={'Received'}
                          quantity={rorder.quantity || 0}
                          unit={stocksObject[rorder.stock_id].unit}
                        />
                      </View>
                      {images && images.length > 0 && (
                        <FlatList
                          data={images}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentbuttonStyle={{paddingRight: 50}}
                          renderItem={({item: img}) => {
                            const url = `${IMAGE_URL}/project_image/${userOrg.org_id}/${project_id}/thumbnail-${img.fullName}`;
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  setActiveImage([
                                    {
                                      uri: `${IMAGE_URL}/project_image/${userOrg.org_id}/${project_id}/preview-${img.fullName}`,
                                    },
                                  ]);
                                  setShowPhotoModal(true);
                                }}
                                activeOpacity={0.7}
                                key={img.fullName}>
                                <Image
                                  source={{
                                    uri: url,
                                    headers: {
                                      Authorization: token,
                                    },
                                  }}
                                  style={{
                                    width: 64,
                                    height: 48,
                                    borderRadius: 6,
                                    marginRight: 6,
                                  }}
                                />
                              </TouchableOpacity>
                            );
                          }}
                        />
                      )}
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}

        {receiveOrderData && receiveOrderData.length === 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              margin: -10,
            }}>
            <Text>You haven&apos;t received any purchase order yet.</Text>
          </View>
        )}
      </View>

      <ImageView
        images={activeImage}
        imageIndex={0}
        visible={showPhotoModal}
        onRequestClose={() => {
          setShowPhotoModal(false);
        }}
      />
    </>
  );
};

export default ReceivedOrdersHistory;
