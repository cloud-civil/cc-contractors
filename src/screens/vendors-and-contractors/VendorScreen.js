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
  Linking,
  Platform,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../styles/Colors';
import FloatingButton from '../../components/FloatingButton';
import {useSelector} from 'react-redux';
import styles from '../../styles/styles';
import {CreateVendorModal} from './CreateVendorModal';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import Tabs from '../../components/Tabs';
import SizeButton from '../../components/SizeButton';
import {CreateContractorModal} from './CreateContractorModal';
import {useNavigation} from '@react-navigation/native';
import VendorCard from '../../components/cards/VendorCard';

const data = {
  Vendors: {
    name: 'Vendor',
    key: 'vendor',
    getUrl: 'getVendorsByPhone',
    addUrl: 'addVendorToOrg',
  },
  Contractors: {
    name: 'Contractor',
    key: 'contractor',
    getUrl: 'getContractorsByPhone',
    addUrl: 'addContractorToOrg',
  },
};

const VendorScreen = () => {
  const inputRef = useRef();
  const navigation = useNavigation();
  const tabs = ['Vendors', 'Contractors'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const activeData = data[activeTab];
  const token = useSelector(state => state.auth.token);
  const [phone, setPhone] = useState('');
  const [searchData, setSearchData] = useState([]);
  const viewHeight = useRef(new Animated.Value(0)).current;

  const vendors = useSelector(state => state.app.vendors.asArray);
  const contractors = useSelector(state => state.app.contractors.asArray);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showContractorModal, setShowContractorModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState('not searched');

  const toggleSearch = () => {
    setSearchData([]);
    setPhone('');
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

  const findContext = () => {
    if (phone === '') {
      return;
    }
    setLoading(true);
    axiosInstance(token)
      .get(`/${activeData.getUrl}/${phone}`)
      .then(({data}) => {
        setSearchData(data.data);
        setLoading(false);
        console.log('response', data.data);
      })
      .catch(err => {
        console.error(err);
        setLoading('not found');
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
        findContext={findContext}
        phone={phone}
        setPhone={setPhone}
        searchData={searchData}
        activeData={activeData}
      />
      <View style={styles.container}>
        <View style={{height: 40}} />
        <View style={styles.headerContent}>
          <Text style={styles.heading}>Vendors & Contractors</Text>
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
        <View style={{marginTop: -10}}>
          <Tabs
            data={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            numOfTab={2}
            minusWidth={20}
          />
        </View>

        <View style={{height: '90%', marginTop: 10}}>
          {activeTab === 'Vendors' && vendors && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={vendors}
              renderItem={({item}) => (
                <SizeButton
                  onClick={() => {
                    navigation.navigate('VendorDetails', {
                      activeVendor: item,
                    });
                  }}
                  key={item.vendor_id}>
                  <VendorCard item={item} />
                </SizeButton>
              )}
              ListEmptyComponent={
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: Dimensions.get('window').height - 140,
                  }}>
                  <Text>There is no vendor.</Text>
                </View>
              }
            />
          )}
          {activeTab === 'Contractors' && contractors && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={contractors}
              renderItem={({item}) => (
                <SizeButton
                  onClick={() => {
                    setActiveItem(item);
                    navigation.navigate('ContractorDetails', {
                      activeContractor: item,
                    });
                  }}
                  key={item.contractor_id}>
                  <View style={styles.card}>
                    <View style={styles.assIcon}>
                      <FontAwesome6
                        name="building-user"
                        color={Colors.textColor}
                        size={20}
                      />
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        width: screenWidth * 0.65,
                      }}>
                      <Text numberOfLines={1} style={styles.cardContentHeader}>
                        {item.name}
                      </Text>
                    </View>
                  </View>
                </SizeButton>
              )}
              ListEmptyComponent={
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: Dimensions.get('window').height - 140,
                  }}>
                  <Text>There is no contractor.</Text>
                </View>
              }
            />
          )}
        </View>

        <FloatingButton
          onClick={() => {
            setModalMode('create');
            activeTab === 'Vendors'
              ? setShowVendorModal(true)
              : setShowContractorModal(true);
          }}>
          {activeTab === 'Vendors' ? (
            <MaterialCommunityIcons
              name="store-plus-outline"
              color={'white'}
              size={28}
            />
          ) : (
            <FontAwesome6 name="person-circle-plus" color={'white'} size={28} />
          )}
        </FloatingButton>

        <CreateVendorModal
          activeItem={activeItem}
          modalMode={modalMode}
          showModal={showVendorModal}
          setShowModal={setShowVendorModal}
        />
        <CreateContractorModal
          activeItem={activeItem}
          modalMode={modalMode}
          showModal={showContractorModal}
          setShowModal={setShowContractorModal}
        />
      </View>
    </>
  );
};

const TopSheet = ({
  loading,
  screenWidth,
  hideSearchBox,
  inputRef,
  viewHeight,
  findContext,
  phone,
  setPhone,
  searchData,
  activeData,
}) => {
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
            style={{width: 30, marginLeft: 10}}>
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              style={{paddingHorizontal: 7}}
            />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            // keyboardType="numeric"
            placeholder={`Search ${activeData.key} by phone ...`}
            style={{
              marginLeft: 10,
              height: 46,
              flex: 1,
            }}
            onSubmitEditing={findContext}
            returnKeyType="search"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity
            onPress={findContext}
            style={{
              marginRight: 10,
              padding: 4,
              width: Platform.OS === 'android' ? 30 : null,
              height: Platform.OS === 'android' ? 30 : null,
            }}>
            <MaterialIcons name="search" size={22} />
          </TouchableOpacity>
        </View>
        {loading === false ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={searchData}
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
                    borderBottomWidth: searchData.length - 1 !== index ? 1 : 0,
                  },
                ]}>
                <View style={styles.assIcon}>
                  <FontAwesome6
                    name={
                      activeData.key === 'vendor' ? 'shop' : 'building-user'
                    }
                    color={Colors.textColor}
                    size={20}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text numberOfLines={1} style={styles.cardContentHeader}>
                    {item.name}
                  </Text>
                  <Text numberOfLines={1}>{item.phone}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{textAlign: 'center', marginTop: 200}}>
                {activeData.name} not found
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

export default VendorScreen;
