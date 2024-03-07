import {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  // TouchableOpacity,
  Dimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import styles from '../../../styles/styles';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {projectScreens} from '../utils';
import {GoBack} from '../../../components/HeaderButtons';
import LinearProgressBar from '../../../components/LinearProgressBar';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {setTasks} from '../../../cc-hooks/src/taskSlice';
import TaskProgress from './task-progress/TaskProgress';

const ProjectHome = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {project_id} = route.params;
  const token = useSelector(state => state.auth.token);
  const project = useSelector(
    state => state.project.projects.asObject[project_id],
  );
  // const settings = (project && project.settings) || null;
  // console.log('settings', settings);
  const tasks = useSelector(state => state.task.tasks);
  const metadata = project.metadata;
  const progress__ = metadata
    ? (metadata.completed / metadata.target) * 100
    : 0;
  const progress = progress__ > 100 ? 100 : progress__ < 100 ? 0 : progress__;

  useEffect(() => {
    if (tasks && !tasks[project_id]) {
      axiosInstance(token)
        .get(`/${project_id}/getTasksByProjectId`)
        .then(({data}) => {
          dispatch(setTasks({project_id, data: data.data}));
        })
        .catch(err => console.error(err));
    }
  }, [dispatch, project_id, tasks, token]);

  return (
    <View style={[styles.container, {backgroundColor: 'white'}]}>
      <View style={{marginTop: 34}} />
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: -10,
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            Projects
          </Text>
        </View>
      </View>
      <View style={customStyle.headerContainer}>
        <View>
          <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 10}}>
            {project.name}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons name="location-pin" size={16} color={'#555'} />
            <Text style={{fontSize: 14, marginLeft: 3}}>{project.address}</Text>
          </View>
        </View>
      </View>
      <View style={{margin: 10, flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{marginRight: 10, fontSize: 12, maxWidth: 34}}>
          {progress && progress > 100
            ? 100
            : progress && progress < 100 && progress > 0
            ? progress.toFixed(0)
            : 0}{' '}
          %
        </Text>
        <LinearProgressBar
          progress={
            progress && progress > 100
              ? 100
              : progress && progress < 100
              ? progress
              : 0
          }
          width={Dimensions.get('window').width - 80}
          height={4}
          color={
            progress && progress >= 60
              ? '#03DB03'
              : progress && progress < 60 && progress > 30
              ? '#E8BB05'
              : progress && progress > 0 && progress <= 30
              ? 'red'
              : '#f2f2f2'
          }
          backgroundColor="#f2f2f2"
        />
      </View>
      <View style={{margin: 10}}>
        <FlatList
          data={projectScreens}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            // if (settings && !settings[item.table_id]) {
            //   return null;
            // }
            // if (settings && !settings[item.table_id]) {
            //   return null;
            // }
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate(item.value)}
                key={item.id}>
                <View style={customStyle.navButton}>
                  {item.icon}
                  <Text style={{marginLeft: 8, textTransform: 'capitalize'}}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={{marginTop: 20}}>
        <TaskProgress project_id={project_id} />
      </View>
    </View>
  );
};

const customStyle = StyleSheet.create({
  headerContainer: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f2f2f2',
    marginRight: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProjectHome;
