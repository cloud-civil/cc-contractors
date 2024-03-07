import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {GoBack} from '../../components/HeaderButtons';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../styles/Colors';
import {useEffect, useState} from 'react';
import VendorUpdateForm from './VendorUpdateForm';
import QuantityCard from '../../components/QuantityCard';
import {useSelector} from 'react-redux';
import ImageView from 'react-native-image-viewing';
import {IMAGE_URL} from '@env';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import styles from '../../styles/styles';

const VendorDetails = ({route}) => {
  const {activeVendor: activeVendor__} = route.params;
  const navigation = useNavigation();
  const [showEdit, setShowEdit] = useState(false);
  const userOrg = useSelector(state => state.auth.org);
  const token = useSelector(state => state.auth.token);
  const [uploadType, setUploadedType] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [activeVendor, setActiveVendor] = useState(null);
  const [reRender, setRender] = useState(0);

  const showImage = imageName => {
    setActiveImage([
      {
        uri: `${IMAGE_URL}/org/${userOrg.org_id}/preview-${imageName}`,
      },
    ]);
    setShowPhotoModal(true);
  };

  useEffect(() => {
    console.log('ran');
    axiosInstance(token)
      .get(`/getVendorByVendorId?vendor_id=${activeVendor__.vendor_id}`)
      .then(({data}) => {
        setActiveVendor(data.data);
      })
      .catch(err => {
        console.error(
          err,
          '/getVendorByVendorId',
          err?.response?.data?.message,
        );
      });
  }, [reRender]);

  return (
    <View>
      <View style={styles.statusBar} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <GoBack onClick={() => navigation.goBack()} />
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: '#3e3e3e',
              }}>
              {activeVendor__?.name}
            </Text>
          </View>
        </View>
        {activeVendor && (
          <View style={{padding: 10, marginRight: 10}}>
            <TouchableOpacity onPress={() => setShowEdit(true)}>
              <MaterialCommunityIcons
                name="circle-edit-outline"
                size={30}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {activeVendor ? (
        <>
          {!showEdit ? (
            <View style={{paddingHorizontal: 10}}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={['Phone Number', 'Address', 'Email']}
                renderItem={({item}) => {
                  return (
                    <QuantityCard
                      headline={item}
                      unit={
                        item === 'Phone Number'
                          ? activeVendor?.phone
                          : item === 'Address'
                          ? activeVendor?.address
                          : activeVendor?.email
                      }
                      backgroundColor={'white'}
                    />
                  );
                }}
              />
            </View>
          ) : (
            <View style={{}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[1]}
                contentbuttonStyle={{
                  paddingBottom: 120,
                }}
                renderItem={() => {
                  return (
                    <VendorUpdateForm
                      activeVendor={activeVendor}
                      setShowEdit={setShowEdit}
                      token={token}
                      userOrg={userOrg}
                      uploadType={uploadType}
                      setUploadedType={setUploadedType}
                      showImage={showImage}
                      setRender={setRender}
                    />
                  );
                }}
              />
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator color={Colors.primary} size={30} />
        </View>
      )}
      <ImageView
        images={activeImage}
        imageIndex={0}
        visible={showPhotoModal}
        onRequestClose={() => {
          setShowPhotoModal(false);
        }}
      />
    </View>
  );
};

export default VendorDetails;
