import {useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import styles from '../../../styles/styles';
import {useDispatch, useSelector} from 'react-redux';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {addProjectUsers} from '../../../cc-hooks/src/projectSlice';
import {GoBack} from '../../../components/HeaderButtons';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Colors from '../../../styles/Colors';
import {CustomButton} from '../../../components/CustomButton';

const AddEmploye = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {project_id} = route.params;
  const token = useSelector(state => state.auth.token);
  const [userOrgs] = useState(useSelector(state => state.app.users.asArray));
  const project_users_object = useSelector(
    state => state.project.users.asObject,
  );

  const addUserToProject = user => {
    axiosInstance(token)
      .post('/addUserToProject', {user_id: user.user_id, project_id})
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'User added to project succesfully.',
        });
        dispatch(addProjectUsers({user}));
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to add user.',
        });
        console.log(err, 'addUserToProject', err?.response?.data?.message);
      });
  };

  return (
    <>
      <View style={{paddingTop: 44, backgroundColor: 'white'}} />
      <View
        style={{
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
            Add Employes
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        {userOrgs &&
          userOrgs.length !== Object.keys(project_users_object).length && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={userOrgs}
              keyExtractor={item => item.user_id.toString()}
              renderItem={({item}) => {
                if (
                  project_users_object &&
                  project_users_object[item.user_id]
                ) {
                  return null;
                }
                return (
                  <View
                    key={item.user_id}
                    style={[styles.card, {width: '100%'}]}>
                    <View style={styles.assIcon}>
                      <MaterialIcons name="person" size={24} color="white" />
                    </View>
                    <View style={{marginLeft: 15}}>
                      <Text style={{fontSize: 14, fontWeight: 600}}>
                        {item.fname} {item.lname}
                      </Text>
                      <Text style={{fontSize: 13}}>{item.phone}</Text>
                    </View>
                    <View style={{marginLeft: 'auto'}}>
                      <CustomButton
                        buttonStyle={{
                          backgroundColor: '#f2f2f2',
                          borderRadius: 8,
                          padding: 6,
                        }}
                        onClick={() => addUserToProject(item)}>
                        <MaterialIcons
                          name="person-add-alt-1"
                          size={22}
                          color={Colors.primary}
                        />
                      </CustomButton>
                    </View>
                  </View>
                );
              }}
            />
          )}
        {userOrgs.length === Object.keys(project_users_object).length && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              margin: -10,
              backgroundColor: 'white',
            }}>
            <Text>No more users left.</Text>
          </View>
        )}
      </View>
    </>
  );
};

export default AddEmploye;
