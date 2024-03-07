/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {
  View,
  Text,
  // TouchableOpacity
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from '../../../styles/styles';
import TaskCategories from './TaskCategories';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {GroupTaskCategories, createBinaryTree, getGroupTasks} from './utils';
import {setGroupTasks} from '../../../cc-hooks/src/taskSlice';
import {GoBack} from '../../../components/HeaderButtons';
import {useNavigation} from '@react-navigation/native';

const TaskScreen = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {project_id} = route.params;
  const token = useSelector(state => state.auth.token, shallowEqual);
  const [reRender, setRender] = useState(0);
  const [links, setLinks] = useState([]);
  const [taskCategoriesGroup, setTaskCategoriesGroup] = useState(null);
  const [binaryTreeTask, setBinaryTreeTask] = useState([]);
  const [linkName, setLinkName] = useState({});
  const [activeGroupId, setActiveGroupId] = useState('main');
  const [__tasks, __setTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getTaskCategories?project_id=${project_id}`)
      .then(({data}) => {
        console.log('getTaskCategories');
        const {task_categories, tasks} = data.data;
        const {task_categories_group, all_task_groups} =
          GroupTaskCategories(task_categories);
        const d = getGroupTasks(tasks);
        const b = createBinaryTree(task_categories);
        setBinaryTreeTask(b);
        setTaskCategoriesGroup(task_categories_group);
        __setTasks(d);
        dispatch(setGroupTasks({project_id, data: d}));
        setLinkName(all_task_groups);
        setLoading(false);
      })
      .catch(err => {
        console.error(JSON.stringify(err));
      });
  }, [reRender]);

  const hadleGoBack = () => {
    const __links = links;
    if (__links.length === 0) {
      return;
    } else if (__links.length === 1) {
      setLinks([]);
      setActiveGroupId('main');
    } else {
      const aid = __links[__links.length - 2];
      __links.pop();
      setActiveGroupId(aid);
      setLinks(__links);
    }
  };

  const handleClickLink = (link, index) => {
    if (index < 0 || index >= link.length) {
      console.error('Invalid index');
      return;
    }
    links.splice(index + 1);
    setActiveGroupId(link);
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 34}} />
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: -10,
        }}>
        {links.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              hadleGoBack();
            }}
            style={{padding: 10, marginLeft: 6}}>
            <MaterialIcons
              name="arrow-back-ios"
              style={{marginRight: 6}}
              size={24}
            />
          </TouchableOpacity>
        ) : (
          <GoBack onClick={() => navigation.goBack()} />
        )}
        {links.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              maxWidth: '74%',
              overflow: 'hidden',
              justifyContent: 'flex-end',
            }}>
            {links.map((link, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => handleClickLink(link, index)}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#666',
                      }}>
                      {linkName[link].name}
                    </Text>
                  </TouchableOpacity>
                  {index !== links.length - 1 && (
                    <Text style={{fontSize: 16, color: 'grey'}}> / </Text>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: '#3e3e3e',
              }}>
              Task Categories
            </Text>
          </View>
        )}
      </View>

      <TaskCategories
        token={token}
        reRender={reRender}
        loading={loading}
        setRender={setRender}
        hadleGoBack={hadleGoBack}
        project_id={project_id}
        taskCategoriesGroup={taskCategoriesGroup}
        binaryTreeTask={binaryTreeTask}
        activeGroupId={activeGroupId}
        __tasks={__tasks}
        setActiveGroupId={setActiveGroupId}
        setLinks={setLinks}
      />
    </View>
  );
};

export default TaskScreen;
