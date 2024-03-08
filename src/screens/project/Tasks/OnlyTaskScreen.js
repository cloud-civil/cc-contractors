import {useEffect, useState} from 'react';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {
  View,
  Text,
  // TouchableOpacity
} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {GoBack} from '../../../components/HeaderButtons';
import {useNavigation} from '@react-navigation/native';
import OnlyTaskComponent from './onlyTasks/OnlyTaskComponent';

const OnlyTaskScreen = ({route}) => {
  const navigation = useNavigation();
  const {project_id} = route.params;
  const token = useSelector(state => state.auth.token, shallowEqual);
  const [reRender, setRender] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axiosInstance(token)
      .get(`/getTaskCategories?project_id=${project_id}`)
      .then(({data}) => {
        const {tasks} = data.data;
        setTasks(tasks);
        setLoading(false);
      })
      .catch(err => {
        console.error(JSON.stringify(err));
      });
  }, [reRender]);

  return (
    <View style={{paddingHorizontal: 10, backgroundColor: 'white'}}>
      <View style={{marginTop: 44}} />
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
            Tasks
          </Text>
        </View>
      </View>

      <OnlyTaskComponent
        project_id={project_id}
        tasks={tasks}
        setRender={setRender}
        loading={loading}
      />
    </View>
  );
};

export default OnlyTaskScreen;
