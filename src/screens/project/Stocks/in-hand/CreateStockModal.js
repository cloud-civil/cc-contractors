import {useState} from 'react';
import CustomModal from '../../../../components/CustomModal';
import {Alert, Text, View} from 'react-native';
import Colors from '../../../../styles/Colors';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {createStockData} from '../../../../cc-hooks/src/stockSlice';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {units} from '../../../../utils/constants';
import {
  CustomButton,
  CustomFormButton,
} from '../../../../components/CustomButton';
import Toast from 'react-native-toast-message';
import Input from '../../../../components/Input';
import CustomDropdown from '../../../../components/CustomDropdown';

const FormComponent = ({project_id, activeGroupId, setActivity}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const userOrg = useSelector(state => state.auth.org, shallowEqual);

  const [name, setName] = useState('');
  const [alertAmount, setAlertamount] = useState('');
  const [rate, setRate] = useState('');
  const [unit, setUnit] = useState('');

  const createStock = () => {
    if (!name || !rate || !unit || !alertAmount) {
      Alert.alert('Invalid !', 'Please fill all the required fields.');
      return;
    }
    const ccStock = {
      name,
      alert_amount: parseInt(alertAmount, 10),
      rate: parseInt(rate, 10),
      unit,
      project_id: parseInt(project_id, 10),
      org_id: userOrg.org_id,
      sgroup_id: activeGroupId === 'main' ? null : activeGroupId,
    };
    axiosInstance(token)
      .post('/createStockForProject', ccStock)
      .then(({data}) => {
        dispatch(
          createStockData({
            project_id,
            data: data.data,
          }),
        );
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Stock created succesfully.',
        });
        setActivity(prev => ({...prev, createStock: false}));
        resetField();
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: err?.response?.data?.message,
        });
        console.log(err, err?.response?.data?.message);
        resetField();
      });
  };

  const resetField = () => {
    setName('');
    setAlertamount('');
    setRate('');
    setUnit('');
  };

  return (
    <View style={{marginTop: 10}}>
      <View>
        <Input value={name} label="Material Name" onChangeText={setName} />
        <Input
          value={alertAmount}
          keyboardType="numeric"
          label="Low Material Alert"
          onChangeText={setAlertamount}
        />
        <Input
          value={rate}
          label="Vendor Rate (INR)"
          keyboardType="numeric"
          onChangeText={setRate}
        />

        <CustomDropdown
          label="Select Unit"
          search
          data={units}
          onSelect={item => {
            setUnit(item.name);
          }}
          renderDisplayItem={item => item.name}
        />
      </View>

      <View>
        <CustomFormButton onClick={createStock}>
          <Text style={{color: 'white', fontSize: 16}}>Create Material</Text>
        </CustomFormButton>
      </View>
    </View>
  );
};
export const CreateStockModal = props => {
  const {activity, setActivity} = props;
  return (
    <CustomModal
      title="Create Material"
      visible={activity.createStock}
      closeModal={() => setActivity(prev => ({...prev, createStock: false}))}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
