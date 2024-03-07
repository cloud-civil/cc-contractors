import React from 'react';
import {View, Text, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import styles from '../../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {shallowEqual, useSelector} from 'react-redux';
import Colors from '../../../styles/Colors';
import {getPermissions} from '../../../utils';
import {useState} from 'react';
import UseAssetModal from './UseAssetModal';

const AvailableAssets = ({
  project_id,
  reRender,
  setRender,
  availableAssets,
}) => {
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1002);
  const permission = x && JSON.parse(x.permission);

  const [showUseAssetModal, setShowUseAssetModal] = useState(false);
  const [activeAsset, setActiveAsset] = useState(null);

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={availableAssets}
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
                <Text style={{fontSize: 14, fontWeight: 600}}>{item.name}</Text>
                <Text style={{fontSize: 13}}>Asset UID : {item.asset_uid}</Text>
              </View>
              {permission && permission.write && (
                <TouchableOpacity
                  onPress={() => {
                    setActiveAsset(item);
                    setShowUseAssetModal(true);
                  }}
                  style={{marginLeft: 'auto', marginRight: 6}}>
                  <Text style={{color: Colors.primary, fontWeight: 600}}>
                    Use
                  </Text>
                </TouchableOpacity>
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
            <Text>No asset is available right now.</Text>
          </View>
        }
      />
      {activeAsset && showUseAssetModal && (
        <UseAssetModal
          showModal={showUseAssetModal}
          setShowModal={setShowUseAssetModal}
          project_id={project_id}
          activeAsset={activeAsset}
          setRender={setRender}
          reRender={reRender}
        />
      )}
    </View>
  );
};

export default AvailableAssets;
