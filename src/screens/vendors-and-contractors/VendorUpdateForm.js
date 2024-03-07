import {useEffect, useState} from 'react';
import {FlatList, Image, View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {setVendorsData} from '../../cc-hooks/src/appSlice';
import Toast from 'react-native-toast-message';
import {orgImageUpload} from '../../apiHooks';
import {launchImageLibrary} from 'react-native-image-picker';
import {resetImages} from '../../cc-hooks/src/imageSlice';
import Input from '../../components/Input';
import styles from '../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CustomButton,
  CustomFormIconButton,
} from '../../components/CustomButton';
import Colors from '../../styles/Colors';
import {fileUploadDocuments} from './utils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {IMAGE_URL} from '@env';
import CustomDropdown from '../../components/CustomDropdown';

const initData = {
  name: '',
  gst: '',
  phone: '',
  email: '',
  address: '',
};

const VendorUpdateForm = ({
  uploadType,
  setUploadedType,
  userOrg,
  setShowEdit,
  token,
  activeVendor,
  setRender,
}) => {
  const dispatch = useDispatch();
  const vendors = useSelector(state => state.app.vendors);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [imageUploadingLoading, setImageUploadLoading] = useState(false);
  const [formData, setFormData] = useState(initData);
  const [uploadedFiles] = useState([]);
  const [vendorImages, setVendorImages] = useState([]);

  useEffect(() => {
    setVendorImages(
      (activeVendor.images && JSON.parse(activeVendor.images)) || [],
    );
    setFormData({
      name: activeVendor.name,
      gst: activeVendor.gst,
      phone: activeVendor.phone,
      email: activeVendor.email || '',
      address: activeVendor.address,
    });
  }, []);

  const updateVendor = () => {
    console.log(uploadedUrls, formData);
    axiosInstance(token)
      .post('/editVendor', {
        ...formData,
        org_id: userOrg.org_id,
        images: JSON.stringify([...vendorImages, ...uploadedUrls]),
        files: JSON.stringify(uploadedFiles),
      })
      .then(({data}) => {
        console.log(data.data);
        dispatch(
          setVendorsData(
            vendors.asArray.map(vendor => {
              if (vendor.vendor_id === activeVendor.vendor_id) {
                return {
                  ...activeVendor,
                  ...formData,
                  images: JSON.stringify([...vendorImages, ...uploadedUrls]),
                };
              } else {
                return vendor;
              }
            }),
          ),
        );
        setRender(prev => prev + 1);
        Toast.show({
          type: 'success',
          text1: 'Updated',
          text2: 'Vendor details updated Succesfully.',
        });
        setShowEdit(false);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not update vendor details.',
        });
        console.log(err, '/editVendor', err?.response?.data?.message);
      });
  };

  const openGallery = () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options)
      .then(data => {
        if (data.didCancel) {
          return;
        }
        setImageUploadLoading(true);
        orgImageUpload(data.assets[0], userOrg.org_id, token)
          .then(res => {
            setUploadedUrls([
              ...uploadedUrls,
              {
                ...res.data.data,
                documentName: uploadType.value,
                documentType: uploadType.key,
              },
            ]);
            setUploadedType('');
            setImageUploadLoading(false);
          })
          .catch(err => {
            console.log(err);
            setImageUploadLoading(false);
          });
      })
      .catch(err => console.error(err));
  };

  return (
    <View style={{paddingHorizontal: 10}}>
      <View>
        <Input
          value={formData.name}
          mode={'outlined'}
          label="Vendor Name"
          onChangeText={text => setFormData({...formData, name: text})}
        />
        <Input
          value={formData.gst}
          mode={'outlined'}
          label="GST Number"
          keyboardType="numeric"
          onChangeText={text => setFormData({...formData, gst: text})}
        />
        <Input
          value={formData.phone}
          mode={'outlined'}
          label="Phone Number"
          keyboardType="numeric"
          onChangeText={text => setFormData({...formData, phone: text})}
        />

        <Input
          value={formData.email}
          mode={'outlined'}
          label="Email"
          autoCapitalize="none"
          onChangeText={text => setFormData({...formData, email: text})}
        />
        <Input
          value={formData.address}
          mode={'outlined'}
          label="Address"
          onChangeText={text => setFormData({...formData, address: text})}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <CustomDropdown
          label="Select Document"
          data={fileUploadDocuments}
          onSelect={item => {
            setUploadedType(item);
          }}
          renderDisplayItem={item => item.value}
        />

        {uploadType && (
          <CustomFormIconButton
            loading={imageUploadingLoading}
            style={{marginTop: 6, marginLeft: 6, marginRight: 0}}
            onClick={openGallery}>
            <MaterialCommunityIcons
              name="file-upload-outline"
              size={24}
              color={'white'}
            />
          </CustomFormIconButton>
        )}
      </View>

      {vendorImages && (
        <View style={{marginBottom: 14}}>
          <Text style={styles.subHeading}>Uploaded Documents</Text>

          <FlatList
            data={vendorImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <View style={{marginRight: 4, flexDirection: 'row'}}>
                  <View>
                    <Image
                      source={{
                        uri: `${IMAGE_URL}/previewUploadedImage/thumbnail-${item.fullName}`,
                      }}
                      style={{width: 60, height: 80, borderRadius: 8}}
                    />
                    <Text style={{textAlign: 'center', marginTop: 3}}>
                      {item.documentName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setVendorImages(
                        vendorImages.filter((f, idx) => idx !== index),
                      )
                    }
                    style={{
                      backgroundColor: 'white',
                      width: 22,
                      height: 22,
                      borderRadius: 10,
                    }}>
                    <MaterialCommunityIcons name="close" size={22} />
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={() => {
              return <Text>There is no image</Text>;
            }}
          />
        </View>
      )}

      {uploadedUrls.length ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          contentbuttonStyle={{marginBottom: 10}}
          data={uploadedUrls}
          horizontal={true}
          renderItem={({item, index}) => {
            return (
              <View style={{marginRight: 4, flexDirection: 'row'}}>
                <View>
                  <Image
                    source={{
                      uri: `${IMAGE_URL}/previewUploadedImage/thumbnail-${item.fullName}`,
                    }}
                    style={{width: 60, height: 80, borderRadius: 8}}
                  />
                  <Text style={{textAlign: 'center', marginTop: 3}}>
                    {item.documentName}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setUploadedUrls(
                      uploadedUrls.filter((f, idx) => idx !== index),
                    )
                  }
                  style={{
                    backgroundColor: 'white',
                    width: 22,
                    height: 22,
                    borderRadius: 10,
                  }}>
                  <MaterialCommunityIcons name="close" size={22} />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <CustomButton
          onClick={() => {
            setShowEdit(false);
            dispatch(resetImages());
            setUploadedType('');
          }}
          buttonStyle={{
            borderRadius: 8,
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
            borderWidth: 1,
          }}>
          <Text>Cancel</Text>
        </CustomButton>
        <CustomButton
          onClick={updateVendor}
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}>
          <Text style={{color: 'white'}}>Update</Text>
        </CustomButton>
      </View>
    </View>
  );
};

export default VendorUpdateForm;
