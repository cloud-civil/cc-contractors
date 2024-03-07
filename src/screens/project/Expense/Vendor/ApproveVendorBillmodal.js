import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import Colors from '../../../../styles/Colors';
import {CustomButton} from '../../../../components/CustomButton';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import {formateAmount} from '../../../../utils';
import CustomModal from '../../../../components/CustomModal';
import Input from '../../../../components/Input';
import Toast from 'react-native-toast-message';

const FormComponent = props => {
  const {setShowModal, project_id, activeItem, setRender} = props;

  const token = useSelector(state => state.auth.token);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    setAmount(activeItem.amount.toString());
  }, []);

  const approveBill = () => {
    axiosInstance(token)
      .post('/expense/vendor/approveMaterialVendorBill', {
        payment_id: activeItem.payment_id,
        bill_id: activeItem.bill_id,
        vendor_id: activeItem.vendor_id,
        amount: parseFloat(amount),
        project_id,
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Bill approved succesfully',
        });
        setShowModal(false);
        setRender(prev => prev + 1);
      })
      .catch(err => {
        Toast.show({type: 'error', text1: 'error', text2: 'Failed to approve'});
        console.log(
          err,
          '/expense/vendor/approveMaterialVendorBill',
          err?.response?.data?.message,
        );
      });
  };

  return (
    <View style={{marginTop: 10}}>
      <Text style={{marginBottom: 10}}>
        Bill Amount:{' '}
        <Text style={{fontWeight: '600'}}>
          {formateAmount(activeItem.amount) || 'NA'} INR
        </Text>
      </Text>
      <Input
        value={amount}
        keyboardType="numeric"
        label="Approve Amount"
        onChangeText={setAmount}
      />

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
          onClick={approveBill}>
          <Text style={{color: 'white', fontSize: 16}}>Approve</Text>
        </CustomButton>
      </View>
    </View>
  );
};
export const ApproveVendorBillModal = props => {
  const {showModal, setShowModal} = props;

  return (
    <CustomModal
      title="Approve Amount"
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
