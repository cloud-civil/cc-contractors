import {useEffect, useState} from 'react';
import {FlatList, Image, View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {setContractorsData} from '../../cc-hooks/src/appSlice';
import Toast from 'react-native-toast-message';
import {orgImageUpload} from '../../apiHooks';
import {launchImageLibrary} from 'react-native-image-picker';
import Input from '../../components/Input';
import SelectDropdown from 'react-native-select-dropdown';
import styles from '../../styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomButton} from '../../components/CustomButton';
import Colors from '../../styles/Colors';
import {fileUploadDocuments} from './utils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {IMAGE_URL} from '@env';

const initData = {
  name: '',
  phone: '',
  whatsapp: '',
  address: '',
  email: '',
  rate: '',
  rate_type: '',
};

const ContractorUpdateForm = ({
  uploadType,
  setUploadedType,
  images,
  userOrg,
  setShowEdit,
  token,
  activeContractor,
  showImage,
}) => {
  const dispatch = useDispatch();
  const contractors = useSelector(state => state.app.contractors);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState(initData);
  const [uploadedFiles] = useState([]);
  const [isUploading, setUploading] = useState(false);

  useEffect(() => {
    setFormData({
      name: activeContractor.name,
      phone: activeContractor.phone,
      whatsapp: activeContractor.whatsapp,
      address: activeContractor.address,
      email: activeContractor.email || '',
      rate: activeContractor.rate?.toString() || '',
      rate_type: activeContractor.rate_type,
    });
  }, []);

  const updateContractor = () => {
    axiosInstance(token)
      .post('/editContractor', {
        ...formData,
        images: JSON.stringify(uploadedUrls),
        files: JSON.stringify(uploadedFiles),
      })
      .then(({data}) => {
        console.log('response data', data.data);
        dispatch(
          setContractorsData(
            contractors.asArray.map(c => {
              if (c.contractor_id === activeContractor.contractor_id) {
                const updatedContractor = {...activeContractor, ...data.data};
                const oldImages = JSON.parse(activeContractor.images);
                const newImages = JSON.parse(data.data.images);
                const newImageArr = [
                  ...(oldImages ?? []),
                  ...(newImages ?? []),
                ];
                // const newImageArr = newImages
                //   ? oldImages.concat(newImages)
                //   : oldImages;
                updatedContractor.images = newImageArr;
                console.log(updatedContractor);
                return updatedContractor;
              } else {
                return c;
              }
            }),
          ),
        );
        Toast.show({
          type: 'success',
          text1: 'Updated',
          text2: 'Contractor details updated Succesfully.',
        });
        setShowEdit(false);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not update contractor details.',
        });
        console.log(err, '/editContractor', err?.response?.data?.message);
      });
  };

  const uploadImage = () => {
    setUploading(true);
    orgImageUpload(selectedImage, userOrg.org_id)
      .then(res => {
        setUploadedUrls([
          ...uploadedUrls,
          {
            ...res.data.data,
            documentName: uploadType.value,
            documentType: uploadType.key,
          },
        ]);
        setUploading(false);
        setSelectedImage(null);
        setUploadedType('');
      })
      .catch(err => {
        setUploading(false);
        console.log(
          err,
          '/orgImageUploadContractor',
          err?.response?.data?.message,
        );
      });
  };

  const openGallery = () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 3000,
      maxHeight: 4000,
    };
    launchImageLibrary(options)
      .then(data => {
        if (data.didCancel) {
          return;
        }
        setSelectedImage(data.assets[0]);
      })
      .catch(err => console.error(err));
  };

  return (
    <View>
      <View>
        <Input
          value={formData.name}
          mode={'outlined'}
          label="Vendor Name"
          onChangeText={text => setFormData({...formData, name: text})}
        />
        <Input
          value={formData.phone}
          mode={'outlined'}
          label="Phone Number"
          keyboardType="numeric"
          onChangeText={text => setFormData({...formData, phone: text})}
        />
        <Input
          value={formData.whatsapp}
          mode={'outlined'}
          label="WhatsApp Number"
          keyboardType="numeric"
          onChangeText={text => setFormData({...formData, whatsapp: text})}
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
        <Input
          value={formData.rate}
          mode={'outlined'}
          label="Rate"
          keyboardType="numeric"
          onChangeText={text => setFormData({...formData, rate: text})}
        />

        <SelectDropdown
          buttonStyle={[styles.dropdownButtonStyle, {borderColor: '#bbb'}]}
          defaultButtonText={
            formData.rate_type ? formData.rate_type : 'Rate Type'
          }
          buttonTextStyle={styles.dropdownButtonText}
          renderDropdownIcon={() => (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={'#666'}
            />
          )}
          dropdownStyle={{
            borderRadius: 8,
          }}
          data={['Daily', 'Monthly', 'Weekly']}
          onSelect={selectedItem => {
            setFormData({...formData, rate_type: selectedItem});
          }}
          buttonTextAfterSelection={selectedItem => {
            return selectedItem;
          }}
          rowTextForSelection={item => {
            return item;
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <SelectDropdown
          buttonStyle={[
            styles.dropdownButtonStyle,
            {borderColor: '#bbb', flex: 1, marginTop: 0, marginBottom: 0},
          ]}
          defaultButtonText={uploadType ? uploadType : 'Select Document'}
          buttonTextStyle={styles.dropdownButtonText}
          renderDropdownIcon={() => (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={'#666'}
            />
          )}
          dropdownStyle={{
            borderRadius: 8,
          }}
          data={fileUploadDocuments}
          onSelect={item => {
            setUploadedType(item);
          }}
          buttonTextAfterSelection={item => {
            return item.value;
          }}
          rowTextForSelection={item => {
            return item.value;
          }}
        />
        {uploadType && (
          <CustomButton
            buttonStyle={{
              backgroundColor: Colors.primary,
              width: 50,
              height: 50,
              marginLeft: 6,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={openGallery}>
            <MaterialCommunityIcons
              name="file-upload-outline"
              size={24}
              color={'white'}
            />
          </CustomButton>
        )}
      </View>

      {selectedImage ? (
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: selectedImage.uri}}
            style={{width: 120, height: 90, borderRadius: 8, marginRight: 4}}
          />
          <View style={{marginLeft: 10}}>
            <CustomButton
              disabled={isUploading}
              onClick={uploadImage}
              buttonStyle={{
                backgroundColor: Colors.primary,
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 8,
                marginBottom: 6,
              }}>
              {isUploading ? (
                <Text style={{color: 'white'}}>Uploading...</Text>
              ) : (
                <>
                  <Text style={{color: 'white', marginRight: 6}}>Upload</Text>
                  <MaterialCommunityIcons
                    name="cloud-upload-outline"
                    color={'white'}
                    size={16}
                  />
                </>
              )}
            </CustomButton>
            <CustomButton
              onClick={() => setSelectedImage(null)}
              disabled={isUploading}
              buttonStyle={{
                backgroundColor: 'gray',
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}>
              <Text style={{color: 'white'}}>Cancel</Text>
            </CustomButton>
          </View>
        </View>
      ) : null}

      {uploadedUrls.length ? (
        <View style={{marginBottom: 14}}>
          <Text style={styles.subHeading}>New Uploaded Documents</Text>

          <FlatList
            data={uploadedUrls}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              const url = `${IMAGE_URL}/org/${userOrg.org_id}/thumbnail-${item.fullName}`;
              return (
                <View style={{width: 90, marginRight: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      showImage(item.fullName);
                    }}
                    activeOpacity={0.7}
                    key={item.fullName}>
                    <Image
                      style={{width: 90, height: 60, borderRadius: 8}}
                      source={{
                        uri: url,
                        headers: {
                          Authorization: token,
                        },
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 4,
                      fontSize: 12,
                      fontWeight: '500',
                    }}>
                    {item.documentName}
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={() => {
              return <Text>There is no image</Text>;
            }}
          />
        </View>
      ) : null}

      <View style={{marginBottom: 14}}>
        <Text style={styles.subHeading}>Uploaded Documents</Text>

        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            const url = `${IMAGE_URL}/org/${userOrg.org_id}/thumbnail-${item?.fullName}`;
            return (
              <View style={{width: 90, marginRight: 10}}>
                <TouchableOpacity
                  onPress={() => {
                    showImage(item?.fullName);
                  }}
                  activeOpacity={0.7}
                  key={item?.fullName}>
                  <Image
                    style={{width: 90, height: 60, borderRadius: 8}}
                    source={{
                      uri: url,
                      headers: {
                        Authorization: token,
                      },
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: '500',
                  }}>
                  {item?.documentName}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={() => {
            return <Text>There is no image</Text>;
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <CustomButton
          onClick={() => {
            setShowEdit(false);
            setUploadedType('');
          }}
          buttonStyle={{
            borderRadius: 8,
            width: '90%',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
            borderWidth: 1,
          }}>
          <Text>Cancel</Text>
        </CustomButton>
        <CustomButton
          onClick={updateContractor}
          disabled={isUploading}
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            width: '90%',
            flex: 1,
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

export default ContractorUpdateForm;
