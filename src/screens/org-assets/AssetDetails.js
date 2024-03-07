import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import styles from '../../styles/styles';
import {useNavigation} from '@react-navigation/native';
import {GoBack} from '../../components/HeaderButtons';
import KeyValueCard from '../../components/KeyValueCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import Colors from '../../styles/Colors';
import {formatDate, getDateRange} from '../../utils';

const AssetDetails = ({route}) => {
  const {activeAsset} = route.params;
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);
  const orgUsersAsObject = useSelector(state => state.app.users.asObject);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getAssetsUsedInAllProjects?asset_id=${activeAsset.asset_id}`)
      .then(({data}) => {
        setAssets(data.data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <View style={{height: 40}} />
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
            {activeAsset?.name}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <KeyValueCard
            name={'Asset UID'}
            value={activeAsset.asset_uid}
            style={{marginBottom: 10, width: '49%'}}
            icon={
              <MaterialCommunityIcons
                name="order-numeric-ascending"
                size={24}
                color={'#666'}
              />
            }
          />
          <KeyValueCard
            name={'Status'}
            value={
              activeAsset.status === 100
                ? 'Available'
                : activeAsset.status === 101
                ? 'Currenly in use'
                : activeAsset.status === 103
                ? 'Broken'
                : null
            }
            style={{marginBottom: 10, width: '49%'}}
            icon={
              <MaterialCommunityIcons
                name="list-status"
                size={24}
                color={'#666'}
              />
            }
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <KeyValueCard
            name={'Asset Type'}
            value={activeAsset.asset_type}
            style={{marginBottom: 10, width: '49%'}}
            icon={
              <MaterialCommunityIcons
                name="format-list-bulleted-type"
                size={24}
                color={'#666'}
              />
            }
          />
          <KeyValueCard
            name={'Asset Value'}
            value={activeAsset.asset_value}
            style={{marginBottom: 10, width: '49%'}}
            icon={
              <MaterialIcons name="currency-rupee" size={24} color={'#666'} />
            }
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Asset used history
          </Text>

          {!loading ? (
            <>
              {assets && assets.length > 0 ? (
                <FlatList
                  contentContainerStyle={{marginTop: 10, paddingBottom: 180}}
                  showsVerticalScrollIndicator={false}
                  data={assets}
                  renderItem={({item}) => (
                    <View style={styles.card}>
                      <View style={styles.assIcon}>
                        <MaterialCommunityIcons
                          name="transit-transfer"
                          color="white"
                          size={26}
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View>
                          <Text style={{fontWeight: 'bold', marginBottom: 4}}>
                            {activeAsset?.name}
                          </Text>

                          {item.user_id && orgUsersAsObject?.[item?.user_id] && (
                            <Text>
                              By {orgUsersAsObject[item.user_id].fname}{' '}
                              {orgUsersAsObject[item.user_id].lname}
                            </Text>
                          )}
                        </View>
                        <View>
                          <Text>
                            {item.end_date
                              ? getDateRange(item.start_date, item.end_date)
                              : formatDate(item.start_date)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                />
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '84%',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'grey',
                    }}>
                    There is no use history for this asset
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyTabView}>
              <ActivityIndicator color={Colors.primary} />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default AssetDetails;
