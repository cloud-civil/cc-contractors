import {useState} from 'react';
import CustomModal from '../../components/CustomModal';
import {Alert, Text, View} from 'react-native';
import Colors from '../../styles/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {CustomButton} from '../../components/CustomButton';
import {setVendorsData} from '../../cc-hooks/src/appSlice';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import Input from '../../components/Input';
import Toast from 'react-native-toast-message';

const initData = {
  name: '',
  phone: '',
  whatsapp: '',
  address: '',
  email: '',
  gst: '',
};

const FormComponent = ({setShowModal}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const userOrg = useSelector(state => state.auth.org);
  const vendors = useSelector(state => state.app.vendors);
  const [formData, setFormData] = useState(initData);

  const createVendor = () => {
    const vendorData = {...formData, org_id: userOrg.org_id};
    if (!validateCreateVendor()) {
      Alert.alert('Incomplete', 'Please fill all required fields.');
      return;
    }
    axiosInstance(token)
      .post('/createVendor', vendorData)
      .then(({data}) => {
        resetFields();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Vendor was created succesfully.',
        });
        dispatch(
          setVendorsData([
            ...vendors.asArray,
            {
              vendor_id: data.data.vendor_id,
              ...vendorData,
            },
          ]),
        );
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: err?.response?.data?.message,
        });

        console.log(err, '/createVendor', err?.response?.data?.message);
      });
  };

  const resetFields = () => {
    setShowModal(false);
    setFormData(initData);
  };

  const validateCreateVendor = () => {
    if (formData.name === '' || formData.phone === '') {
      return false;
    } else {
      return true;
    }
  };

  return (
    <View style={{marginTop: 10}}>
      <View>
        <Input
          value={formData.name}
          label="Vendor Name"
          onChangeText={text => setFormData({...formData, name: text})}
        />
        <Input
          value={formData.phone}
          label="Phone Number"
          onChangeText={text => setFormData({...formData, phone: text})}
        />
        {/* <Input
          value={formData.whatsapp}
          label="WhatsApp Number"
          onChangeText={text => setFormData({...formData, whatsapp: text})}
        /> */}
        <Input
          value={formData.gst}
          label="GST Number"
          onChangeText={text => setFormData({...formData, gst: text})}
        />
        {/* <Input
          value={formData.email}
          label="Email"
          theme={theme}
          onChangeText={text => setFormData({...formData, email: text})}
        /> */}
        <Input
          value={formData.address}
          label="Address"
          onChangeText={text => setFormData({...formData, address: text})}
        />
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
          <Text style={{color: 'white', fontSize: 16}}>Create Vendor</Text>
        </CustomButton>
      </View>
    </View>
  );
};
export const CreateVendorModal = props => {
  const {modalMode, showModal, setShowModal} = props;
  return (
    <CustomModal
      title={`${modalMode === 'create' ? 'Create' : 'Edit'} Vendor`}
      visible={showModal}
      closeModal={() => setShowModal(false)}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
