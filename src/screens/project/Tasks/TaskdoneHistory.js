/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {useEffect, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatDate, getPermissions} from '../../../utils';
import styles from '../../../styles/styles';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import FloatingButton from '../../../components/FloatingButton';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {GoBack} from '../../../components/HeaderButtons';
import {TaskDoneUpdateModal} from './TaskDoneUpdateModal';
import QuantityCard from '../../../components/QuantityCard';
import {EditTaskDoneModal} from './onlyTasks/EditTaskDoneModal';
import {CustomButton} from '../../../components/CustomButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import {setGroupTasks} from '../../../cc-hooks/src/taskSlice';
import {useNavigation} from '@react-navigation/native';
import SizeButton from '../../../components/SizeButton';
import Colors from '../../../styles/Colors';

const TaskDoneHistory = ({route}) => {
  const {activeTask, project_id, activeGroupId} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const users = useSelector(state => state.app.users.asObject, shallowEqual);
  const stocks__ = useSelector(
    state => state.stock.stocks[project_id],
    shallowEqual,
  );
  const stocks = (stocks__ && stocks__.asObject) || [];
  const user = useSelector(state => state.auth.user, shallowEqual);
  const contractors = useSelector(
    state => state.app.contractors.asObject,
    shallowEqual,
  );
  const [doneTasks, setDoneTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reRender, setRender] = useState(0);
  const [activeTaskCompleted, setActiveTaskCompleted] = useState(null);
  const [isUpdateModal, setUpdateModal] = useState(false);
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const x = getPermissions(pems, 1019);
  const permission = x && JSON.parse(x.permission);
  const groupTasks = useSelector(state => state.task.groupTasks, shallowEqual);
  const [activity, setActivity] = useState({
    activeTask: null,
    showUpdateTaskModal: false,
    showCreateTaskModal: false,
    showEditTaskModal: false,
  });

  useEffect(() => {
    axiosInstance(token)
      .get(`/${activeTask.task_id}/getCompletedTasksByTaskId`)
      .then(({data}) => {
        setDoneTasks(data.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error(err, err.response.data);
      });
  }, [reRender]);

  const deleteTaskCompleted = item => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete the completed Task.',
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            axiosInstance(token)
              .post('/deleteTaskCompleted', {
                task_id: activeTask.task_id,
                task_done_id: item.task_done_id,
                completed: item.completed,
                project_id,
              })
              .then(() => {
                setRender(prev => prev + 1);
                Toast.show({
                  type: 'success',
                  text1: 'success',
                  text2: 'Completed task has been Deleted succesfully.',
                });
                const newObj = JSON.parse(
                  JSON.stringify(groupTasks[project_id].asObject),
                );
                const index = newObj[activeGroupId].findIndex(
                  x => x.task_id === activeTask.task_id,
                );
                newObj[activeGroupId][index].completed =
                  newObj[activeGroupId][index].completed - item.completed;
                dispatch(setGroupTasks({project_id, data: newObj}));
              })
              .catch(error => {
                console.error(error);
                Toast.show({
                  type: 'success',
                  text1: 'failed',
                  text2: 'Failed to delete the completed task.',
                });
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  const totelDoneTasks =
    doneTasks &&
    doneTasks.reduce((sum, item) => {
      return item.completed + sum;
    }, 0);

  return (
    <>
      <View style={{marginTop: 44}} />
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View style={{width: '85%'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            {activeTask.name}
          </Text>
        </View>
      </View>
      <View style={{margin: 10, marginTop: -4, flex: 1}}>
        <Text style={{fontSize: 14}}>
          Assigned to:{' '}
          <Text>{activeTask.user_id && users[activeTask.user_id]?.fname} </Text>{' '}
          {activeTask.user_id && users[activeTask.user_id]?.lname}
        </Text>

        <View style={{flexDirection: 'row', marginVertical: 10}}>
          <QuantityCard
            headline={'Work Area'}
            quantity={activeTask.target}
            unit={activeTask.unit}
            backgroundColor={'#fff'}
          />
          <QuantityCard
            headline={'Completed'}
            quantity={totelDoneTasks || 0}
            unit={activeTask.unit}
            backgroundColor={'#fff'}
          />
        </View>

        <View style={{marginTop: 10}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              Tasks done history
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <MaterialCommunityIcons
                name="clock-time-three-outline"
                size={16}
                color="#333"
              />
              <Text style={{color: '#333', marginLeft: 4}}>
                {formatDate(activeTask.end_date)}
              </Text>
            </View>
          </View>
          {!loading ? (
            <>
              {doneTasks && doneTasks.length > 0 ? (
                <FlatList
                  contentContainerStyle={{marginTop: 10, paddingBottom: 180}}
                  showsVerticalScrollIndicator={false}
                  data={doneTasks}
                  renderItem={({item}) => (
                    <SizeButton
                      onClick={() =>
                        navigation.navigate('TaskDoneDetails', {
                          data: item,
                          contractor: contractors[item.contractor_id]?.name,
                          unit: activeTask.unit,
                        })
                      }
                      key={item.task_done_id}>
                      <View style={styles.card}>
                        <View style={styles.assIcon}>
                          <MaterialCommunityIcons
                            name="transit-transfer"
                            color="white"
                            size={26}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            marginLeft: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <View>
                            {item.contractor_id && (
                              <View style={{marginBottom: 4}}>
                                <Text>
                                  By{' '}
                                  <Text style={{fontWeight: 'bold'}}>
                                    {contractors[item.contractor_id]?.name}
                                  </Text>
                                </Text>
                              </View>
                            )}
                            <Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {item && item.completed}
                              </Text>{' '}
                              {activeTask.unit} done{' '}
                            </Text>
                            <Text style={{fontSize: 13, marginTop: 2}}>
                              {item && formatDate(item.created_at)}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row'}}>
                            {/* {permission && permission.write && (
                                <CustomButton
                                  buttonStyle={{
                                    backgroundColor: '#f2f2f2',
                                    borderRadius: 8,
                                    marginRight: 8,padding: 6
                                  }}
                                  
                                  
                                  
                                  onClick={() => {
                                    setActiveTaskCompleted(item);
                                    setUpdateModal(true);
                                  }}>
                                  <MaterialIcons
                                    name="update"
                                    size={18}
                                    color={Colors.primary}
                                  />
                                </CustomButton>
                              )} */}
                            {permission && permission.delete && (
                              <CustomButton
                                buttonStyle={{
                                  backgroundColor: '#f2f2f2',
                                  borderRadius: 8,
                                  marginRight: 10,
                                  padding: 6,
                                }}
                                onClick={() => {
                                  deleteTaskCompleted(item);
                                }}>
                                <MaterialIcons
                                  name="delete-outline"
                                  size={20}
                                  color="red"
                                />
                              </CustomButton>
                            )}
                          </View>
                        </View>
                      </View>
                    </SizeButton>
                  )}
                />
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '84%',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'grey',
                    }}>
                    There is no update in task {activeTask.name}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyTabView}>
              <ActivityIndicator loading={loading} color={Colors.primary} />
            </View>
          )}
        </View>
      </View>
      {activity.showUpdateTaskModal && (
        <TaskDoneUpdateModal
          user_id={user.user_id}
          project_id={project_id}
          activeGroupId={activeTask.parent_id}
          activity={{...activity, activeTask}}
          setActivity={setActivity}
          stocks={stocks}
          reRender={reRender}
          setRender={setRender}
        />
      )}
      <EditTaskDoneModal
        user_id={user.user_id}
        project_id={project_id}
        activeTask={activeTask}
        activeTaskCompleted={activeTaskCompleted}
        showModal={isUpdateModal}
        activeGroupId={activeTask.parent_id}
        setShowModal={setUpdateModal}
        stocks={stocks}
        reRender={reRender}
        setRender={setRender}
      />
      <View style={{position: 'fixed', marginBottom: 10, marginRight: 6}}>
        <FloatingButton
          onClick={() => {
            setActivity(prev => ({
              ...prev,
              showUpdateTaskModal: true,
            }));
          }}>
          <MaterialCommunityIcons name="update" color={'white'} size={28} />
        </FloatingButton>
      </View>
    </>
  );
};

export default TaskDoneHistory;
