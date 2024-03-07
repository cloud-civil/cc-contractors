import {View, Text, FlatList, Dimensions} from 'react-native';
import styles from '../../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {shallowEqual, useSelector} from 'react-redux';
import {formatDate} from '../../../utils/index';

const RentPayable = ({route}) => {
  const {project_id} = route.params;
  const orgAssets = useSelector(state => state.app.assets, shallowEqual);
  const orgAssetsAsObject = (orgAssets && orgAssets.asObject) || null;
  const project_assets__ = useSelector(
    state => state.project.assets,
    shallowEqual,
  );

  return (
    <View style={styles.container}>
      {project_assets__ &&
        project_assets__[project_id] &&
        project_assets__[project_id].asArray && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={project_assets__[project_id].asArray.filter(
              item => item.end_date,
            )}
            renderItem={({item}) => {
              if (!item.end_date) return null;
              return (
                <View key={item.start_date} style={styles.card}>
                  <View style={[styles.assIcon]}>
                    <MaterialCommunityIcons
                      name="chart-box-outline"
                      size={24}
                      color="white"
                    />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={{fontSize: 16, fontWeight: 500}}>
                      {orgAssetsAsObject &&
                        orgAssetsAsObject[item.asset_id].name}
                    </Text>
                    <Text style={styles.info}>
                      Serial No: {item.serial_no}, Rented at ₹{item.rate}/
                      {item.usage}
                    </Text>
                    <Text style={styles.info}>
                      Rented from: {formatDate(item.start_date)} to{' '}
                      {formatDate(item.end_date)}
                    </Text>
                  </View>
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
                <Text>No rent is currently due for payment.</Text>
              </View>
            }
          />
        )}
    </View>
  );
};

export default RentPayable;
