import {useEffect, useState} from 'react';
import CustomModal from '../../../../components/CustomModal';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import styles from '../../../../styles/styles';
import Colors from '../../../../styles/Colors';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CustomButton} from '../../../../components/CustomButton';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {setPurchaseOrders} from '../../../../cc-hooks/src/appSlice';
import Toast from 'react-native-toast-message';
import Input from '../../../../components/Input';
import {formateAmount} from '../../../../utils';
import CustomDropdown from '../../../../components/CustomDropdown';

const FormComponent = props => {
  const {
    project_id,
    project_permissions,
    user_roles,
    setShowModal,
    activeVendor,
    activeStockRequest,
  } = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const purchasedOrders = useSelector(
    state => state.app.porders[project_id],
    shallowEqual,
  );
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const stocks__ = useSelector(state => state.stock.stocks, shallowEqual);
  const stocks = (stocks__[project_id] && stocks__[project_id].asArray) || [];
  const stocksObject__ = useSelector(state => state.stock.stocks, shallowEqual);
  const stocksObject =
    (stocksObject__[project_id] && stocksObject__[project_id].asObject) || [];
  const vendorsArray = useSelector(
    state => state.app.vendors.asArray,
    shallowEqual,
  );
  const vendorsObject = useSelector(
    state => state.app.vendors.asObject,
    shallowEqual,
  );

  const [state, setState] = useState(initData);
  const [groupData, setGroupData] = useState({});
  const [isPreview, setPreview] = useState(false);

  useEffect(() => {
    const verifyPermission = project_permissions.find(
      v => v.settings_name === 'verify_purchase_order',
    );
    if (verifyPermission) {
      setState(prevState => ({
        ...prevState,
        needsVerification: true,
        whoVerify: verifyPermission.setting_value,
      }));
    }
  }, []);

  useEffect(() => {
    if (activeVendor) {
      setState(prevState => ({
        ...prevState,
        vendor_id: activeVendor.vendor_id,
      }));
    }

    if (activeStockRequest) {
      setState(prevState => ({
        ...prevState,
        stock_id: activeStockRequest.stock_id,
        quantity: activeStockRequest.quantity || '',
        rate: stocksObject[activeStockRequest.stock_id]?.rate || '',
      }));
    }
  }, []);

  useEffect(() => {
    if (state.whoVerify) {
      const canVerify = user_roles.some(
        u => u.user_role === state.whoVerify && userOrg.user_id === u.user_id,
      );
      setState(prevState => ({...prevState, canVerify}));
    }
  }, [state.whoVerify]);

  const makeData = data => {
    const isValid = dataEntryValid(data);
    if (!isValid) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete',
        text2: 'Fill up the form',
      });
      return false;
    }
    const x = {
      org_id: userOrg.org_id,
      stock_id: parseInt(data.stock_id, 10),
      vendor_id: parseInt(state.vendor_id),
      quantity: parseFloat(data.quantity),
      max_quantity: parseFloat(data.max_quantity),
      discount_percent: parseFloat(data.discount_percent),
      discount_price: parseFloat(data.discount_price),
      rate: parseFloat(data.rate),
      order_date: data.order_date,
      expiry_date: data.expiry_date,
      tax: parseFloat(data.tax),
      terms: data.terms,
      project_id: parseInt(project_id),
      metadata: JSON.stringify({
        user_id: userOrg.user_id,
        user_name: `${authUser.fname} ${authUser.lname}`,
      }),
      verification: JSON.stringify({
        verified: false,
        verified_by: null,
      }),
      received: 0,
      remarks: data.remarks,
    };
    return x;
  };

  const addToCart = () => {
    if (!state.stock_id) {
      Alert.alert('Invalid Material', 'Please select a valid material');
      return;
    }
    if (state.quantity == 0 || state.quantity == '') {
      Alert.alert('Invalid Quantity', 'Please provide a valid quantity');
      return;
    }
    setGroupData(prev => ({
      ...prev,
      [state.stock_id]: {
        org_id: userOrg.org_id,
        stock_id: state.stock_id,
        rate: state.rate,
        vendor_id: state.vendor_id,
        discount_percent: state.discount_percent,
        discount_price: state.discount_price,
        order_date: state.order_date,
        expiry_date: state.expiry_date,
        quantity: state.quantity,
        max_quantity: state.max_quantity,
        tax: state.tax,
        terms: state.terms,
        project_id: project_id,
        metadata: JSON.stringify({
          user_id: userOrg.user_id,
        }),
        verification: JSON.stringify({
          verified: false,
          verified_by: null,
        }),
        received: 0,
        remarks: state.remarks,
      },
    }));
    setState({...initData, vendor_id: state.vendor_id});
  };

  const singleItem = () => {
    const purchase_order = makeData();

    axiosInstance(token)
      .post('/createPurchaseOrderForProject', purchase_order)
      .then(({data}) => {
        dispatch(
          setPurchaseOrders({
            project_id,
            data: [data.data, ...purchasedOrders.asArray],
          }),
        );
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Purchase order created successfully',
        });
        resetFields();
        setShowModal(false);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: err.response.data.message,
        });
        console.log(
          err,
          '/vendorPurchaseOrderForProject singleItem',
          err.response.data.message,
        );
      });
  };

  const multiItem = () => {
    const submitData = {};

    Object.values(groupData).map(x => {
      submitData[x.stock_id] = makeData(x);
    });

    axiosInstance(token)
      .post('/vendorPurchaseOrderForProject', {
        items: submitData,
      })
      .then(({data}) => {
        dispatch(
          setPurchaseOrders({
            project_id,
            data: [...data.data, ...purchasedOrders.asArray],
          }),
        );
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Purchase order created successfully',
        });
        resetFields();
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: err.response.data.message,
        });
        console.log(
          err,
          '/vendorPurchaseOrderForProject multiItem',
          err.response.data.message,
        );
      });
  };

  const createPurchaseOrderForProject = () => {
    if (Object.entries(groupData).length > 0) {
      multiItem();
    } else {
      singleItem();
    }
  };

  const resetFields = () => {
    setShowModal(false);
    setState(initData);
  };

  const calculateValue = item => {
    const totalAmount =
      (parseFloat(item.quantity) + parseFloat(item.max_quantity)) *
      parseFloat(item.rate);
    let finalAmount = 0;
    let gst = 0;
    if (item.discount_percent) {
      const _discountPercent =
        totalAmount - (parseFloat(item.discount_percent) / 100) * totalAmount;
      finalAmount = _discountPercent;
    } else if (item.discount_price) {
      const _discountPrice = totalAmount - parseFloat(item.discount_price);
      finalAmount = _discountPrice;
    } else {
      finalAmount = totalAmount;
    }

    if (item.tax) {
      gst = (item.tax / 100) * finalAmount;
    }

    return {finalAmount: finalAmount + gst, totalAmount};
  };

  const calculateTotalPayable = () => {
    if (Object.keys(groupData).length) {
      return Object.values(groupData).reduce((sum, item) => {
        const {finalAmount} = calculateValue(item);
        return finalAmount + sum;
      }, 0);
    } else {
      return calculateValue(state).finalAmount;
    }
  };

  return (
    <View style={{marginTop: 10, minHeight: 410}}>
      {Object.keys(groupData).length ? (
        <View style={{marginVertical: 10}}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={Object.values(groupData)}
            renderItem={({item, index}) => {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor:
                      state.stock_id === item.stock_id ? '#4da6ff' : '#e0e0e0',
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
                      setState(item);
                    }}>
                    <Text
                      style={{
                        marginRight: 5,
                        color:
                          state.stock_id === item.stock_id ? 'white' : 'black',
                      }}>
                      {stocksObject[item.stock_id]?.name}
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
                        {item.quantity} {stocksObject[item.stock_id].unit}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={() => handleRemoveItem(key)}>
                  <MaterialIcons name="close" color={'white'} size={16} />
                </TouchableOpacity> */}
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

      {!isPreview ? (
        <View>
          <View style={{}}>
            {stocks.length ? (
              <CustomDropdown
                disabled={activeStockRequest ? true : false}
                value={
                  state && state.stock_id
                    ? stocksObject[state.stock_id]?.name
                    : 'Select Material'
                }
                label="Select Material"
                data={stocks}
                onSelect={item => {
                  const stock_id = parseInt(item.stock_id, 10);
                  const selectedStock = stocks.find(
                    stock => stock.stock_id === stock_id,
                  );
                  setState(prev => ({
                    ...prev,
                    stock_name: selectedStock?.name,
                    stock_id,
                    rate: (stocksObject && stocksObject[stock_id]?.rate) || '',
                  }));
                }}
                style={{marginTop: 6}}
                renderDisplayItem={item => {
                  return item?.name;
                }}
              />
            ) : (
              <Text style={{marginVertical: 14}}>
                No material has been added, Create material before.
              </Text>
            )}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '49%'}}>
              <Input
                value={state.quantity.toString()}
                keyboardType="numeric"
                label={`Quantity *${
                  activeStockRequest
                    ? ' (' +
                      stocksObject[activeStockRequest.stock_id].unit +
                      ')'
                    : ''
                }`}
                onChangeText={e => {
                  setState({
                    ...state,
                    quantity: e,
                  });
                }}
              />
            </View>
            <View style={{width: '49%'}}>
              <Input
                value={state.rate.toString()}
                keyboardType="numeric"
                label="Material rate per unit"
                onChangeText={e => {
                  setState({
                    ...state,
                    rate: e,
                  });
                }}
              />
            </View>
          </View>

          {activeStockRequest && (
            <View style={{marginVertical: 0}}>
              <CustomDropdown
                value={
                  state && state.vendor_id
                    ? vendorsObject[state.vendor_id]?.name
                    : 'Select Vendor'
                }
                label="Select Vendor"
                data={vendorsArray}
                onSelect={item => {
                  setState(prevState => ({
                    ...prevState,
                    vendor_id: item.vendor_id,
                  }));
                }}
                style={{marginTop: 6}}
                renderDisplayItem={item => {
                  return item?.name;
                }}
              />
            </View>
          )}

          <View style={customStyle.horBar} />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '49%'}}>
              <Input
                value={state.discount_percent}
                keyboardType="numeric"
                label="Discount Percent"
                onChangeText={e => {
                  if (state.discount_price) {
                    setState({
                      ...state,
                      discount_price: 0,
                    });
                  }
                  setState({
                    ...state,
                    discount_percent: e,
                  });
                }}
              />
            </View>
            <View style={{width: '49%'}}>
              <Input
                value={state.discount_price.toString()}
                keyboardType="numeric"
                label="Discount INR"
                onChangeText={e => {
                  if (state.discount_percent) {
                    setState({
                      ...state,
                      discount_percent: 0,
                    });
                  }
                  setState({
                    ...state,
                    discount_price: e,
                  });
                }}
              />
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Input
              value={state.tax.toString()}
              label="Tax (%)"
              keyboardType="numeric"
              onChangeText={e => {
                setState({
                  ...state,
                  tax: e,
                });
              }}
            />
          </View>

          <View style={customStyle.horBar} />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '49%'}}>
              <Input
                value={state.terms}
                label="Terms"
                onChangeText={e => {
                  setState({
                    ...state,
                    terms: e,
                  });
                }}
              />
            </View>
            <View style={{width: '49%'}}>
              <Input
                value={state.remarks}
                label="Remarks"
                onChangeText={e => {
                  setState({
                    ...state,
                    remarks: e,
                  });
                }}
              />
            </View>
          </View>
        </View>
      ) : (
        <View>
          {Object.keys(groupData).length ? (
            Object.values(groupData).map((item, index) => {
              const {totalAmount, finalAmount} = calculateValue(item);

              return (
                <View style={{marginBottom: 10}} key={index}>
                  <View style={customStyle.horBar} />
                  <Text style={{fontWeight: 600, fontSize: 16}}>
                    {stocksObject[item.stock_id]?.name}
                  </Text>
                  <Text style={{fontSize: 12}}>
                    Amount without tax and discount:{' '}
                    <Text style={{fontWeight: 500}}>
                      {formateAmount(totalAmount)} INR
                    </Text>
                  </Text>
                  <Text style={{fontSize: 12}}>
                    Payable Amount including tax and discount:{' '}
                    <Text style={{fontWeight: 500}}>
                      {formateAmount(finalAmount)} INR
                    </Text>
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={{marginBottom: 10}}>
              <View style={customStyle.horBar} />
              <Text style={{fontWeight: 600, fontSize: 16}}>
                {stocksObject[state.stock_id]?.name}
              </Text>
              <Text style={{fontSize: 12}}>
                Amount without tax and discount:{' '}
                <Text style={{fontWeight: 500}}>
                  {formateAmount(calculateValue(state).totalAmount, 2)} INR
                </Text>
              </Text>
              <Text style={{fontSize: 12}}>
                Payable Amount including tax and discount:{' '}
                <Text style={{fontWeight: 500}}>
                  {formateAmount(calculateValue(state).finalAmount, 2)} INR
                </Text>
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={{marginTop: 'auto'}}>
        {isPreview ? (
          <View>
            <View style={styles.horizontalBar} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <Text>Total Payable</Text>
              <Text>
                <Text style={{fontWeight: '600'}}>
                  {formateAmount(calculateTotalPayable(), 2)}
                </Text>{' '}
                INR
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <CustomButton
                  buttonStyle={{
                    backgroundColor: '#666',
                    borderRadius: 8,
                    paddingVertical: 12,
                    marginRight: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => setPreview(false)}>
                  <MaterialIcons name="arrow-back" size={18} color={'white'} />
                  <Text style={{color: 'white', fontSize: 16, marginLeft: 6}}>
                    Go Back
                  </Text>
                </CustomButton>
              </View>
              <View style={{flex: 1}}>
                <CustomButton
                  buttonStyle={{
                    backgroundColor: Colors.primary,
                    borderRadius: 8,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 12,
                    width: '100%',
                  }}
                  onClick={createPurchaseOrderForProject}>
                  <Text style={{color: 'white', fontSize: 16}}>
                    Purchase Order
                  </Text>
                </CustomButton>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {activeStockRequest ? null : (
              <View style={{flex: 1}}>
                <CustomButton
                  buttonStyle={{
                    backgroundColor: Colors.primary,
                    borderRadius: 8,
                    paddingVertical: 12,
                    marginRight: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={addToCart}>
                  <Text style={{color: 'white', fontSize: 16, marginRight: 6}}>
                    {groupData[state.stock_id]
                      ? 'Save'
                      : state.stock_id && parseInt(state.quantity) > 0
                      ? 'Add'
                      : 'Add More'}
                  </Text>
                  {groupData[state.stock_id] ? null : (
                    <MaterialIcons
                      name="add-shopping-cart"
                      size={18}
                      color={'white'}
                    />
                  )}
                </CustomButton>
              </View>
            )}
            <View style={{flex: 1}}>
              <CustomButton
                buttonStyle={{
                  backgroundColor: Colors.primary,
                  borderRadius: 8,
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 12,
                  width: Platform.OS === 'android' ? '100%' : '98%',
                }}
                onClick={() => {
                  if (activeStockRequest && !state.vendor_id) {
                    Toast.show({
                      type: 'error',
                      text1: 'Vendor',
                      text2: 'Select vendor begore going previewing',
                    });
                  } else {
                    setPreview(true);
                  }
                }}>
                <Text style={{color: 'white', fontSize: 16}}>Preview</Text>
              </CustomButton>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export const CreatePOModal = props => {
  const {showModal, setShowModal, setActiveStockRequest} = props;

  return (
    <CustomModal
      title="Create Purchase Order"
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
        setActiveStockRequest && setActiveStockRequest(null);
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};

const initData = {
  stock_id: '',
  stock_name: null,
  vendor_id: '',
  discount_percent: '0',
  discount_price: '0',
  order_date: new Date(),
  expiry_date: new Date(),
  quantity: '0',
  max_quantity: '0',
  tax: '0',
  terms: '',
  rate: '0',
  totalAmount: '0',
  remarks: '',
  needsVerification: false,
  whoVerify: null,
  canVerify: false,
  final_amount: '0',
};

const dataEntryValid = state => {
  if (!state.stock_id || !state.quantity) {
    return false;
  }
  return true;
};

const customStyle = StyleSheet.create({
  horBar: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 4,
    marginBottom: 10,
    marginHorizontal: 4,
  },
});
