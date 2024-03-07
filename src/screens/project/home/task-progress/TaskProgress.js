/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getPermissions} from '../../../../utils';
import Colors from '../../../../styles/Colors';
import styles from '../../../../styles/styles';
import Tabs from '../../../../components/Tabs';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useFocusEffect} from '@react-navigation/native';
import {getGroupTasks} from '../../Tasks/utils';
import {setGroupTasks} from '../../../../cc-hooks/src/taskSlice';
import {TaskDoneUpdateModal} from '../../Tasks/TaskDoneUpdateModal';
import InProgress from './InProgress';
import Completed from './Completed';
import UpComing from './UpComing';
import Delayed from './Delayed';
const tabs = ['In Progress', 'Delayed', 'Up Coming', 'Completed'];

const TaskProgress = props => {
  const {project_id} = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const pems = useSelector(state => state.auth.permissions);
  const x = getPermissions(pems, 1019);
  const permission = x && JSON.parse(x.permission);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [tasks, setTasks] = useState(null);
  const [coundDelayed, setCountDelayed] = useState(null);
  const currentDate = new Date();
  const [activity, setActivity] = useState({
    activeTask: null,
    showUpdateTaskModal: false,
  });
  const [reRender, setRender] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      axiosInstance(token)
        .get(`/${project_id}/getTaskCategories`)
        .then(({data}) => {
          const {tasks: tasks_} = data.data;
          setTasks(tasks_);
          setLoading(false);
          const d = getGroupTasks(tasks_);
          dispatch(setGroupTasks({project_id, data: d}));
        })
        .catch(err => {
          console.error(
            err,
            '/getTaskCategories',
            err?.response?.data?.message,
          );
        });
    }, [reRender]),
  );

  useEffect(() => {
    if (tasks) {
      const count = tasks.filter(
        item =>
          new Date(item.end_date) < currentDate &&
          item.target !== item.completed,
      ).length;
      setCountDelayed(count);
    }
  }, [tasks]);

  return (
    <View>
      <Tabs
        data={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        numOfTab={4}
        minusWidth={20}
        badge={[null, coundDelayed, null, null]}
        badgeColor={'white'}
        badgebackgroundColor={'red'}
      />

      {!loading && tasks ? (
        <>
          {activeTab === 'In Progress' ? (
            <InProgress
              tasks={tasks}
              currentDate={currentDate}
              permission={permission}
              setActivity={setActivity}
              screenWidth={screenWidth}
            />
          ) : null}
          {activeTab === 'Delayed' ? (
            <Delayed
              tasks={tasks}
              currentDate={currentDate}
              permission={permission}
              setActivity={setActivity}
              screenWidth={screenWidth}
            />
          ) : null}
          {activeTab === 'Up Coming' ? (
            <UpComing
              tasks={tasks}
              screenWidth={screenWidth}
              currentDate={currentDate}
            />
          ) : null}
          {activeTab === 'Completed' ? (
            <Completed tasks={tasks} screenWidth={screenWidth} />
          ) : null}
        </>
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator color={Colors.primary} size={30} />
        </View>
      )}

      {activity.activeTask && activity.showUpdateTaskModal && (
        <TaskDoneUpdateModal
          project_id={project_id}
          reRender={reRender}
          setRender={setRender}
          activity={activity}
          setActivity={setActivity}
          activeGroupId={activity.activeTask.parent_id}
        />
      )}
    </View>
  );
};

export default TaskProgress;
