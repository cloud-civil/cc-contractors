import React from 'react';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  // TouchableOpacity,
  Alert,
} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {getPermissions} from '../../../../utils';
import {setStocksGroup} from '../../../../cc-hooks/src/stockSlice';
import MaterialItems from './MaterialItems';

const StockGroups = props => {
  const token = useSelector(state => state.auth.token, shallowEqual);
  const viewRef = useRef();

  const {
    project_id,
    activity,
    setActivity,
    groupStocks,
    stockCategoriesAsObject,
    stockCategoriesAsArray,
  } = props;
  const {activeGroupId, links} = activity;

  const dispatch = useDispatch();
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1015);
  const permission = x && JSON.parse(x.permission);

  const deleteCategory = () => {
    axiosInstance(token)
      .post(`/${activeGroupId}/deleteStockGroupForProject`)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Stock group was deleted successfully',
        });
        const asObject = delete stockCategoriesAsObject[activeGroupId];
        const asArray = stockCategoriesAsArray.filter(
          item => item.group_id !== activeGroupId,
        );
        dispatch(
          setStocksGroup({
            project_id,
            data: {
              asArray,
              asObject,
            },
          }),
        );
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to delete stock group',
        });
      });
  };

  const handleDeleteStockGroup = () => {
    Alert.alert(
      'Delete',
      `Are you sure you want to delete ${
        stockCategoriesAsObject[links[links.length - 1]]?.name
      }.`,
      [
        {
          text: 'No',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => deleteCategory(),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View
      style={{
        height: '100%',
      }}>
      {groupStocks[activeGroupId] && groupStocks[activeGroupId].length !== 0 ? (
        <View>
          {permission && permission.read ? (
            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 200}}
                data={[1]}
                renderItem={() => {
                  return (
                    <MaterialItems
                      permission={permission}
                      groupStocks={groupStocks}
                      activeGroupId={activeGroupId}
                      activity={activity}
                      setActivity={setActivity}
                      viewRef={viewRef}
                    />
                  );
                }}
              />
            </View>
          ) : (
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text>Don&apos;t have permission to view Materials.</Text>
            </View>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text>Material list is empty.</Text>
        </View>
      )}
    </View>
  );
};

export default StockGroups;
