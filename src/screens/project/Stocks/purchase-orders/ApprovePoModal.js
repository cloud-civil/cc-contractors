import React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import {TextInput} from 'react-native-paper';
import styles from '../../../../styles/styles';
import {theme} from '../../../../styles/theme';
import Colors from '../../../../styles/Colors';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {setPurchaseOrders} from '../../../../cc-hooks/src/appSlice';
import Toast from 'react-native-toast-message';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from '../../../../components/CustomModal';
import {CustomButton} from '../../../../components/CustomButton';

const makeInt = d => {
  if (typeof d === 'string') {
    return parseInt(d, 10);
  }
  return d;
};

const initData = {
  porder_id: '',
  stock_id: '',
  stock_name: '',
  vendor_id: '',
  discount_percent: 0,
  discount_price: 0,
  order_date: new Date(),
  expiry_date: new Date(),
  quantity: 0,
  max_quantity: 0,
  tax: 0,
  terms: '',
  rate: 0,
  totalAmount: 0,
  remarks: '',
  needsVerification: false,
  final_amount: 0,
  verified: false,
  verified_by: null,
};

const dataEntryValid = state => {
  if (!state['stock_id']) {
    return false;
  }
  if (!state['quantity']) {
    return false;
  }
  if (!state['vendor_id']) {
    return false;
  }
  return true;
};

