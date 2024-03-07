import {useEffect, useState} from 'react';
import {logoutUser, setOrg} from '../cc-hooks/src/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {axiosInstance} from '../apiHooks/axiosInstance';
import {Dimensions, Text, View} from 'react-native';
import {CustomButton} from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles';
import Colors from '../styles/Colors';
// import {StatusBar} from 'expo-status-bar';
import CustomLoader from '../components/CustomLoader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SizeButton from '../components/SizeButton';
import Input from '../components/Input';
import {GoBack} from '../components/HeaderButtons';
import {resetState} from '../cc-hooks/src/appSlice';

const CreateUserOrganization = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
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
        dispatch(setOrg(data.data));
      })
      .catch(() => {});
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
    <>
      <GoBack onClick={logout} />

      <View style={{marginHorizontal: 10}}>
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
    </>
  );
};

const SelectOrg = () => {
  const dispatch = useDispatch();
  const [orgs, setOrgs] = useState(null);
  const token = useSelector(state => state.auth.token);
  const authUser = useSelector(state => state.auth.user);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getOrganizationsOfUser/${authUser.phone}`)
      .then(res => {
        setOrgs(res.data.data);
      })
      .catch(err => {
        console.error(err.response.data.message);
        // console.error(err, JSON.stringify(err));
      });
  }, []);

  if (orgs && orgs.length === 0) {
    return (
      <>
        {/* <StatusBar style="dark" /> */}
        <View style={{width: '100%', marginTop: 50}}>
          <View
            style={{
              width: '95%',
              display: 'flex',
              marginRight: 'auto',
              marginLeft: 'auto',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <CreateUserOrganization />
          </View>
        </View>
      </>
    );
  }

  if (orgs && orgs.length > 0) {
    return (
      <>
        {/* <StatusBar style="dark" /> */}
        <View
          style={{
            marginTop: 50,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{marginBottom: 24}}>
            <Text style={styles.heading}>Select Organization</Text>
          </View>
          <View style={{}}>
            {orgs &&
              orgs.map(org => {
                return (
                  <SizeButton
                    buttonStyle={{
                      width: Dimensions.get('window').width * 0.67,
                    }}
                    key={org.org_id}
                    onClick={() => {
                      dispatch(setOrg(org));
                      AsyncStorage.setItem('USER_ORG', JSON.stringify(org));
                    }}>
                    <View
                      style={[
                        styles.card,
                        {width: Dimensions.get('window').width * 0.67},
                      ]}>
                      <View style={[styles.assIcon, {width: 30, height: 30}]}>
                        <MaterialIcons
                          name="business"
                          color={'white'}
                          size={20}
                        />
                      </View>
                      <Text
                        style={{
                          fontWeight: '500',
                          fontSize: 16,
                          marginLeft: 10,
                        }}>
                        {org.name}
                      </Text>
                    </View>
                  </SizeButton>
                );
              })}
          </View>
        </View>
      </>
    );
  }

  return <CustomLoader loading={true} />;
};

export default SelectOrg;
