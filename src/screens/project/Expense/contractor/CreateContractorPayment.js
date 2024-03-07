import {useState} from 'react';
import {View, Text} from 'react-native';
import CustomModal from '../../../../components/CustomModal';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import {TextInput} from 'react-native-paper';
import {theme} from '../../../../styles/theme';
import styles from '../../../../styles/styles';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import Toast from 'react-native-toast-message';

const CreateContractorPayment = ({
  isOpen,
  closeModal,
  activeBill,
  project_id,
  contractor_id,
  reRender,
  setRender,
}) => {
  const {bill, netAmount} = activeBill;
  const token = useSelector(state => state.auth.token);
  const [formData, setFormData] = useState({
    amount: 0,
  });

  const pay = () => {
    const x = {
      amount: parseInt(formData.amount, 10),
      project_id: parseInt(project_id, 10),
      contractor_id,
      bill,
    };
    axiosInstance(token)
      .post('/expense/vendor/payVendor', x)
      .then(() => {
        closeModal();
        Toast.show({
          type: 'success',
          text1: 'success',
          text2: 'Bill payment submitted succesfully.',
        });
        setRender(reRender + 1);
      })
      .catch(() => {
        closeModal();
        Toast.show({
          type: 'success',
          text1: 'Failed',
          text2: 'Failed to create bill',
        });
      });
  };

  return (
    <CustomModal
      visible={isOpen}
      closeModal={closeModal}
      title="Pay Contractor">
      <View>
        <View style={{marginTop: 10, marginBottom: 16}}>
          <Text>
            Amount Payable:{' '}
            <Text style={{fontWeight: '600'}}>{netAmount} INR</Text>
          </Text>
        </View>
        <View style={{marginBottom: 8}}>
          <TextInput
            theme={theme}
            style={styles.inputField}
            mode="outlined"
            label="Pay amount"
            value={formData.amount.toString()}
            onChangeText={value => {
              setFormData({
                ...formData,
                amount: value,
              });
            }}
            keyboardType="numeric"
          />
        </View>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}
          onClick={pay}>
          <Text style={{color: 'white', fontSize: 16}}>Submit</Text>
        </CustomButton>
      </View>
    </CustomModal>
  );
};

export default CreateContractorPayment;