const FormComponent = props => {
  const {
    project_id,
    setShowModal,
    eachPurchasedOrderAsGroup,
    purchasedOrders,
    activeOrderId,
  } = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const stocks = useSelector(state => state.stock.stocks, shallowEqual);
  const stocksAsObject =
    (stocks[project_id] && stocks[project_id].asObject) || [];
  const [state, setState] = useState(initData);
  const [groupData, setGroupData] = useState({});
  const vendors = useSelector(state => state.app.vendors.asArray, shallowEqual);
  const vendorsAsObject = useSelector(
    state => state.app.vendors.asObject,
    shallowEqual,
  );

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const x = {};

    eachPurchasedOrderAsGroup.forEach(y => {
      const l = JSON.parse(y.verification);
      if (y.status === 'verify_purchase') {
        x[y.stock_id] = {...y, ...l};
      }
    });
    setGroupData(x);
    eachPurchasedOrderAsGroup.map(item => {
      if (item.porder_id === activeOrderId) {
        setState(item);
        return;
      }
    });
  }, []);

  const makeData = () => {
    const isValid = dataEntryValid(state);
    if (!isValid) {
      Toast.show({
        type: 'error',
        text1: 'Invalid',
        text2: 'Empty Fill up the form',
      });
      return false;
    }

    return {
      porder_id: state.porder_id,
      org_id: userOrg.org_id,
      stock_id: makeInt(state.stock_id),
      vendor_id: makeInt(state.vendor_id),
      discount_percent: parseFloat(state.discount_percent),
      discount_price: parseFloat(state.discount_price),
      order_date: state.order_date,
      expiry_date: state.expiry_date,
      quantity: parseFloat(state.quantity),
      max_quantity: parseFloat(state.max_quantity),
      tax: parseFloat(state.tax),
      terms: state.terms,
      rate: parseFloat(state.rate),
      project_id: makeInt(project_id),
      metadata: JSON.stringify({
        user_id: userOrg.user_id,
      }),
      verification: JSON.stringify({
        verified: true,
        verified_by: authUser.user_id,
      }),
      received: 0,
      remarks: state.remarks,
    };
  };

  const approvePurchaseOrder = () => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    const purchase_order = makeData();

    axiosInstance(token)
      .post('/verifyOrderByPurchaseId', purchase_order)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Approved succesfully.',
        });
        dispatch(
          setPurchaseOrders({
            project_id,
            data: purchasedOrders.map(p => {
              if (p.porder_id === state.porder_id) {
                return {
                  ...p,
                  ...state,
                  verification: JSON.stringify({
                    verified: true,
                    verified_by: authUser.user_id,
                  }),
                  status: 'receive_order',
                };
              }
              return p;
            }),
          }),
        );

        resetFields();
        setSubmitting(false);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: err?.response?.data?.message,
        });
        console.log(err, 'err');
        resetFields();
        setSubmitting(false);
      });
  };

  const resetFields = () => {
    setShowModal(false);
    setState(initData);
  };

  return (
    <View style={{marginTop: 10}}>
      {Object.keys(groupData).length ? (
        <View style={{marginVertical: 10}}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={Object.values(groupData)}
            renderItem={({item: porder, index}) => {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor:
                      state.porder_id === porder.porder_id
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
                      setState(porder);
                    }}>
                    <Text
                      style={{
                        marginRight: 5,
                        color:
                          state.porder_id === porder.porder_id
                            ? 'white'
                            : 'black',
                      }}>
                      {stocksAsObject[porder.stock_id].name}
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
                        {porder.quantity} {stocksAsObject[porder.stock_id].unit}
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
      <View style={{marginTop: 4}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput
            value={state.quantity.toString()}
            style={[styles.inputField, {width: '49%'}]}
            mode={'outlined'}
            label="Quantity"
            theme={theme}
            onChangeText={e => {
              const q = parseInt(e, 10);
              setState({
                ...state,
                quantity: e,
                totalAmount: q * state.rate,
              });
            }}
          />
          <TextInput
            value={state.rate.toString()}
            style={[styles.inputField, {width: '49%'}]}
            mode={'outlined'}
            label="Stock Rate"
            theme={theme}
            onChangeText={e => {
              setState({
                ...state,
                rate: e,
              });
            }}
          />
        </View>
        <SelectDropdown
          disabled
          buttonStyle={styles.dropdownButtonStyle}
          buttonTextStyle={styles.dropdownButtonText}
          // defaultButtonText="Select Vendor..."
          defaultButtonText={vendorsAsObject[state?.vendor_id]?.name}
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
          data={vendors}
          onSelect={selectedItem => {
            setState({
              ...state,
              vendor_id: selectedItem.vendor_id,
            });
          }}
          buttonTextAfterSelection={selectedItem => {
            return (
              <Text style={{textTransform: 'capitalize'}}>
                {selectedItem.name}
              </Text>
            );
          }}
          rowTextForSelection={item => {
            return (
              <Text style={{textTransform: 'capitalize'}}>{item.name}</Text>
            );
          }}
        />
        <View style={customStyle.horBar} />

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput
            value={state.discount_percent.toString()}
            style={[styles.inputField, {width: '49%'}]}
            mode={'outlined'}
            label="Discount Percent"
            theme={theme}
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
          <TextInput
            value={state.discount_price.toString()}
            style={[styles.inputField, {width: '49%'}]}
            mode={'outlined'}
            label="Discount INR"
            theme={theme}
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

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput
            value={state.tax.toString()}
            style={[styles.inputField, {width: '49%'}]}
            mode={'outlined'}
            label="Tax(%)"
            theme={theme}
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
          <TextInput
            value={state.terms.toString()}
            style={[styles.inputField, {width: '49%'}]}
            mode={'outlined'}
            label="Terms"
            theme={theme}
            onChangeText={e => {
              setState({
                ...state,
                terms: e,
              });
            }}
          />
          <TextInput
            value={state.remarks.toString()}
            style={[styles.inputField, {width: '49%'}]}
            mode={'outlined'}
            label="Remarks"
            theme={theme}
            onChangeText={e => {
              setState({
                ...state,
                remarks: e,
              });
            }}
          />
        </View>
      </View>

      <View style={{height: 46, marginTop: 6}}>
        {state.verified ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name="check-decagram"
              color={'green'}
              size={18}
            />
            <Text style={{color: 'green', fontSize: 16, marginLeft: 4}}>
              Already Approved
            </Text>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <CustomButton
              buttonStyle={{
                backgroundColor: Colors.primary,
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 12,
              }}
              onClick={approvePurchaseOrder}>
              <Text style={{color: 'white', fontSize: 16}}>Approve Order</Text>
            </CustomButton>
          </View>
        )}
      </View>
    </View>
  );
};
export const ApprovePOModal = props => {
  const {showModal, setShowModal} = props;

  return (
    <CustomModal
      title="Approve Purchase Order"
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};

const customStyle = StyleSheet.create({
  horBar: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 8,
    marginBottom: 12,
    marginHorizontal: 4,
  },
});
