import {View, Text, FlatList} from 'react-native';
import styles from '../../../styles/styles';
import {useDispatch, useSelector} from 'react-redux';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FloatingButton from '../../../components/FloatingButton';
import {removeProjectUsers} from '../../../cc-hooks/src/projectSlice';
import SizeButton from '../../../components/SizeButton';
import {useNavigation} from '@react-navigation/native';
import {GoBack} from '../../../components/HeaderButtons';
import Toast from 'react-native-toast-message';
import Colors from '../../../styles/Colors';
import {CustomButton} from '../../../components/CustomButton';

const Employes = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {project_id} = route.params;
  const token = useSelector(state => state.auth.token);
  const authUser = useSelector(state => state.auth.user);
  const userOrg = useSelector(state => state.auth.org);

  const project_users = useSelector(state => state.project.users.asArray);
  const project = useSelector(
    state => state.project.projects.asObject[project_id],
  );
  // const projectRoles = project.role;
  // const isAdmin = (projectRoles && projectRoles.includes('admin')) || false;

  // const navigation = useNavigation();
  // const projectsAsObject = useSelector(
  //   state => state.project.projects.asObject,
  // );
  // const project =
  //   (projectsAsObject && projectsAsObject[route.params.project_id]) || null;

  // if (!project) return null;
  // if (project && project.settings && !project.settings[1028])
  //   return (
  //     <View style={{}}>
  //       <View style={{marginTop: 34}} />
  //       <View
  //         style={{
  //           marginBottom: 10,
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //         }}>
  //         <GoBack onClick={() => navigation.goBack()} />
  //         <View>
  //           <Text
  //             style={{
  //               fontSize: 20,
  //               fontWeight: '500',
  //               color: '#3e3e3e',
  //             }}>
  //             Employees
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={styles.emptyTabView}>
  //         <Text style={{margin: 10}}>Module disabled</Text>
  //       </View>
  //     </View>
  //   );

  const removeUserFromProject = user => {
    axiosInstance(token)
      .post('/removeUserFromProject', {
        user_id: parseInt(user.user_id, 10),
        project_id: parseInt(project_id, 10),
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'User removed from project succesfully.',
        });
        dispatch(removeProjectUsers({user}));
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to remove user.',
        });
        console.log(err, 'removeUserFromProject', err?.response?.data?.message);
      });
  };
  console.log('project_users');
  return (
    <>
      <View style={styles.container}>
        <View style={{marginTop: 34}} />
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -6,
          }}>
          <GoBack onClick={() => navigation.goBack()} />
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: '#3e3e3e',
              }}>
              Employes
            </Text>
          </View>
        </View>

        <View>
          {project_users && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={project_users}
              renderItem={({item}) => {
                // if (item === null) return null;
                // return <Text>{JSON.stringify(item)}Hello</Text>;
                return (
                  <SizeButton
                    onClick={() => {
                      navigation.navigate('UserPermission', {
                        project_id,
                        user_id: item.user_id,
                      });
                    }}>
                    <View style={styles.card}>
                      <View style={styles.assIcon}>
                        <MaterialIcons name="person" size={24} color="white" />
                      </View>
                      <View style={{marginLeft: 10}}>
                        <Text style={{fontSize: 14, fontWeight: 600}}>
                          {item?.fname} {item?.lname}
                        </Text>
                        <Text style={{fontSize: 13}}>{item?.phone}</Text>
                      </View>
                      <View style={{marginLeft: 'auto'}}>
                        {authUser?.user_id !== item?.user_id &&
                          project?.user_id !== item?.user_id && (
                            <CustomButton
                              buttonStyle={{
                                backgroundColor: '#f2f2f2',
                                borderRadius: 8,
                                padding: 6,
                              }}
                              onClick={() => {
                                removeUserFromProject(item);
                              }}>
                              <MaterialIcons
                                name="person-remove"
                                size={22}
                                color={Colors.primary}
                              />
                            </CustomButton>
                          )}
                      </View>
                    </View>
                  </SizeButton>
                );
              }}
            />
          )}
        </View>
      </View>

      {userOrg.user_id === authUser.user_id && (
        <FloatingButton
          buttonStyle={{margin: 10}}
          onClick={() => {
            navigation.navigate('AddEmploye', {project_id});
          }}>
          <FontAwesome6 name="user-plus" color={'white'} size={22} />
        </FloatingButton>
      )}
    </>
  );
};

export default Employes;
