/* eslint-disable radix */
import React, {useState} from 'react';
import {View, Text, Dimensions, FlatList, Alert} from 'react-native';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../../../styles/styles';
import {getPermissions} from '../../../../utils';
import {TaskDoneUpdateModal} from '../TaskDoneUpdateModal';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import CreateTaskModal from './CreateTaskModal';
import FloatingButton from '../../../../components/FloatingButton';
import {deleteTask} from '../../../../cc-hooks/src/taskSlice';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import EditTaskModal from './EditTaskModal';
import {GoBack} from '../../../../components/HeaderButtons';
import TaskCard from '../cards/TaskCard';

const TaskComponent = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {activeGroupId, project_id, activeGroup} = route.params;
  const stocks__ = useSelector(
    state => state.stock.stocks[project_id],
    shallowEqual,
  );
  const stocks = (stocks__ && stocks__.asObject) || [];
  const token = useSelector(state => state.auth.token, shallowEqual);
  const user = useSelector(state => state.auth.user, shallowEqual);
  const groupTasks = useSelector(state => state.task.groupTasks, shallowEqual);
  const tasks =
    groupTasks && groupTasks[project_id] && groupTasks[project_id].asObject;
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1019);
  const permission = x && JSON.parse(x.permission);
  const [activity, setActivity] = useState({
    activeTask: null,
    showUpdateTaskModal: false,
    showCreateTaskModal: false,
    showEditTaskModal: false,
  });

  const handleDeleteTask = task_id => {
    Alert.alert(
      'Delete',
      `Are you sure you want to delete Task ${
        tasks[activeGroupId].find(item => item.task_id === task_id).name
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
          onPress: () => {
            axiosInstance(token)
              .post(`/deleteTask?project_id=${project_id}&task_id=${task_id}`)
              .then(() => {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Task was deleted successfully',
                });
                dispatch(
                  deleteTask({
                    task_id,
                    project_id,
                    parent_id: activeGroupId,
                  }),
                );
              })
              .catch(err => {
                console.error(err, err.response.data);
                Toast.show({
                  type: 'error',
                  text1: 'Failed',
                  text2: 'Failed to delete task',
                });
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <>
      <View style={{paddingTop: 44, backgroundColor: 'white'}} />
      <View
        style={{
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',

          backgroundColor: 'white',
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            {activeGroup}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        {tasks && tasks[activeGroupId] && permission.read ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentbuttonStyle={{paddingBottom: 70}}
            data={tasks[activeGroupId]}
            renderItem={({item}) => {
              const progress = (100 / item.target) * item.completed;
              return (
                <TaskCard
                  setActivity={setActivity}
                  item={item}
                  activeGroupId={activeGroupId}
                  permission={permission}
                  handleDeleteTask={handleDeleteTask}
                  navigation={navigation}
                />
              );
            }}
          />
        ) : !permission || !permission.read ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text>Don&apos;t have permission to view tasks.</Text>
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').height - 200,
            }}>
            <Text>No tasks under {activeGroup}</Text>
          </View>
        )}
      </View>
      {permission && permission.write && (
        <FloatingButton
          buttonStyle={{margin: 10}}
          onClick={() => {
            setActivity(prev => ({
              ...prev,
              showCreateTaskModal: true,
            }));
          }}>
          <MaterialIcons name="add-task" color={'white'} size={28} />
        </FloatingButton>
      )}

      {activity.showUpdateTaskModal && (
        <TaskDoneUpdateModal
          user_id={user.user_id}
          project_id={project_id}
          activeGroupId={activeGroupId}
          activity={activity}
          setActivity={setActivity}
          stocks={stocks}
        />
      )}
      {activity.activeTask && activity.showEditTaskModal && (
        <EditTaskModal
          project_id={project_id}
          activity={activity}
          setActivity={setActivity}
          activeGroupId={activeGroupId}
        />
      )}
      {activity.showCreateTaskModal && (
        <CreateTaskModal
          project_id={project_id}
          activity={activity}
          setActivity={setActivity}
          activeGroupId={activeGroupId}
        />
      )}
    </>
  );
};
export default TaskComponent;
