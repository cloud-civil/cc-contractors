import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  // TouchableOpacity,
  Animated,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FloatingButton from '../../components/FloatingButton';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../styles/styles';
import {AddUserModal} from '../Modals/AddUserModal';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {CustomButton} from '../../components/CustomButton';
import {setUsers} from '../../cc-hooks/src/appSlice';
import Toast from 'react-native-toast-message';
import Colors from '../../styles/Colors';
import SizeButton from '../../components/SizeButton';
import {useNavigation} from '@react-navigation/native';

const UserScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const viewHeight = useRef(new Animated.Value(0)).current;
  const token = useSelector(state => state.auth.token);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const orgUsersAsArray = useSelector(state => state.app.users.asArray);
  const userOrg = useSelector(state => state.auth.org);
  const authUser = useSelector(state => state.auth.user);
  const [findPhone, setFindPhone] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState('not searched');

  const toggleSearch = () => {
    setSearchedUsers([]);
    setFindPhone('');
    setLoading('not searched');
    Animated.spring(viewHeight, {
      toValue: screenHeight + 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    inputRef.current.focus();
  };

  const hideSearchBox = () => {
    inputRef.current.blur();
    Animated.timing(viewHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getUserByPhone = () => {
    setLoading(true);
    axiosInstance(token)
      .get(`/getUserByPhoneNumber/${findPhone}`)
      .then(({data}) => {
        setSearchedUsers(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err, '/getUserByPhoneNumber', err?.response?.data?.message);
        setLoading('not found');
      });
  };

  const removeUserToOrganization = user => {
    axiosInstance(token)
      .post('/removeUserToOrganization', {
        user_id: user.user_id,
        org_id: userOrg.org_id,
      })
      .then(() => {
        const newUser = orgUsersAsArray.filter(
          item => item.user_id !== user.user_id,
        );
        dispatch(setUsers(newUser));
        Toast.show({
          type: 'success',
          text1: 'Removed',
          text2: 'User removed from organization succesfully.',
        });
      })
      .catch(err => {
        console.log(
          err,
          '/removeUserToOrganization',
          err?.response?.data?.message,
        );
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not remove user.',
        });
      });
  };

  return (
    <>
      <TopSheet
        loading={loading}
        screenWidth={screenWidth}
        hideSearchBox={hideSearchBox}
        inputRef={inputRef}
        viewHeight={viewHeight}
        getUserByPhone={getUserByPhone}
        findPhone={findPhone}
        setFindPhone={setFindPhone}
        searchedUsers={searchedUsers}
        dispatch={dispatch}
        token={token}
        userOrg={userOrg}
        orgUsersAsArray={orgUsersAsArray}
      />
      <View style={styles.container}>
        <View style={{height: 40}} />
        <View style={styles.headerContent}>
          <Text style={styles.heading}>Organization users</Text>
          <TouchableOpacity onPress={toggleSearch} style={{marginRight: 4}}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 8,
                borderRadius: 50,
              }}>
              <MaterialIcons name="search" size={22} />
            </View>
          </TouchableOpacity>
        </View>
        {orgUsersAsArray && (
          <View style={{height: '90%'}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={orgUsersAsArray}
              renderItem={({item}) => (
                <SizeButton
                  key={item.user_id}
                  onClick={() =>
                    navigation.navigate('UserDetails', {activeUser: item})
                  }>
                  <View style={styles.card}>
                    <View style={styles.assIcon}>
                      <MaterialIcons
                        name="person"
                        color={Colors.textColor}
                        size={28}
                      />
                    </View>
                    <View style={{marginLeft: 10, width: screenWidth * 0.6}}>
                      <Text numberOfLines={1} style={styles.cardContentHeader}>
                        {item.fname} {item.lname}
                      </Text>
                    </View>
                    <View style={{marginLeft: 'auto'}}>
                      {item.user_id === authUser.user_id ||
                      userOrg.user_id === item.user_id ? null : (
                        <CustomButton
                          buttonStyle={{
                            backgroundColor: '#f2f2f2',
                            borderRadius: 8,
                            padding: 6,
                          }}
                          onClick={() => removeUserToOrganization(item)}>
                          <MaterialIcons
                            name="person-remove"
                            size={22}
                            color={Colors.primary}
                          />
                        </CustomButton>
                      )}
                    </View>
                  </View>
                </SizeButton>
              )}
            />
          </View>
        )}
      </View>

      <FloatingButton onClick={() => setShowModal(true)}>
        <FontAwesome6 name="user-plus" color={'white'} size={22} />
      </FloatingButton>

      {showModal && (
        <AddUserModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </>
  );
};

const TopSheet = ({
  loading,
  screenWidth,
  hideSearchBox,
  inputRef,
  viewHeight,
  getUserByPhone,
  findPhone,
  setFindPhone,
  searchedUsers,
  dispatch,
  token,
  userOrg,
  orgUsersAsArray,
}) => {
  const orgUsersAsObject = useSelector(state => state.app.users.asObject);

  const addUserToOrganization = adduser => {
    axiosInstance(token)
      .post('/addUserToOrganization', {
        user_id: adduser.user_id,
        org_id: userOrg.org_id,
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Added',
          text2: 'User added to organization succesfully.',
        });
        dispatch(setUsers([adduser, ...orgUsersAsArray]));
      })
      .catch(err => {
        console.log(
          err,
          '/removeUserToOrganization',
          err?.response?.data?.message,
        );
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not add user.',
        });
      });
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: screenWidth,
        height: viewHeight,
        backgroundColor: 'white',
        zIndex: 1000,
        paddingHorizontal: 20,
      }}>
      <View style={{marginTop: 46}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f2f2f2',
            borderRadius: 8,
          }}>
          <TouchableOpacity
            onPress={hideSearchBox}
            style={{
              width: 30,
              marginLeft: 10,
            }}>
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              style={{paddingHorizontal: 7}}
            />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            // keyboardType="numeric"
            placeholder="Search by phone ..."
            style={{
              marginLeft: 10,
              height: 46,
              flex: 1,
            }}
            onSubmitEditing={getUserByPhone}
            returnKeyType="search"
            value={findPhone}
            onChangeText={setFindPhone}
          />
          <TouchableOpacity
            onPress={getUserByPhone}
            style={{
              marginRight: 10,
              padding: 4,
              width: 30,
              height: 30,
            }}>
            <MaterialIcons name="search" size={22} />
          </TouchableOpacity>
        </View>
        {loading === false ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={searchedUsers}
            contentContainerStyle={{
              marginTop: 10,
              height: '90%',
            }}
            renderItem={({item, index}) => (
              <View
                key={item.user_id}
                style={[
                  styles.cardBorder,
                  {
                    width: screenWidth - 46,
                    borderBottomWidth:
                      searchedUsers.length - 1 !== index ? 1 : 0,
                  },
                ]}>
                <View style={styles.assIcon}>
                  <MaterialIcons
                    name="person"
                    color={Colors.textColor}
                    size={28}
                  />
                </View>
                <View style={{marginLeft: 10, width: screenWidth * 0.5}}>
                  <Text numberOfLines={1} style={styles.cardContentHeader}>
                    {item.fname} {item.lname}
                  </Text>
                  <Text numberOfLines={1}>{item.phone}</Text>
                </View>
                <View style={{marginLeft: 'auto'}}>
                  {!orgUsersAsObject[item.user_id] ? (
                    <CustomButton
                      buttonStyle={{
                        backgroundColor: '#f2f2f2',
                        borderRadius: 8,
                        padding: 6,
                      }}
                      onClick={() => addUserToOrganization(item)}>
                      <MaterialIcons
                        name="person-add-alt-1"
                        size={22}
                        color={Colors.primary}
                      />
                    </CustomButton>
                  ) : (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{color: 'green'}}>Added</Text>
                      <MaterialIcons
                        name="check-circle"
                        color={'green'}
                        size={14}
                        style={{marginLeft: 3}}
                      />
                    </View>
                  )}
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{textAlign: 'center', marginTop: 200}}>
                User not found
              </Text>
            }
          />
        ) : loading === true ? (
          <View style={styles.emptyTabView}>
            <ActivityIndicator
              loading={true}
              size={36}
              color={Colors.primary}
            />
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
};

export default UserScreen;
