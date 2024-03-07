import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import styles from '../../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {getPermissions} from '../../../utils';
import Toast from 'react-native-toast-message';
import {setOrgAssetsData} from '../../../cc-hooks/src/appSlice';
import {createHookData} from '../../../cc-utils/src';
import Colors from '../../../styles/Colors';

const BrokenAssets = ({project_id, brokenAssets, setRender, reRender}) => {
  const dispatch = useDispatch();
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1002);
  const permission = x && JSON.parse(x.permission);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const orgAssets = useSelector(state => state.app.assets, shallowEqual);
  const orgAssetsAsObject = (orgAssets && orgAssets.asObject) || null;

  const handleClickButton = item => {
    Alert.alert(
      'Mark Fixed !',

      'Are you sure you want to mark this asset as fixed ?',
      [
        {
          text: 'No',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Yes',
          onPress: () => markFixed(item),
        },
      ],
      {cancelable: false},
    );
  };

  const markFixed = asset => {
    axiosInstance(token)
      .post('/markAssetAsFixed', {
        project_id,
        asset_id: asset.asset_id,
        broken_asset_id: asset.broken_asset_id,
      })
      .then(() => {
        setRender({
          ...reRender,
          broken: reRender.broken + 1,
          used: reRender.used + 1,
        });
        const newAssets = orgAssets.asArray.map(item => {
          if (item.asset_id === asset.asset_id) {
            return {...item, status: 101};
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
        console.log(err, '/markAssetAsFixed', err?.response?.data?.message);
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={brokenAssets}
        renderItem={({item}) => {
          return (
            <View style={styles.card}>
              <View style={styles.assIcon}>
                <MaterialCommunityIcons
                  name="chart-box-outline"
                  size={24}
                  color={'white'}
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
              </View>
              {permission && permission.write && item.status !== 100 && (
                <TouchableOpacity
                  onPress={() => {
                    handleClickButton(item);
                  }}
                  style={{marginLeft: 'auto', marginRight: 6}}>
                  <Text style={{color: Colors.primary, fontWeight: 600}}>
                    Mark Fixed
                  </Text>
                </TouchableOpacity>
              )}
              {item.status === 100 && (
                <Text style={{fontWeight: 600, color: Colors.success}}>
                  Fixed
                </Text>
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
            <Text>No asset is broken right now.</Text>
          </View>
        }
      />
    </View>
  );
};

export default BrokenAssets;
