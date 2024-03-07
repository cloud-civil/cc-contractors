import {useEffect, useState} from 'react';
import CustomModal from '../../components/CustomModal';
import {Alert, Image, Text, View} from 'react-native';
import Colors from '../../styles/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {CustomButton} from '../../components/CustomButton';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import Toast from 'react-native-toast-message';
import Input from '../../components/Input';
import {orgImageUpload} from '../../apiHooks';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {setOrg} from '../../cc-hooks/src/authSlice';
import {launchImageLibrary} from 'react-native-image-picker';
import {IMAGE_URL} from '@env';
import {ImageLoadingSkeleton} from '../../components/Skeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initData = {
  name: '',
  address: '',
  pincode: '',
  gst: '',
  phone: '',
  logo: '',
};

export const FormComponent = ({setShowModal, userOrg}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const [formData, setFormData] = useState(initData);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  useEffect(() => {
    setFormData({...formData, ...userOrg});
    setFormData({...formData, logo: JSON.parse(userOrg.logo)});
  }, []);

  const uploadImage = file => {
    setImageUploadLoading(true);
    orgImageUpload(file, userOrg.org_id, token)
      .then(res => {
        setFormData({
          ...formData,
          logo: JSON.stringify(res.data.data),
        });
        setImageUploadLoading(false);
      })
      .catch(err => {
        setImageUploadLoading(false);
        console.log(err, '/orgImageUpload', err?.response?.data?.message);
      });
  };

  const updateOrganization = () => {
    if (!validateForm()) {
      return;
    }
    const submitData = {
      org_id: userOrg.org_id,
      user_id: userOrg.org_id,
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      logo: formData.logo,
      gst: formData.gst,
      pincode: formData.pincode,
    };

    axiosInstance(token)
      .post('/updateOrganization', submitData)
      .then(() => {
        AsyncStorage.setItem('USER_ORG', JSON.stringify(submitData));
        dispatch(setOrg(submitData));
        setShowModal(false);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Organization updated succesfully',
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to update organization',
        });
        console.log(err, '/updateOrganization', err?.response?.data?.message);
      });
  };

  const openGallery = () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 2000,
      maxHeight: 2000,
    };
    launchImageLibrary(options)
      .then(data => {
        if (data.didCancel) {
          return;
        }
        uploadImage(data.assets[0]);
      })
      .catch(err => console.log(err));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.address ||
      !formData.pincode ||
      !formData.gst ||
      !formData.phone
    ) {
      Alert.alert('Invalid', 'Please fill all the fields.');
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
          label="Organization Name"
          onChangeText={text => {
            setFormData({...formData, name: text});
          }}
        />
        <Input
          value={formData.address}
          label="Address"
          onChangeText={text => {
            setFormData({...formData, address: text});
          }}
        />
        <Input
          value={formData.pincode}
          label="Pincode"
          keyboardType="numeric"
          onChangeText={text => {
            setFormData({...formData, pincode: text});
          }}
        />
        <Input
          value={formData.gst}
          label="GST Number"
          onChangeText={text => {
            setFormData({...formData, gst: text});
          }}
          keyboardType="numeric"
        />
        <Input
          value={formData.phone}
          label="Phone Number"
          onChangeText={text => {
            setFormData({...formData, phone: text});
          }}
          keyboardType="numeric"
        />
      </View>

      {formData.logo ? (
        <View style={{marginBottom: 10}}>
          {!imageUploadLoading ? (
            <Image
              source={{
                uri: `${IMAGE_URL}/org/${userOrg.org_id}/thumbnail-${
                  JSON.parse(formData?.logo)?.fullName
                }`,
                headers: {
                  Authorization: token,
                },
              }}
              style={{width: 60, height: 60, borderRadius: 8}}
            />
          ) : (
            <ImageLoadingSkeleton width={60} height={60} />
          )}
        </View>
      ) : null}

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            height: 45,
            width: 45,
            borderRadius: 10,
            marginRight: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={openGallery}>
          <MaterialIcons name="camera-alt" size={22} color={'white'} />
        </CustomButton>
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
            onClick={updateOrganization}>
            <Text style={{color: 'white', fontSize: 16}}>Update</Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

export const UpdateOrgModal = props => {
  const {showModal, setShowModal} = props;

  return (
    <CustomModal
      title="Edit Organization"
      visible={showModal}
      closeModal={() => setShowModal(false)}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
