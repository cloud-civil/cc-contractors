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
import CategoryCard from './cards/CategoryCard';

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

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [listView, setListView] = useState(true);

  const canDeleteCategory =
    __tasks &&
    taskCategoriesGroup &&
    taskCategoriesGroup[activeGroupId] &&
    taskCategoriesGroup[activeGroupId].length === 0 &&
    !__tasks[activeGroupId];

  const deleteCategory = () => {
    axiosInstance(token)
      .post(`/deleteTaskCategory?group_id=${activeGroupId}`)
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
            <ViewButtons setListView={setListView} listView={listView} />
            {canDeleteCategory && activeGroupId !== 'main' ? (
              <TouchableOpacity onPress={handleDeleteStockGroup}>
                <MaterialIcons name="delete-outline" size={24} color="red" />
              </TouchableOpacity>
            ) : null}
          </View>
          {taskCategoriesGroup && permission && permission.read && listView && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={taskCategoriesGroup[activeGroupId]}
              renderItem={({item}) => (
                <CategoryCard
                  taskCategoriesGroup={taskCategoriesGroup}
                  setActiveGroupId={setActiveGroupId}
                  setLinks={setLinks}
                  __tasks={__tasks}
                  item={item}
                  navigation={navigation}
                  reRender={reRender}
                />
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

const ViewButtons = ({setListView, listView}) => {
  return (
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
        <MaterialCommunityIcons name="source-branch" style={{marginLeft: 5}} />
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
  );
};

export default TaskCategories;
