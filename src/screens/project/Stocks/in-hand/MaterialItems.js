import {View, Text, FlatList, StyleSheet, Platform} from 'react-native';
import SizeButton from '../../../../components/SizeButton';
import styles from '../../../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {formateAmount} from '../../../../utils';
import {Menu} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const MaterialItems = ({
  groupStocks,
  activeGroupId,
  activity,
  setActivity,
  viewRef,
  permission,
}) => {
  const navigation = useNavigation();
  return (
    <View style={{marginTop: 10}}>
      {groupStocks[activeGroupId] && (
        <FlatList
          data={groupStocks[activeGroupId]}
          renderItem={({item: stock, index}) => {
            return (
              <View key={index}>
                <SizeButton
                  onClick={() => {
                    navigation.navigate('StockHistory', {
                      stock: stock,
                    });
                  }}
                  buttonStyle={{zIndex: 0}}>
                  <View style={[styles.card, {overflow: 'visible', zIndex: 1}]}>
                    <View style={styles.assIcon}>
                      <Feather name="activity" size={24} color="white" />
                    </View>
                    <View
                      style={{
                        marginLeft: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <View>
                        <Text style={{fontSize: 16, fontWeight: '600'}}>
                          {stock.name}
                        </Text>
                        <Text style={{fontSize: 13}}>
                          Available:{' '}
                          {stock.total > 0 ? formateAmount(stock.total) : 0}{' '}
                          {stock.unit}
                        </Text>
                        <Text style={{fontSize: 13}}>
                          Used: {stock.used > 0 ? formateAmount(stock.used) : 0}{' '}
                          {stock.unit}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: 'auto',
                          justifyContent: 'space-between',
                        }}>
                        {permission && permission.update && (
                          <Menu
                            style={{
                              marginTop: Platform.OS === 'ios' ? 30 : -40,
                              marginLeft: Platform.OS === 'ios' ? -16 : -34,
                            }}
                            contentStyle={{
                              backgroundColor: 'white',
                              borderRadius: 6,
                              paddingVertical: 0,
                            }}
                            visible={
                              activity.menuVisible &&
                              activity.stock_id === stock.stock_id
                            }
                            onDismiss={() =>
                              setActivity({...activity, menuVisible: false})
                            }
                            anchorPosition="top"
                            anchor={
                              <TouchableOpacity
                                onPress={() => {
                                  setActivity({
                                    ...activity,
                                    menuVisible: true,
                                    stock_id: stock.stock_id,
                                  });
                                }}
                                style={{marginLeft: 8}}>
                                <View ref={viewRef}>
                                  <MaterialCommunityIcons
                                    name="dots-vertical"
                                    size={28}
                                  />
                                </View>
                              </TouchableOpacity>
                            }>
                            <View>
                              <TouchableOpacity
                                onPress={() => {
                                  setActivity({
                                    ...activity,
                                    activeStock: stock,
                                    editStock: true,
                                    menuVisible: false,
                                  });
                                }}>
                                <View style={customStyle.menuTab}>
                                  <Text>Edit stock</Text>
                                  <MaterialCommunityIcons
                                    name="square-edit-outline"
                                    size={16}
                                    style={{marginTop: 4, marginLeft: 'auto'}}
                                  />
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  setActivity({
                                    ...activity,
                                    activeStock: stock,
                                    menuVisible: false,
                                    issueStock: true,
                                  });
                                }}>
                                <View style={customStyle.menuTab}>
                                  <Text>Issue</Text>
                                  <MaterialCommunityIcons
                                    name="chart-timeline-variant-shimmer"
                                    size={16}
                                    style={{marginTop: 4, marginLeft: 'auto'}}
                                  />
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  setActivity({
                                    ...activity,
                                    stock_id: stock.stock_id,
                                    menuVisible: false,
                                    moveToGroup: true,
                                  });
                                }}>
                                <View
                                  style={[
                                    customStyle.menuTab,
                                    {borderBottomWidth: 0},
                                  ]}>
                                  <Text>Move to group</Text>
                                  <MaterialCommunityIcons
                                    name="tray-arrow-up"
                                    size={16}
                                    style={{
                                      marginTop: 4,
                                      marginLeft: 'auto',
                                    }}
                                  />
                                </View>
                              </TouchableOpacity>
                            </View>
                          </Menu>
                        )}
                      </View>
                    </View>
                  </View>
                </SizeButton>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const customStyle = StyleSheet.create({
  menuTab: {
    flex: 1,
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default MaterialItems;
