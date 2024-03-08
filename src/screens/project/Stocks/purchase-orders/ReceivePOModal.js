import {useEffect, useState} from 'react';
import CustomModal from '../../../../components/CustomModal';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../../../../styles/styles';
import SelectDropdown from 'react-native-select-dropdown';
import Colors from '../../../../styles/Colors';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from 'react-native-ui-datepicker';
import {formatDate} from '../../../../utils';
import {CustomButton} from '../../../../components/CustomButton';
import {deleteImage, resetImages} from '../../../../cc-hooks/src/imageSlice';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import Toast from 'react-native-toast-message';
import {setReceiveOrders} from '../../../../cc-hooks/src/appSlice';
import Input from '../../../../components/Input';
import {takePicture} from '../../../../utils/camera';
import {ImageLoadingSkeleton} from '../../../../components/Skeleton';
import {IMAGE_URL} from '@env';
import LocationComponent from '../../../../components/LocationComponent';

const makeInt = d => {
  if (typeof d === 'string') {
    return parseInt(d, 10);
  }
  return d;
};

const initData = {
  quantity: '',
  vehicle_no: '',
  received_time: new Date(),
  received_by: '',
  reRender: 0,
};

const initLocation = {
  latitude: null,
  longitude: null,
  address: '',
};

const FormComponent = props => {
  const {
    project_id,
    receivedOrders: receiveOrders,
    setShowModal,
    eachPurchasedOrderAsGroup,
    activeVendor,
    activeOrderId,
  } = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const users = useSelector(state => state.app.users.asArray, shallowEqual);
  const userObject = useSelector(
    state => state.app.users.asObject,
    shallowEqual,
  );

  const stocksObject__ = useSelector(state => state.stock.stocks, shallowEqual);
  const stocksObject =
    (stocksObject__[project_id] && stocksObject__[project_id].asObject) || [];
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const uploadedUrls = useSelector(
    state => state.image.uploadedUrls,
    shallowEqual,
  );
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const [location, setLocation] = useState(initLocation);

  const [isReceivedTimePickerVisible, setReceivedTimePickerVisible] =
    useState(false);
  const [receiveOrder, setReceiveOrder] = useState(null);
  const [state, setState] = useState(initData);
  const [groupData, setGroupData] = useState({});
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const handleTakePicture = async () => {
    takePicture(
      project_id,
      token,
      userOrg.org_id,
      dispatch,
      setImageUploadLoading,
    );
  };

  useEffect(() => {
    setState({
      ...state,
      received_by: authUser.user_id,
    });
    eachPurchasedOrderAsGroup.map(item => {
      if (item.porder_id === activeOrderId) {
        setReceiveOrder(item);
        setState({
          ...state,
          porder_id: activeOrderId,
          stock_id: item.stock_id,
        });
        return;
      }
    });
  }, []);

  const makeData = () => {
    if (makeInt(state.quantity) === 0) {
      Alert.alert('Invalid', 'Quantity cannot be 0.');
      return;
    }
    if (
      makeInt(state.quantity) + receiveOrder.received >
      receiveOrder.quantity
    ) {
      Alert.alert(
        'Invalid',
        'Receive quantity cannot exceed the Order quantity.',
      );
      return;
    }
    return {
      porder_id: receiveOrder.porder_id,
      project_id: makeInt(project_id),
      org_id: userOrg.org_id,
      quantity: makeInt(state.quantity),
      vehicle_no: state.vehicle_no,
      location: JSON.stringify(location),
      received_time: state.received_time,
      vendor_id: receiveOrder.vendor_id,
      received_by: parseInt(state.received_by, 10),
      verification: JSON.stringify({
        verified: false,
        verified_by: null,
      }),
      update_stocks: false,
      stock_id: receiveOrder.stock_id,
      images: JSON.stringify(uploadedUrls),
      files: [],
    };
  };

  const addToCart = () => {
    const d = makeData();
    if (d) {
      setGroupData({
        ...groupData,
        [receiveOrder.porder_id]: d,
      });
      setState(initData);
    }
  };

  const singleItem = () => {
    var data = {};
    if (Object.entries(groupData).length === 1) {
      data = groupData[receiveOrder.porder_id];
    } else {
      data = makeData();
    }

    if (data) {
      axiosInstance(token)
        .post('/createReceiveOrderForProject', data)
        .then(({data}) => {
          dispatch(resetImages());
          dispatch(
            setReceiveOrders({
              project_id,
              data: [...receiveOrders, data.data],
            }),
          );
          setShowModal(false);
          resetFields();
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Received order succesfully.',
          });
        })
        .catch(err => {
          setShowModal(false);
          resetFields();
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: 'Failed to receive order.',
          });
          console.log(err, '/createReceiveOrderForProject');
        });
    }
  };

  const multiItem = () => {
    const submitData = {
      pos: eachPurchasedOrderAsGroup.map(x => ({
        stock_id: x.stock_id,
        porder_id: x.porder_id,
        quantity: x.quantity,
      })),
      items: groupData,
      images: JSON.stringify(uploadedUrls),
    };

    axiosInstance(token)
      .post('/receiveGroupedOrderForProject', submitData)
      .then(({data}) => {
        dispatch(resetImages());
        dispatch(
          setReceiveOrders({
            project_id,
            data: [...receiveOrders, ...data.data],
          }),
        );
        setShowModal(false);
        resetFields();
        Toast.show({
          type: 'success',
          text1: 'success',
          text2: 'Receive order created succesfully.',
        });
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to create receive order.',
        });
      });
  };

  const createReceiveOrderForProject = () => {
    if (Object.entries(groupData).length > 1) {
      multiItem();
    } else {
      singleItem();
    }
  };

  const resetFields = () => {
    setState(initData);
    dispatch(resetImages());
  };

  if (!receiveOrder) return null;

  return (
    <View style={{marginTop: 10}}>
      {eachPurchasedOrderAsGroup.length ? (
        <View style={{marginVertical: 10}}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={eachPurchasedOrderAsGroup}
            renderItem={({item: porder, index}) => {
              if (
                porder.status === 'verify_purchase' ||
                porder.quantity <= porder.received
              ) {
                return null;
              }
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor:
                      receiveOrder.porder_id === porder.porder_id
                        ? '#4da6ff'
                        : '#e0e0e0',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    padding: 5,
                    marginRight: 4,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                      setState(initData);
                      setReceiveOrder(porder);
                      if (groupData[porder.porder_id]) {
                        setState(groupData[porder.porder_id]);
                      }
                      // setState({...state, ...porder});
                    }}>
                    <Text
                      style={{
                        marginRight: 5,
                        color:
                          receiveOrder.porder_id === porder.porder_id
                            ? 'white'
                            : 'black',
                      }}>
                      {stocksObject[porder.stock_id]?.name}
                    </Text>
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 3,
                        paddingHorizontal: 4,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 12,
                        }}>
                        {groupData?.[porder?.porder_id]?.quantity || 0}{' '}
                        {stocksObject[porder.stock_id].unit}
                        {/* {JSON.stringify(groupData[state.porder_id])} */}
                        {/* // received || 0}{' '}
                        {stocksObject[porder.stock_id].unit} */}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
            }}
          />
        </View>
      ) : null}
      {receiveOrder && (
        <View style={{paddingBottom: 10}}>
          <View style={{marginBlock: 5}}>
            <Text>
              Receive Material:{' '}
              <Text style={{fontWeight: '600', fontSize: 16}}>
                {stocksObject?.[receiveOrder?.stock_id]?.name}
              </Text>
            </Text>
          </View>
          <View style={{marginBlock: 5}}>
            <Text>
              Vendor:{' '}
              <Text style={{fontWeight: '600', fontSize: 16}}>
                {activeVendor?.name}
              </Text>
            </Text>
          </View>
          <View style={{marginBlock: 5}}>
            <Text>
              Order Quantity:{' '}
              <Text style={{fontWeight: '600'}}>{receiveOrder.quantity}</Text>{' '}
              {stocksObject && stocksObject?.[state?.stock_id]?.unit}
            </Text>
          </View>
          <View style={{marginBlock: 5}}>
            <Text>
              Total Received:{' '}
              <Text style={{fontWeight: '600'}}>
                {receiveOrder.received || 0}
              </Text>{' '}
              {stocksObject && stocksObject?.[state?.stock_id]?.unit}
            </Text>
          </View>
        </View>
      )}

      <View>
        <Input
          value={state.quantity.toString()}
          label="Received Quantity"
          keyboardType="numeric"
          onChangeText={e => {
            setState({
              ...state,
              quantity: e,
            });
          }}
        />
        <Input
          value={state.vehicle_no}
          label="Vehicle Number"
          autoCapitalize="characters"
          onChangeText={e => {
            setState({
              ...state,
              vehicle_no: e,
            });
          }}
        />
        <LocationComponent setLocation={setLocation} location={location} />

        {/* <Input
          value={state.location}
          label="Location"
          onChangeText={e => {
            setState({
              ...state,
              location: e,
            });
          }}
        /> */}
        <SelectDropdown
          key={state.received_by}
          buttonStyle={styles.dropdownButtonStyle}
          buttonTextStyle={styles.dropdownButtonText}
          renderDropdownIcon={() => (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={'#666'}
            />
          )}
          renderSearchInputLeftIcon={() => (
            <MaterialIcons name="search" size={20} />
          )}
          dropdownStyle={{
            borderRadius: 8,
          }}
          data={users}
          // defaultValue={state.received_by || 0}
          defaultButtonText={
            state.received_by
              ? `${userObject[state.received_by]?.fname} ${
                  userObject[state.received_by]?.lname
                }`
              : 'Select Receiver'
          }
          // defaultButtonText={
          //   state.received_by
          //     ? `${userObject[state.received_by].fname} ${
          //         userObject[state.received_by].lname
          //       }`
          //     : `${userObject[0].fname} ${userObject[0].lname}`
          // }
          onSelect={selectedItem => {
            setState({
              ...state,
              received_by: selectedItem.user_id,
            });
          }}
          buttonTextAfterSelection={selectedItem => {
            return `${selectedItem.fname} ${selectedItem.lname}`;
          }}
          rowTextForSelection={item => {
            return `${item.fname} ${item.lname}`;
          }}
        />

        <View style={{flexDirection: 'row', marginTop: 6}}>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                width: '82%',
                borderColor: isReceivedTimePickerVisible
                  ? Colors.primary
                  : '#bbb',
                marginRight: 'auto',
              },
            ]}
            onPress={() =>
              setReceivedTimePickerVisible(!isReceivedTimePickerVisible)
            }>
            <Text style={styles.dateLabel}>Received Time</Text>
            <Text style={styles.date}>{formatDate(state.received_time)}</Text>
          </TouchableOpacity>
          <CustomButton
            buttonStyle={{
              backgroundColor: Colors.primary,
              height: 48,
              width: 48,
              borderRadius: 10,
              marginLeft: 'auto',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={handleTakePicture}>
            <MaterialIcons name="camera-alt" size={22} color={'white'} />
          </CustomButton>
        </View>

        {isReceivedTimePickerVisible && (
          <View>
            <DateTimePicker
              value={state.received_time}
              onValueChange={date => {
                setState({
                  ...state,
                  received_time: date,
                });
                setReceivedTimePickerVisible(false);
              }}
            />
          </View>
        )}

        <FlatList
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 10}}
          keyExtractor={item => item.id}
          data={
            imageUploadLoading
              ? [...uploadedUrls, {skeleton: true, id: 10000}]
              : uploadedUrls
          }
          horizontal={true}
          renderItem={({item}) => {
            if (item.skeleton) {
              return <ImageLoadingSkeleton key={item.id} />;
            } else {
              return (
                <View
                  style={{marginRight: 10, position: 'relative'}}
                  key={item.id}>
                  <Image
                    source={{
                      uri: `${IMAGE_URL}/previewUploadedImage/thumbnail-${item.fullName}`,
                      headers: {
                        Authorization: token,
                      },
                    }}
                    style={{width: 60, height: 80, borderRadius: 8}}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 18,
                      height: 18,
                    }}>
                    <TouchableOpacity
                      onPress={() => dispatch(deleteImage({id: item.id}))}>
                      <MaterialIcons
                        name="delete-outline"
                        size={18}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            height: 44,
            width: 44,
            borderRadius: 10,
            marginRight: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={addToCart}>
          <MaterialIcons name="add-shopping-cart" size={22} color={'white'} />
        </CustomButton>
        <View style={{flex: 1, width: '100%'}}>
          <CustomButton
            buttonStyle={{
              backgroundColor: Colors.primary,
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
            }}
            onClick={createReceiveOrderForProject}>
            <Text style={{color: 'white', fontSize: 16}}>Receive Order</Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

export const ReceivePOModal = props => {
  const {showModal, setShowModal} = props;
  const dispatch = useDispatch();

  return (
    <CustomModal
      title="Receive Purchased Order"
      visible={showModal}
      closeModal={() => {
        dispatch(resetImages());
        setShowModal(false);
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
