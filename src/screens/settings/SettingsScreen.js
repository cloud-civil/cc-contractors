import {useEffect, useState} from 'react';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser, setOrg} from '../../cc-hooks/src/authSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomButton} from '../../components/CustomButton';
import Colors from '../../styles/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../../components/Input';
import {resetState} from '../../cc-hooks/src/appSlice';
import Toast from 'react-native-toast-message';
import {Image} from 'react-native';
import {IMAGE_URL} from '@env';
import styles from '../../styles/styles';
import {UpdateOrgModal} from './UpdateOrgModal';
import ImageView from 'react-native-image-viewing';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Skeleton} from '../../components/Skeleton';

const UserOrganization = ({userOrg}) => {
  const token = useSelector(state => state.auth.token);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const logoName = userOrg && JSON.parse(userOrg?.logo)?.fullName;
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const showImage = logoName => {
    setActiveImage([
      {
        uri: `${IMAGE_URL}/org/${userOrg.org_id}/preview-${logoName}`,
      },
    ]);
    setShowPhotoModal(true);
  };

  return (
    <View>
      <View style={styles.headerContent}>
        <Text style={styles.heading}>Organization Info</Text>
      </View>
      <View style={[styles.card]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => showImage(logoName)}>
          {logoName ? (
            <Image
              source={{
                uri: `${IMAGE_URL}/org/${userOrg.org_id}/thumbnail-${logoName}`,
                headers: {
                  Authorization: token,
                },
              }}
              style={{width: 60, height: 60, borderRadius: 8}}
            />
          ) : (
            <Skeleton style={{width: 60, height: 60, borderRadius: 8}} />
          )}
        </TouchableOpacity>
        <View style={{marginLeft: 10, width: '65%'}}>
          <Text style={{fontWeight: 600, fontSize: 18, marginBottom: 2}}>
            {userOrg.name}
          </Text>
          <Text style={{fontSize: 12, marginBottom: 2}}>{userOrg.phone}</Text>
          <Text style={{fontSize: 12}}>{userOrg.address}</Text>
        </View>
        <View style={{marginLeft: 'auto'}}>
          <CustomButton
            buttonStyle={{
              backgroundColor: '#f2f2f2',
              borderRadius: 8,
              padding: 6,
            }}
            onClick={() => setShowOrgModal(true)}>
            <MaterialCommunityIcons
              name="pencil"
              size={22}
              color={Colors.primary}
            />
          </CustomButton>
        </View>
      </View>
      <UpdateOrgModal
        showModal={showOrgModal}
        setShowModal={setShowOrgModal}
        userOrg={userOrg}
        showImage={showImage}
      />
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

const CreateUserOrganization = ({token}) => {
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const [name, setName] = useState('');
  const createOrganization = () => {
    const org = {
      name,
      user_id: authUser.user_id,
    };

    axiosInstance(token)
      .post('/createOrganization', org)
      .then(({data}) => {
        dispatch(setOrg({...org, org_id: data.data}));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Organization created succesfully.',
        });
      })
      .catch(() => {
        Toast.show({
          type: 'success',
          text1: 'Failed',
          text2: 'Failed to create Organization.',
        });
      });
  };
  return (
    <View style={{margin: 10}}>
      <View style={styles.headerContent}>
        <Text style={styles.heading}>Create Organization Name</Text>
      </View>
      <View style={{marginBottom: 8, height: 110}}>
        <View style={{flex: 1}}>
          <Input
            value={name}
            onChangeText={setName}
            label={'Organization Name'}
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
          onClick={createOrganization}>
          <Text style={{color: 'white', fontSize: 16}}>Create</Text>
        </CustomButton>
      </View>
    </View>
  );
};

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const userOrg = useSelector(state => state.auth.org);
  const [authDetails, setAuthDetails] = useState(null);

  useEffect(() => {
    getAuthDetails();
  }, []);

  const getAuthDetails = async () => {
    const auth_details = await AsyncStorage.getItem('AUTH_USER');
    const x = JSON.parse(auth_details);
    setAuthDetails(x);
  };

  const logout = () => {
    axiosInstance(token)
      .post('/logout')
      .then(() => {
        AsyncStorage.clear();
        dispatch(logoutUser());
        dispatch(resetState());
      })
      .catch(err => console.log(err, 'Could not log out'));
  };

  return (
    <View style={styles.container}>
      <View style={{height: 40}} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 20,
        }}>
        <View
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 100,
            width: 60,
            height: 60,
            elevation: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 44,
              fontWeight: 600,
              color: 'white',
              textAlign: 'center',
            }}>
            {authDetails && authDetails.fname[0]}
          </Text>
        </View>
        {authDetails && (
          <View style={{marginLeft: 16}}>
            <Text style={{marginBottom: 4, fontSize: 16, fontWeight: 500}}>
              {authDetails.fname} {authDetails.lname}
            </Text>
            <Text>{authDetails.phone}</Text>
          </View>
        )}
        <View style={{marginLeft: 'auto', marginRight: 10}}>
          <CustomButton
            buttonStyle={{
              backgroundColor: Colors.primary,
              height: 44,
              width: 44,
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={logout}>
            <MaterialIcons name="logout" color={'white'} size={26} />
          </CustomButton>
        </View>
      </View>
      {userOrg ? (
        <UserOrganization userOrg={userOrg} />
      ) : (
        <CreateUserOrganization token={token} />
      )}
    </View>
  );
};

export default SettingsScreen;
