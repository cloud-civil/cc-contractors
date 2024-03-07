import {useState} from 'react';
import CustomModal from '../../../../components/CustomModal';
import Input from '../../../../components/Input';
import {Text, View} from 'react-native';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

const FormComponent = props => {
  const {activity, setActivity, setRender} = props;
  const token = useSelector(activity => activity.auth.token);
  const [amount, setAmount] = useState('');

  const approveUserAllowanceRequest = () => {
    if (
      activity.activeRequest.amount <
      parseFloat(amount) + activity.totalApprovedAmount
    ) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: 'Cannot approve amount more then requested.',
      });
      return;
    }

    axiosInstance(token)
      .post('/expense/approveUserAllowanceRequest', {
        amount: parseFloat(amount),
        request_id: activity.activeRequest.request_id,
      })
      .then(() => {
        setActivity({
          ...activity,
          approveModal: false,
          activeRequest: null,
        });
        Toast.show({
          type: 'success',
          text1: 'success',
          text2: 'Request Approved',
        });
        setRender(prev => prev + 1);
        // setRequets([]);
        // getRequests();
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'error',
          text2: 'Failed to approve request.',
        });
      });
  };

  return (
    <View style={{}}>
      <Text style={{marginVertical: 16}}>
        Total Approved Amount: {activity.totalApprovedAmount} INR
      </Text>
      <Input
        label="Allowance"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <CustomButton
        buttonStyle={{
          backgroundColor: Colors.primary,
          borderRadius: 8,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
        }}
        onClick={approveUserAllowanceRequest}>
        <Text style={{color: 'white', textAlign: 'center'}}>Create</Text>
      </CustomButton>
    </View>
  );
};

const ApproveAllowanceRequestModal = props => {
  const {activity, setActivity} = props;
  return (
    <CustomModal
      visible={activity.approveModal}
      closeModal={() => {
        setActivity({...activity, approveModal: false});
      }}
      title="Approve Amount">
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default ApproveAllowanceRequestModal;
