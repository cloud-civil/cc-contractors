import {FlatList, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SizeButton from '../../../../components/SizeButton';
import styles from '../../../../styles/styles';
import {formateAmount} from '../../../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../styles/Colors';
import {Menu} from 'react-native-paper';
import {useRef} from 'react';

const SearchedMaterial = props => {
  const {
    activity,
    setActivity,
    searchedData,
    setSearchedData,
    setSearchTerm,
    permission,
  } = props;
  const viewRef = useRef();
  return (
    <View>
      <View
        style={{
          margin: 5,
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text>Searched result for &quot;{activity.searchTerm}&quot;</Text>
        <TouchableOpacity
          onPress={() => {
            setSearchedData(null);
            setSearchTerm('');
          }}>
          <Text style={{color: Colors.primary}}>Clear all</Text>
        </TouchableOpacity>
      </View>
      {searchedData.length ? (
        <FlatList
          contentContainerStyle={{height: '95%'}}
          data={searchedData}
          renderItem={({item: stock}) => (
            <View key={stock.stock_id}>
              <SizeButton buttonStyle={{zIndex: 0}}>
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
                            marginTop: 30,
                            marginLeft: -12,
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
          )}
        />
      ) : (
        <View style={styles.emptyTabView}>
          <Text>Searched material not found</Text>
        </View>
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

export default SearchedMaterial;
