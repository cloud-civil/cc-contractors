import {FlatList, Image, ScrollView, Text, View} from 'react-native';
import {GoBack} from '../../components/HeaderButtons';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../../styles/Colors';
import QuantityCard from '../../components/QuantityCard';
import styles from '../../styles/styles';
import {useSelector} from 'react-redux';
import {IMAGE_URL} from '@env';
import {useState} from 'react';
import ContractorProjects from './ContractorProjects';
import ContractorUpdateForm from './ContractorUpdateForm';
import ImageView from 'react-native-image-viewing';

const ContractorDetails = ({route}) => {
  const {activeContractor: a} = route.params;
  const contractorsAsObject = useSelector(
    state => state.app.contractors.asObject,
  );
  const activeContractor = contractorsAsObject[a.contractor_id];
  const navigation = useNavigation();
  const userOrg = useSelector(state => state.auth.org);
  const token = useSelector(state => state.auth.token);

  const [showEdit, setShowEdit] = useState(false);
  const [uploadType, setUploadedType] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const images = Array.isArray(activeContractor.images)
    ? activeContractor.images
    : (activeContractor.images && JSON.parse(activeContractor.images)) || [];

  const showImage = imageName => {
    setActiveImage([
      {
        uri: `${IMAGE_URL}/org/${userOrg.org_id}/preview-${imageName}`,
      },
    ]);
    setShowPhotoModal(true);
  };

  return (
    <>
      <View style={{marginTop: 44}} />
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
              {activeContractor.name}
            </Text>
          </View>
        </View>
        <View style={{padding: 10, marginRight: 10}}>
          <TouchableOpacity onPress={() => setShowEdit(true)}>
            <MaterialCommunityIcons
              name="circle-edit-outline"
              size={30}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{paddingHorizontal: 10}}>
        {!showEdit ? (
          <View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={['Phone Number', 'WhatsApp Number', 'Email']}
              renderItem={({item}) => {
                return (
                  <QuantityCard
                    headline={item}
                    unit={
                      item === 'Phone Number'
                        ? activeContractor.phone
                        : item === 'WhatsApp Number'
                        ? activeContractor.whatsapp
                        : activeContractor.email
                    }
                    backgroundColor={'white'}
                  />
                );
              }}
            />
            <View>
              <Text style={styles.subHeading}>Uploaded Documents</Text>
              <View style={styles.horizontalBar} />
              <FlatList
                data={images}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{marginTop: 10}}
                renderItem={({item}) => {
                  const url = `${IMAGE_URL}/org/${userOrg.org_id}/thumbnail-${item?.fullName}`;
                  return (
                    <View key={item?.fullName}>
                      <TouchableOpacity
                        onPress={() => {
                          showImage(item?.fullName);
                        }}
                        activeOpacity={0.7}
                        style={{marginRight: 6}}>
                        <Image
                          style={{width: 120, height: 90, borderRadius: 8}}
                          source={{
                            uri: url,
                            headers: {
                              Authorization: token,
                            },
                          }}
                        />
                      </TouchableOpacity>
                      <Text style={{textAlign: 'center'}}>
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
            <ContractorProjects
              userOrg={userOrg}
              activeContractor={activeContractor}
            />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{paddingBottom: 130}}
            showsVerticalScrollIndicator={false}>
            <View>
              <ContractorUpdateForm
                uploadType={uploadType}
                setUploadedType={setUploadedType}
                images={images}
                userOrg={userOrg}
                setShowEdit={setShowEdit}
                token={token}
                activeContractor={activeContractor}
                showImage={showImage}
              />
            </View>
          </ScrollView>
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
    </>
  );
};

export default ContractorDetails;
