/* eslint-disable radix */
import React, {useState} from 'react';
import {View, Text, Dimensions, FlatList, Alert} from 'react-native';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import LinearProgressBar from '../../../../components/LinearProgressBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../../../styles/styles';
import {getDateRange, getPermissions} from '../../../../utils';
import Colors from '../../../../styles/Colors';
import SizeButton from '../../../../components/SizeButton';
import {TaskDoneUpdateModal} from '../TaskDoneUpdateModal';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import CreateTaskModal from './CreateTaskModal';
import FloatingButton from '../../../../components/FloatingButton';
import {deleteTask} from '../../../../cc-hooks/src/taskSlice';
import {CustomButton} from '../../../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import EditTaskModal from './EditTaskModal';
import {GoBack} from '../../../../components/HeaderButtons';

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
              .post(`/${project_id}/${task_id}/deleteTask`)
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
                <SizeButton
                  key={item.task_id}
                  onClick={() => {
                    navigation.navigate('TaskDoneHistory', {
                      activeTask: item,
                      activeGroupId,
                    });
                  }}>
                  <View style={styles.card}>
                    <View
                      style={[
                        styles.assIcon,
                        {
                          width: '14%',
                          height: Dimensions.get('window').width * 0.13,
                        },
                      ]}>
                      <MaterialCommunityIcons
                        name="transit-transfer"
                        color="white"
                        size={30}
                      />
                    </View>
                    <View style={{width: '82%', marginLeft: 10}}>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontWeight: 600,
                            width: '60%',
                          }}>
                          {item.name}{' '}
                        </Text>
                        <Text style={{fontSize: 13}}>
                          {getDateRange(item.start_date, item.end_date)}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginVertical: 10,
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{fontSize: 12, marginRight: 6}}>
                          {parseInt(progress) || 0}%
                        </Text>
                        <LinearProgressBar
                          progress={progress || 0}
                          width={Dimensions.get('window').width * 0.65}
                          height={4}
                          color={
                            progress && progress >= 60
                              ? '#03DB03'
                              : progress &&
                                progress < 60 &&
                                progress &&
                                progress > 30
                              ? '#E8BB05'
                              : 'red'
                          }
                          backgroundColor={'#ccc'}
                        />
                      </View>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontWeight: 600,
                            textAlign: 'right',
                            fontSize: 14,
                          }}>
                          Target:{' '}
                          <Text style={{fontWeight: 400}}>
                            {parseInt(item.completed) || 0}/
                            {parseInt(item.target)} {item.unit}
                          </Text>
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          {/* {permission && permission.delete && (
                            <CustomButton
                              buttonStyle={{
                                backgroundColor: '#f2f2f2',
                                borderRadius: 8,
                                marginRight: 10,
                                padding: 6,
                              }}
                              onClick={() => {
                                handleDeleteTask(item.task_id);
                              }}>
                              <MaterialIcons
                                name="delete-outline"
                                size={24}
                                color="red"
                              />
                            </CustomButton>
                          )} */}
                          {/* {permission && permission.update && (
                            <CustomButton
                              buttonStyle={{
                                backgroundColor: '#f2f2f2',
                                borderRadius: 8,
                                marginRight: 10,
                                padding: 6,
                              }}
                              onClick={() => {
                                setActivity(prev => ({
                                  ...prev,
                                  activeTask: item,
                                  showEditTaskModal: true,
                                }));
                              }}>
                              <MaterialCommunityIcons
                                name="pencil"
                                size={24}
                                color={Colors.primary}
                              />
                            </CustomButton>
                          )} */}
                          {permission && permission.write && (
                            <CustomButton
                              buttonStyle={{
                                backgroundColor: '#f2f2f2',
                                borderRadius: 8,
                                padding: 6,
                              }}
                              onClick={() => {
                                setActivity(prev => ({
                                  ...prev,
                                  activeTask: item,
                                  showUpdateTaskModal: true,
                                }));
                              }}>
                              <MaterialIcons
                                name="update"
                                size={22}
                                color={Colors.primary}
                              />
                            </CustomButton>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </SizeButton>
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
