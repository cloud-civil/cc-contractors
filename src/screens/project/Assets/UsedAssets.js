import {
  View,
  Text,
  // TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import styles from '../../../styles/styles';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../styles/Colors';
import {getPermissions} from '../../../utils';
import Toast from 'react-native-toast-message';
import {setOrgAssetsData} from '../../../cc-hooks/src/appSlice';
import {createHookData} from '../../../cc-utils/src';

const UsedAssets = ({
  project_id,
  usedLoading,
  assetUsedInSite,
  setRender,
  reRender,
}) => {
  const dispatch = useDispatch();
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1002);
  const permission = x && JSON.parse(x.permission);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const orgAssets = useSelector(state => state.app.assets, shallowEqual);
  const orgUsersAsObject = useSelector(
    state => state.app.users.asObject,
    shallowEqual,
  );
  const orgAssetsAsObject = (orgAssets && orgAssets.asObject) || null;

  const handleClickButton = (item, type) => {
    Alert.alert(
      `${type == 'return' ? 'Return !' : 'Mark Broken !'}`,
      `${
        type == 'return'
          ? 'Are you sure you want to return Asset ?'
          : 'Are you sure you want to mark this asset as broken?'
      }`,
      [
        {
          text: 'No',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            if (type === 'return') {
              returnAsset(item);
            } else {
              markBroken(item);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const returnAsset = asset => {
    axiosInstance(token)
      .post('/returnAssetFromProjectId', {
        project_id,
        asset_id: asset.asset_id,
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Asset has been returned succesfully.',
        });
        setRender({
          ...reRender,
          return: reRender.return + 1,
          used: reRender.used + 1,
        });
        const newAssets = orgAssets.asArray.map(item => {
          if (item.asset_id === asset.asset_id) {
            return {...item, status: 100};
          }
          return item;
        });
        dispatch(
          setOrgAssetsData({
            data: createHookData('asset_id', newAssets),
          }),
        );
        setRender(prev => prev + 1);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to return asset.',
        });
        console.error(err);
      });
  };

  const markBroken = asset => {
    axiosInstance(token)
      .post('/markAssetAsBroken', {
        project_id,
        asset_id: asset.asset_id,
        project_asset_id: asset.project_asset_id,
      })
      .then(() => {
        setRender({
          ...reRender,
          used: reRender.used + 1,
          broken: reRender.broken + 1,
        });
        const newAssets = orgAssets.asArray.map(item => {
          if (item.asset_id === asset.asset_id) {
            return {...item, status: 103};
          }
          return item;
        });
        dispatch(
          setOrgAssetsData({
            data: createHookData('asset_id', newAssets),
          }),
        );
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Asset has been marked as broken successfully.',
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to mark asset as broken.',
        });
        console.log(err, '/markAssetAsBroken', err?.response?.data?.message);
      });
  };

  return (
    <View style={styles.container}>
      {!usedLoading ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={assetUsedInSite.filter(item => item.end_date === null)}
          renderItem={({item}) => {
            return (
              <View key={item.project_asset_id} style={styles.card}>
                <View style={styles.assIcon}>
                  <MaterialCommunityIcons
                    name="chart-box-outline"
                    size={24}
                    style={{
                      color: 'white',
                    }}
                  />
                </View>
                <View
                  style={{
                    width: Dimensions.get('window').width * 0.65,
                    marginLeft: 10,
                  }}>
                  <Text style={{fontSize: 14, fontWeight: 600}}>
                    {orgAssetsAsObject && orgAssetsAsObject[item.asset_id].name}
                  </Text>
                  <Text style={{fontSize: 13}}>
                    Asset UID :{' '}
                    {orgAssetsAsObject &&
                      orgAssetsAsObject[item.asset_id].asset_uid}
                  </Text>
                  <Text style={{fontSize: 13}}>
                    Issued by :{' '}
                    {orgUsersAsObject &&
                      orgUsersAsObject[item.user_id] &&
                      `${orgUsersAsObject[item.user_id].fname} ${
                        orgUsersAsObject[item.user_id].lname
                      }`}
                  </Text>
                </View>
                {permission && permission.write && (
                  <View style={{marginLeft: 'auto', marginRight: 6}}>
                    <TouchableOpacity
                      onPress={() => {
                        handleClickButton(item, 'return');
                      }}>
                      <Text
                        style={{
                          color: Colors.primary,
                          fontWeight: 600,
                          marginBottom: 3,
                        }}>
                        Return
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleClickButton(item, 'broken');
                      }}>
                      <Text
                        style={{
                          color: Colors.error,
                          fontWeight: 600,
                          marginTop: 3,
                        }}>
                        Broken
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: Dimensions.get('window').height - 200,
              }}>
              <Text>No asset is currently being used.</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

export default UsedAssets;
