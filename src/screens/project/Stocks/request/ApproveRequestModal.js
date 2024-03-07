import {Text, View} from 'react-native';
import CustomModal from '../../../../components/CustomModal';
import {useEffect, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import Toast from 'react-native-toast-message';
import Input from '../../../../components/Input';
import CustomDropdown from '../../../../components/CustomDropdown';

const FormComponent = ({
  setShowModal,
  project_id,
  setActivity,
  requestedStocks,
  authUser,
  activity,
}) => {
  const token = useSelector(state => state.auth.token, shallowEqual);
  const stocks = useSelector(
    state => state.stock.stocks[project_id],
    shallowEqual,
  );
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    setQuantity(activity.activeRequest.quantity);
  }, []);

  const verifyRequest = () => {
    axiosInstance(token)
      .post('/verifyAndUpdateStockRequest', {
        project_id,
        request_id: activity.activeRequest.request_id,
        verification: JSON.stringify({
          verified: true,
          verified_by: authUser.user_id,
        }),
        quantity: quantity,
      })
      .then(() => {
        const newData = requestedStocks.map(x => {
          if (x.request_id === activity.activeRequest.request_id) {
            return {
              ...x,
              quantity: quantity,
              verification: JSON.stringify({
                verified: true,
                verified_by: authUser.user_id,
              }),
            };
          }
          return x;
        });
        setActivity(prev => ({...prev, requestedStocks: newData}));
        setShowModal(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Stock request approved succesfully.',
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to approve request.',
        });
        console.error(err);
      });
  };

  return (
    <View style={{marginTop: 10}}>
      <CustomDropdown
        disabled
        value={stocks.asObject[activity.activeRequest.stock_id].name}
        label="Select Material"
        data={stocks.asArray}
        renderDisplayItem={item => {
          return item.name;
        }}
      />
      <Input
        value={quantity.toString()}
        label={`Quantity (${
          stocks.asObject[activity.activeRequest.stock_id].unit
        })`}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <CustomButton
        buttonStyle={{
          backgroundColor: Colors.primary,
          borderRadius: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
        }}
        onClick={verifyRequest}>
        <Text style={{color: 'white', fontSize: 16}}>Approve</Text>
      </CustomButton>
    </View>
  );
};
const ApproveRequestModal = props => {
  const {activity, setActivity} = props;

  return (
    <CustomModal
      title={'Approve Request Material'}
      visible={activity.showApproveModal}
      closeModal={() =>
        setActivity(prev => ({...prev, showApproveModal: false}))
      }>
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default ApproveRequestModal;
