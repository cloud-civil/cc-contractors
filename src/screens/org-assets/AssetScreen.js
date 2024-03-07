import {useState} from 'react';
import {View, Text, FlatList, Dimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../styles/Colors';
import FloatingButton from '../../components/FloatingButton';
import {useSelector} from 'react-redux';
import styles from '../../styles/styles';
import {AddAssetModal} from './AddAssetModal';
import SizeButton from '../../components/SizeButton';
import {useNavigation} from '@react-navigation/native';

const AssetScreen = () => {
  const navigation = useNavigation();
  const assets = useSelector(state => state.app.assets);
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{height: 40}} />
      <View style={styles.headerContent}>
        <Text style={styles.heading}>Assets</Text>
      </View>
      {assets && assets.asArray && (
        <View style={{height: '90%'}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={assets.asArray}
            renderItem={({item}) => (
              <SizeButton
                onClick={() => {
                  navigation.navigate('AssetDetails', {activeAsset: item});
                }}
                key={item.asset_id}>
                <View style={styles.card}>
                  <View style={styles.assIcon}>
                    <MaterialCommunityIcons
                      name="fire-truck"
                      color={Colors.textColor}
                      size={28}
                    />
                  </View>
                  <View
                    style={[
                      styles.cardContent,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                      },
                    ]}>
                    <View style={{flex: 1}}>
                      <Text style={styles.cardContentHeader}>{item.name}</Text>
                      <Text style={{fontSize: 12}}>
                        Asset UID: {item.asset_uid}
                      </Text>
                    </View>
                    <View style={{marginLeft: 'auto'}}>
                      {item.status === 100 ? (
                        <Text style={{color: 'green'}}>Available</Text>
                      ) : null}
                      {item.status === 101 ? (
                        <Text style={{color: 'orange'}}>Currenly in use</Text>
                      ) : null}
                      {item.status === 103 ? (
                        <Text style={{color: 'red'}}>Broken</Text>
                      ) : null}
                    </View>
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
                <Text>You asset is empty.</Text>
              </View>
            }
          />
        </View>
      )}
      <FloatingButton onClick={() => setShowModal(true)}>
        <MaterialCommunityIcons
          name="chart-box-plus-outline"
          color={'white'}
          size={28}
        />
      </FloatingButton>

      <View>
        <AddAssetModal showModal={showModal} setShowModal={setShowModal} />
      </View>
    </View>
  );
};

export default AssetScreen;
