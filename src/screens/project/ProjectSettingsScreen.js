import {useEffect, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import styles from '../../styles/styles';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import {Switch} from 'react-native-paper';
import Colors from '../../styles/Colors';
import {CustomButton} from '../../components/CustomButton';
import {setProjects} from '../../cc-hooks/src/projectSlice';
import {GoBack} from '../../components/HeaderButtons';
import {useNavigation} from '@react-navigation/native';

const names = [
  {id: 1, name: 'Tasks', key: 'tasks'},
  {id: 2, name: 'Materials', key: 'stocks'},
  {id: 3, name: 'Employees', key: 'employees'},
  {id: 4, name: 'Assets', key: 'assets'},
  {id: 5, name: 'Vendors', key: 'vendors'},
  {id: 6, name: 'Roles', key: 'roles'},
  {id: 8, name: 'Reports', key: 'reports'},
  {id: 9, name: 'Issues', key: 'issues'},
  {id: 10, name: 'Expenses', key: 'expenses'},
  {id: 11, name: 'Documents', key: 'documents'},
];

const SettingsScreen = ({route}) => {
  const {project_id} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);
  const project = useSelector(
    state => state.project.projects.asObject[project_id],
  );
  const projectArray = useSelector(state => state.project.projects.asArray);
  const [state, setState] = useState({
    stocks: false,
    tasks: false,
    employees: false,
    assets: false,
    vendors: false,
    roles: false,
    dashboard: false,
    reports: false,
    issues: false,
    expenses: false,
    documents: false,
  });

  useEffect(() => {
    const d = JSON.parse(project.settings);
    setState(d);
  }, []);

  const updateProjectSettings = () => {
    axiosInstance(token)
      .post('/updateProjectSettings', {
        settings: JSON.stringify(state),
        project_id,
      })
      .then(() => {
        Alert.alert('Success', 'Succesfully changed settings.');
        const oldProject = JSON.parse(JSON.stringify(projectArray));
        const index = oldProject.findIndex(
          item => item.project_id === project_id,
        );
        oldProject[index].settings = JSON.stringify(state);
        dispatch(setProjects(oldProject));
      })
      .catch(err => {
        Alert.alert('Failed', 'Some error occured.');
        console.error(err);
      });
  };

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
            Settings
          </Text>
        </View>
      </View>
      {names.map(name => {
        return (
          <View
            key={name.id}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: '#ccc',
            }}>
            <View style={{}}>
              <Text>{name.name}</Text>
            </View>
            <View>
              <Switch
                color={Colors.primary}
                value={state[name.key] ? true : false}
                onValueChange={() =>
                  setState({
                    ...state,
                    [name.key]: !state[name.key],
                  })
                }
              />
            </View>
          </View>
        );
      })}
      <CustomButton
        buttonStyle={{
          backgroundColor: Colors.primary,
          borderRadius: 12,
          marginTop: 'auto',
          marginBottom: 10,
          marginHorizontal: 6,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
        }}
        onClick={updateProjectSettings}>
        <Text style={{color: 'white', fontSize: 16}}>Save Changes</Text>
      </CustomButton>
    </View>
  );
};

export default SettingsScreen;
