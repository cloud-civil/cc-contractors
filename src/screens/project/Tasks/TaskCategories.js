import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {
  View,
  Text,
  // TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import styles from '../../../styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {shallowEqual, useSelector} from 'react-redux';
import SizeButton from '../../../components/SizeButton';
import FloatingButton from '../../../components/FloatingButton';
import Colors from '../../../styles/Colors';
import {getPermissions} from '../../../utils';
import Toast from 'react-native-toast-message';
import {CreateTaskCategoryModal} from './CreateTaskCategoryModal';

const TaskCategories = ({
  token,
  loading,
  project_id,
  reRender,
  setRender,
  taskCategoriesGroup,
  binaryTreeTask,
  activeGroupId,
  setActiveGroupId,
  setLinks,
  __tasks,
  hadleGoBack,
}) => {
  const navigation = useNavigation();
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1018);
  const permission = x && JSON.parse(x.permission);
  const taskStocks = useSelector(state => state.task.taskStocks, shallowEqual);
  const stocks__ = useSelector(
    state => state.stock.stocks[project_id],
    shallowEqual,
  );
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const stocks = (stocks__ && stocks__.asObject) || [];
  const [listView, setListView] = useState(true);

  const canDeleteCategory =
    __tasks &&
    taskCategoriesGroup &&
    taskCategoriesGroup[activeGroupId] &&
    taskCategoriesGroup[activeGroupId].length === 0 &&
    !__tasks[activeGroupId];

  const deleteCategory = () => {
    axiosInstance(token)
      .post(`/${activeGroupId}/deleteTaskCategory`)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Deleted task category successfully',
        });
        setRender(reRender + 1);
        hadleGoBack();
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Success',
          text2: 'Failed to delete task category',
        });
      });
  };

  const handleDeleteStockGroup = () => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this category.',
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

  const recursiveGroup = data => {
    return data.map(_group => {
      return (
        <View
          key={_group.group_id}
          style={{
            paddingLeft: 10,
            marginTop: 3,
            fontSize: 15,
          }}>
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: '#999',
              borderBottomWidth: 1,
              borderBottomColor: '#999',
              marginTop: 8,
            }}>
            <Text
              style={{
                top: 9,
                left: 10,
                paddingLeft: 2,
                backgroundColor: '#f2f2f2',
                color:
                  _group.group_id === activeGroupId ? Colors.primary : 'black',
              }}>
              {_group.name}
            </Text>
          </View>
          {_group.children.length > 0 ? (
            <View style={{marginLeft: 10}}>
              {recursiveGroup(_group.children)}
            </View>
          ) : null}
        </View>
      );
    });
  };

  return (
    <>
      {!loading ? (
        <View
          style={{
            height: '90%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setListView(false)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: !listView ? 'white' : '#f2f2f2',
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  marginRight: 8,
                }}>
                <Text>All</Text>
                <MaterialCommunityIcons
                  name="source-branch"
                  style={{marginLeft: 5}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setListView(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: listView ? 'white' : '#f2f2f2',
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                }}>
                <Text>List</Text>
                <MaterialIcons name="list" size={14} style={{marginLeft: 5}} />
              </TouchableOpacity>
            </View>
            {canDeleteCategory && activeGroupId !== 'main' ? (
              <TouchableOpacity
                onPress={() => {
                  handleDeleteStockGroup();
                }}>
                <MaterialIcons name="delete-outline" size={24} color="red" />
              </TouchableOpacity>
            ) : null}
          </View>
          {taskCategoriesGroup && permission && permission.read && listView && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={taskCategoriesGroup[activeGroupId]}
              renderItem={({item}) => (
                <SizeButton
                  handleLongPress={() =>
                    navigation.navigate('TaskAndStock', {
                      __tasks: __tasks,
                      activeGroupId: item.group_id,
                      task_stocks: taskStocks,
                      stocks: stocks,
                      reRender: reRender,
                      activeGroup: item.name,
                    })
                  }
                  onClick={() => {
                    setActiveGroupId(item.group_id);
                    setLinks(prevState => [...prevState, item.group_id]);
                  }}
                  key={item.group_id}
                  buttonStyle={{
                    marginBottom:
                      taskCategoriesGroup[item.group_id].length > 0 ? 14 : 4,
                  }}>
                  {taskCategoriesGroup &&
                    taskCategoriesGroup[item.group_id] &&
                    taskCategoriesGroup[item.group_id].length > 0 && (
                      <View
                        style={[
                          styles.card,
                          {
                            height: 50,
                            width: '94%',
                            justifyContent: 'center',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            zIndex: -10,
                            marginBottom: -66,
                            marginTop: 14,
                          },
                        ]}
                      />
                    )}
                  <View style={styles.card}>
                    <View style={styles.assIcon}>
                      <MaterialIcons name="task-alt" size={28} color="white" />
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1,
                      }}>
                      <View
                        style={{
                          fontWeight: 600,
                          fontSize: 18,
                          marginBlock: 6,
                        }}>
                        <Text>{item.name}</Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        {__tasks &&
                          __tasks[item.group_id] &&
                          __tasks[item.group_id].length > 0 && (
                            <View
                              style={{
                                marginRight: 10,
                                width: 20,
                                height: 20,
                                backgroundColor: '#4da6ff',
                                color: 'white',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 20,
                                fontSize: 14,
                              }}>
                              <Text style={{color: 'white'}}>
                                {__tasks[item.group_id] &&
                                  __tasks[item.group_id].length}
                              </Text>
                            </View>
                          )}
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('TaskAndStock', {
                              __tasks: __tasks,
                              activeGroupId: item.group_id,
                              task_stocks: taskStocks,
                              reRender: reRender,
                              activeGroup: item.name,
                            });
                          }}>
                          <View
                            style={{
                              height: 40,
                              width: 40,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <FontAwesome6
                              name="list"
                              size={20}
                              color={Colors.primary}
                            />
                          </View>
                        </TouchableOpacity>
                        {/* <CustomButton
                          
                          
                          buttonStyle={{
                            backgroundColor: Colors.primary,
                            borderRadius: 4,
                            marginBottom: 4,
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                          }}
                          buttonStyle={{
                          }}
                          onClick={() => {
                            navigation.navigate('TaskAndStock', {
                              __tasks: __tasks,
                              activeGroupId: item.group_id,
                              task_stocks: task_stocks,
                              reRender: reRender,
                              activeGroup: item.name,
                            });
                          }}>
                          <Text style={{color: 'white'}}>Tasks</Text>
                        </CustomButton> */}
                      </View>
                    </View>
                  </View>
                </SizeButton>
              )}
            />
          )}

          {taskCategoriesGroup && permission && permission.read && !listView && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{flex: 1}}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}>
                {recursiveGroup(binaryTreeTask || [])}
              </ScrollView>
            </ScrollView>
          )}

          {taskCategoriesGroup && (!permission || !permission.read) && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Don&apos;t have permission to view Task Categories.</Text>
            </View>
          )}

          {taskCategoriesGroup &&
          taskCategoriesGroup[activeGroupId].length === 0 &&
          permission &&
          permission.read &&
          listView ? (
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: '66%',
              }}>
              <Text>No categories</Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator
            loading={loading}
            size={'large'}
            color={Colors.primary}
          />
        </View>
      )}

      {permission && permission.write && listView && (
        <FloatingButton
          buttonStyle={{margin: 10}}
          onClick={() => {
            setShowCategoryModal(true);
          }}>
          <MaterialIcons
            name="format-list-bulleted-add"
            color={'white'}
            size={28}
          />
        </FloatingButton>
      )}

      {showCategoryModal && (
        <CreateTaskCategoryModal
          token={token}
          project_id={project_id}
          activeGroupId={activeGroupId}
          reRender={reRender}
          setRender={setRender}
          showCategoryModal={showCategoryModal}
          setShowCategoryModal={setShowCategoryModal}
        />
      )}
    </>
  );
};

export default TaskCategories;
