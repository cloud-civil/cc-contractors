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
  const {user, project_id, setShowModal, setRender} = props;
  const token = useSelector(state => state.auth.token);
  const userOrg = useSelector(state => state.auth.org);
  const [allowance, setAllowance] = useState('');

  const addAllowance = () => {
    if (user) {
      axiosInstance(token)
        .post(`/expense/user/${user.user_id}/addUserAllowance`, {
          user_id: user.user_id,
          project_id,
          org_id: userOrg.org_id,
          allowance: parseInt(allowance, 10),
          remark: '',
        })
        .then(() => {
          setShowModal(false);
          Toast.show({
            type: 'success',
            text1: 'success',
            text2: 'Allowance added succesfully.',
          });
          setRender(prev => prev + 1);
        })
        .catch(err => {
          setShowModal(false);
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: 'Failed to add allowance.',
          });
          console.log(err, '/addUserAllowance', err?.response?.data?.message);
        });
    }
  };
  return (
    <View style={{marginTop: 6}}>
      <Input
        label="Advance Amount"
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
        onClick={addAllowance}>
        <Text style={{color: 'white', textAlign: 'center'}}>Create</Text>
      </CustomButton>
    </View>
  );
};

const AddAllowanceModal = props => {
  const {showModal, setShowModal} = props;
  return (
    <CustomModal
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
      }}
      title="Add Advance">
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default AddAllowanceModal;
