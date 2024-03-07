/* eslint-disable no-undef */
import {ActivityIndicator, Dimensions, FlatList, View} from 'react-native';
import {Text} from 'react-native';
import {GoBack} from '../../components/HeaderButtons';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/styles';
import {useEffect, useState} from 'react';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import Colors from '../../styles/Colors';
import {CustomButton} from '../../components/CustomButton';
import Toast from 'react-native-toast-message';

const UserDetails = ({route}) => {
  const {activeUser} = route.params;
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);
  const userOrg = useSelector(state => state.auth.org);

  const [userProjects, setUserProjects] = useState([]);
  const [orgProjects, setOrgProjects] = useState([]);
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axiosInstance(token).get(`/${userOrg.org_id}/getAllProjectsByOrg`),
      axiosInstance(token).get(
        `/${userOrg.org_id}/${activeUser.user_id}/getProjectsOfUser`,
      ),
    ])
      .then(([response1, response2]) => {
        setOrgProjects(response1?.value?.data?.data);
        setUserProjects(response2?.value?.data?.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error, 'Error HomeScreen:', error?.response?.data?.message);
      });
  }, []);

  const userProjectsAsObject = {};
  userProjects.forEach(p => {
    userProjectsAsObject[p.project_id] = p;
  });

  const addUserToProject = project => {
    axiosInstance(token)
      .post('/addUserToProject', {
        user_id: activeUser.user_id,
        project_id: project.project_id,
      })
      .then(() => {
        setUserProjects([...userProjects, project]);
        Toast.show({
          type: 'success',
          text1: 'Added',
          text2: 'User added to project succesfully.',
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not add user.',
        });
        console.log(
          err,
          '/removeUserToOrganization',
          err?.response?.data?.message,
        );
      });
  };

  const removeUserFromProject = project => {
    axiosInstance(token)
      .post('/removeUserFromProject', {
        user_id: parseInt(activeUser.user_id, 10),
        project_id: parseInt(project.project_id, 10),
      })
      .then(() => {
        setUserProjects(
          userProjects.filter(x => x.project_id !== project.project_id),
        );
        Toast.show({
          type: 'success',
          text1: 'Removed',
          text2: 'User removed from project succesfully.',
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not remove user.',
        });
        console.log(
          err,
          '/removeUserToOrganization',
          err?.response?.data?.message,
        );
      });
  };

  return (
    <>
      <View style={{height: 40}} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            User Information
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={{marginBottom: 10, fontWeight: 600}}>
          {activeUser.fname} {activeUser.lname}
        </Text>
        <View style={styles.horizontalBar} />
        {!loading ? (
          <FlatList
            data={['']}
            showsVerticalScrollIndicator={false}
            renderItem={() => {
              return (
                <>
                  {userProjects.length ? (
                    <UserProjects
                      userProjects={userProjects}
                      screenWidth={screenWidth}
                      removeUserFromProject={removeUserFromProject}
                    />
                  ) : null}
                  {orgProjects.length ? (
                    <OrgProjects
                      orgProjects={orgProjects}
                      screenWidth={screenWidth}
                      userProjectsAsObject={userProjectsAsObject}
                      addUserToProject={addUserToProject}
                    />
                  ) : null}
                </>
              );
            }}
          />
        ) : (
          <View style={styles.emptyTabView}>
            <ActivityIndicator size={30} color={Colors.primary} />
          </View>
        )}
      </View>
    </>
  );
};

const UserProjects = ({userProjects, screenWidth, removeUserFromProject}) => {
  return (
    <View style={{marginTop: 10}}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginTop: 10,
          marginBottom: 20,
        }}>
        User Projects
      </Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={userProjects}
        renderItem={({item, index}) => (
          <View key={index} style={[styles.card]}>
            <View style={styles.assIcon}>
              <MaterialIcons name="person" color={Colors.textColor} size={28} />
            </View>
            <View style={{marginLeft: 10, width: screenWidth * 0.5}}>
              <Text numberOfLines={1} style={styles.cardContentHeader}>
                {item.name}
              </Text>
            </View>
            <View style={{marginLeft: 'auto'}}>
              <CustomButton
                buttonStyle={{
                  backgroundColor: '#f2f2f2',
                  borderRadius: 8,
                  padding: 6,
                }}
                onClick={() => removeUserFromProject(item)}>
                <MaterialIcons
                  name="delete-outline"
                  size={22}
                  color={Colors.primary}
                />
              </CustomButton>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const OrgProjects = ({
  orgProjects,
  screenWidth,
  userProjectsAsObject,
  addUserToProject,
}) => {
  return (
    <View style={{}}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginTop: 10,
          marginBottom: 20,
        }}>
        Organization Projects
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={orgProjects}
        renderItem={({item, index}) => (
          <View key={index} style={[styles.card]}>
            <View style={styles.assIcon}>
              <MaterialIcons name="person" color={Colors.textColor} size={28} />
            </View>
            <View style={{marginLeft: 10, width: screenWidth * 0.5}}>
              <Text numberOfLines={1} style={styles.cardContentHeader}>
                {item.name}
              </Text>
            </View>
            {!userProjectsAsObject[item.project_id] && (
              <View style={{marginLeft: 'auto'}}>
                <CustomButton
                  buttonStyle={{
                    backgroundColor: '#f2f2f2',
                    borderRadius: 8,
                    padding: 6,
                  }}
                  onClick={() => addUserToProject(item)}>
                  <MaterialIcons
                    name="my-library-add"
                    size={22}
                    color={Colors.primary}
                  />
                </CustomButton>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default UserDetails;
