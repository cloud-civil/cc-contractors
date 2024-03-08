import {useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getPermissions} from '../../../../utils';
import {TaskDoneUpdateModal} from '../TaskDoneUpdateModal';
import {shallowEqual, useSelector} from 'react-redux';
import CreateTaskModal from './CreateTaskModal';
import FloatingButton from '../../../../components/FloatingButton';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import EditTaskModal from './EditTaskModal';
import TaskCard from '../cards/TaskCard';
import Colors from '../../../../styles/Colors';
import styles from '../../../../styles/styles';

const OnlyTaskComponent = ({tasks, project_id, setRender, loading}) => {
  const navigation = useNavigation();

  const token = useSelector(state => state.auth.token, shallowEqual);
  const user = useSelector(state => state.auth.user, shallowEqual);
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
      'Are you sure you want to delete Task.',
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
                setRender(prev => prev + 1);
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
    <View style={{height: '88%'}}>
      {!loading ? (
        <View style={{}}>
          {tasks ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 70}}
              data={tasks}
              renderItem={({item}) => {
                return (
                  <TaskCard
                    setActivity={setActivity}
                    item={item}
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
              <Text>There is no tasks.</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}
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
          activity={activity}
          setActivity={setActivity}
          setRender={setRender}
        />
      )}
      {activity.activeTask && activity.showEditTaskModal && (
        <EditTaskModal
          project_id={project_id}
          activity={activity}
          setActivity={setActivity}
          setRender={setRender}
        />
      )}
      {activity.showCreateTaskModal && (
        <CreateTaskModal
          project_id={project_id}
          activity={activity}
          setActivity={setActivity}
          setRender={setRender}
        />
      )}
    </View>
  );
};
export default OnlyTaskComponent;
