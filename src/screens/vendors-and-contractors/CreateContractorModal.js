import {useState} from 'react';
import CustomModal from '../../components/CustomModal';
import {Alert, Text, View} from 'react-native';
import Colors from '../../styles/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {CustomButton} from '../../components/CustomButton';
import {setContractorsData} from '../../cc-hooks/src/appSlice';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import Toast from 'react-native-toast-message';
import Input from '../../components/Input';

const initData = {
  name: '',
  phone: '',
  whatsapp: '',
  address: '',
  email: '',
};

const FormComponent = ({setShowModal}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const userOrg = useSelector(state => state.auth.org);
  const contractors = useSelector(state => state.app.contractors);
  const [formdata, setFormData] = useState(initData);

  const createVendor = () => {
    const contractorData = {...formdata, org_id: userOrg.org_id};
    if (!validateCreateContractor()) {
      Alert.alert('Incomplete', 'Please fill all required fields.');
      return;
    }
    axiosInstance(token)
      .post('/createContractor', contractorData)
      .then(({data}) => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Contractor was created succesfully.',
        });
        dispatch(
          setContractorsData([
            ...contractors.asArray,
            {
              ...contractorData,
              contractor_id: data.data.contractor_id,
            },
          ]),
        );

        resetFields();
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not create contractor',
        });
        console.log(err, '/createContractor', err?.response?.data?.message);
      });
  };

  const resetFields = () => {
    setShowModal(false);
    setFormData(initData);
  };

  const validateCreateContractor = () => {
    if (formdata.name === '' || formdata.phone === '') {
      return false;
    } else {
      return true;
    }
  };

  return (
    <View style={{marginTop: 10}}>
      <View>
        <Input
          value={formdata.name}
          label="Contractor Name"
          onChangeText={text => setFormData({...formdata, name: text})}
        />
        <Input
          value={formdata.phone}
          label="Phone Number"
          onChangeText={text => setFormData({...formdata, phone: text})}
        />
        {/* <Input
          value={formdata.whatsapp}
          label="WhatsApp Number"
          onChangeText={text => setFormData({...formdata, whatsapp: text})}
        />
        <Input
          value={formdata.email}
          label="Email"
          onChangeText={text => setFormData({...formdata, email: text})}
        /> */}
        <Input
          value={formdata.address}
          label="Address"
          onChangeText={text => setFormData({...formdata, address: text})}
        />
        {/* <Input
          value={formdata.rate.toString()}
          label="Contractor Rate"
          onChangeText={text => setFormData({...formdata, rate: text})}
        />
        <SelectDropdown
          buttonStyle={styles.dropdownButtonStyle}
          defaultButtonText="Select Contrator Rate Type"
          buttonTextStyle={styles.dropdownButtonText}
          renderDropdownIcon={() => (
            <MaterialIcons name="keyboard-arrow-down" size={24} color={'#666'} />
          )}
          dropdownStyle={{
            borderRadius: 8,
          }}
          data={['Daily', 'Monthly', 'Weekly']}
          onSelect={selectedItem => {
            setFormData({...formdata, rateType: selectedItem});
          }}
          buttonTextAfterSelection={selectedItem => {
            return selectedItem;
          }}
          rowTextForSelection={item => {
            return item;
          }}
        /> */}
      </View>

      <View>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}
          onClick={createVendor}>
          <Text style={{color: 'white', fontSize: 16}}>Create Contractor</Text>
        </CustomButton>
      </View>
    </View>
  );
};

export const CreateContractorModal = props => {
  const {modalMode, showModal, setShowModal} = props;

  return (
    <CustomModal
      title={`${modalMode === 'create' ? 'Create' : 'Edit'} Contractor`}
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
