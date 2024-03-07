import {Text, View} from 'react-native';
import Input from '../../../../components/Input';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import CustomModal from '../../../../components/CustomModal';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import Toast from 'react-native-toast-message';

const FormComponent = props => {
  const {project_id, setRender, activity, setActivity} = props;
  const token = useSelector(state => state.auth.token);
  const userOrg = useSelector(state => state.auth.org);
  const [allowance, setAllowance] = useState(activity.payAmount.toString());

  // console.log(activity.payAmount);
  const payUserAllowance = () => {
    const {user_id} = activity.activeRequest;
    const submitData = {
      user_id: user_id,
      project_id,
      org_id: userOrg.org_id,
      amount: parseInt(allowance, 10),
      remark: '',
      request_id: activity.activeRequest.request_id,
      approve_id: activity.approve_id,
    };
    console.log(submitData);
    axiosInstance(token)
      .post(`/expense/user/${user_id}/addUserAllowance`, submitData)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'success',
          text2: 'Allowance added succesfully.',
        });
        setActivity({...activity, payModal: false});
        setRender(prev => prev + 1);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: err?.response?.data?.message,
        });
        console.log(err, 'payUserAllowance', err?.response?.data?.message);
      });
  };

  return (
    <View style={{marginTop: 6}}>
      <Input
        editable={false}
        label="Pay Amount"
        value={allowance}
        onChangeText={setAllowance}
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
        onClick={payUserAllowance}>
        <Text style={{color: 'white', textAlign: 'center'}}>Pay</Text>
      </CustomButton>
    </View>
  );
};

const PayAllowanceRequestModal = props => {
  const {activity, setActivity} = props;
  return (
    <CustomModal
      visible={activity.payModal}
      closeModal={() => {
        setActivity({...activity, payModal: false});
      }}
      title="Pay Amount">
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default PayAllowanceRequestModal;
