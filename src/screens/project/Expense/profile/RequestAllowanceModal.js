import {View} from 'react-native';
import {CustomButton} from '../../../../components/CustomButton';
import Input from '../../../../components/Input';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {resetImages} from '../../../../cc-hooks/src/imageSlice';
import Colors from '../../../../styles/Colors';
import {Text} from 'react-native';
import CustomModal from '../../../../components/CustomModal';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import Toast from 'react-native-toast-message';

const FormComponent = props => {
  const {project_id, setShowModal, setReRender} = props;
  const token = useSelector(state => state.auth.token);
  const authUser = useSelector(state => state.auth.user);
  const [amount, setAmount] = useState('');

  const requestExpense = () => {
    if (amount) {
      const data = {
        amount: parseFloat(amount),
        project_id,
        user_id: authUser.user_id,
      };
      axiosInstance(token)
        .post('/expense/requestUserAllowance', data)
        .then(() => {
          setShowModal(false);
          setReRender(prev => prev + 1);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Allowance requested succesfully.',
          });
        })
        .catch(err => {
          console.log(
            err,
            '/expense/requestUserAllowance',
            err?.response?.data?.message,
          );
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: 'Failed to request allowance',
          });
        });
    }
  };

  return (
    <View>
      <View style={{marginTop: 10}}>
        <Input
          label={'Amount'}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      <View style={{flex: 1}}>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            flex: 1,
            marginTop: 6,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}
          onClick={requestExpense}
          style={{width: '45%'}}>
          <Text style={{textAlign: 'center', color: 'white'}}>Request</Text>
        </CustomButton>
      </View>
    </View>
  );
};

const RequestAllowanceModal = props => {
  const {showModal, setShowModal} = props;
  const dispatch = useDispatch();
  return (
    <CustomModal
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
        dispatch(resetImages());
      }}
      title="Request Allowance">
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default RequestAllowanceModal;
