import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../../../styles/styles';
import Colors from '../../../styles/Colors';
import {Checkbox} from 'react-native-paper';
import {roles} from './utils.js';
import {GoBack} from '../../../components/HeaderButtons.js';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const UserPermissions = ({route}) => {
  const {project_id, user_id} = route.params;
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);
  const [done, setDone] = useState(false);
  const [rowtables, setRowTables] = useState([]);
  const [tables, setTables] = useState([]);
  const [reRender, setRender] = useState(1);
  const [state, setState] = useState({
    user_roles: [0],
  });
  const project = useSelector(
    state => state.project.projects.asObject[project_id],
  );
  const projectRoles = project.role;
  const isAdmin = (projectRoles && projectRoles.includes('admin')) || false;
  const [userTablePermissions, setUserTablePermissions] = useState(null);

  useEffect(() => {
    axiosInstance(token)
      .get('/pem/getAllTableNames')
      .then(({data}) => {
        setRowTables(data.data);
      });
    axiosInstance(token)
      .get(`/pem/${project_id}/${user_id}/getAllUserTablePermissions`)
      .then(({data}) => {
        setUserTablePermissions(data.data);
      });
    axiosInstance(token)
      .get(`/pem/${project_id}/${user_id}/getAllUserRolesForProject`)
      .then(({data}) => {
        setState({
          user_roles: JSON.parse(data.data[0].role),
        });
      });
  }, []);

  useEffect(() => {
    if (rowtables && rowtables.length > 0 && userTablePermissions && !done) {
      const __tables = {};
      userTablePermissions.forEach(x => {
        __tables[x.table_id] = x && JSON.parse(x.permission);
      });
      const x = rowtables.map(table => {
        const xxx = __tables[table.value];
        if (xxx) {
          table.permission = {
            read: false,
            write: false,
            update: false,
            delete: false,
            verify: false,
            ...xxx,
          };
          return table;
        } else {
          table.permission = {
            read: false,
            write: false,
            update: false,
            delete: false,
            verify: false,
          };
          return table;
        }
      });
      setTables(x);
      setDone(true);
    }
  }, [rowtables, userTablePermissions]);

  const updatePermissions = (table_id, pem) => {
    axiosInstance(token)
      .post('/pem/updateOrInsertUserPermission', {
        project_id,
        user_id,
        table_id,
        permission: JSON.stringify(pem),
      })
      .then(({data}) => {
        setUserTablePermissions(data.data);
      });
  };

  const addUserRole = __role => {
    axiosInstance(token)
      .post('/addRoleToUserForProject', {
        project_id,
        user_id,
        role: JSON.stringify(__role),
      })
      .then(({data}) => {
        setState({
          ...state,
          user_roles: __role,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'User role changed succesfully.',
        });
        setUserTablePermissions(data.data);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: err?.response?.data?.message,
        });
        console.log(
          err,
          '/addRoleToUserForProject',
          err?.response?.data?.message,
        );
      });
  };

  const handleAddUserRole = role => {
    if (state.user_roles && state.user_roles.includes(role.key)) {
      const fil = state.user_roles.filter(y => y !== role.key);
      addUserRole(fil);
    } else {
      if (!state.user_roles) {
        addUserRole([role.key]);
      } else {
        addUserRole([...state.user_roles, role.key]);
      }
    }
  };
  return (
    <View style={[styles.container, {backgroundColor: 'white'}]}>
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
            User Permissions
          </Text>
        </View>
      </View>
      {isAdmin ? (
        <View>
          <Text style={userStyle.heading}>Roles</Text>
          {roles && (
            <View style={{marginBottom: 10}}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={
                  (state.user_roles && state.user_roles.length === 0) ||
                  state.user_roles === null
                    ? [{type: 'guest'}, ...roles]
                    : roles
                }
                renderItem={({item: role}) => {
                  if (role.type === 'guest') {
                    return (
                      <View
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          backgroundColor: Colors.primary,
                          borderRadius: 8,
                          marginRight: 10,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                          }}>
                          Guest
                        </Text>
                      </View>
                    );
                  }
                  return (
                    <TouchableOpacity
                      key={role.kv_id}
                      onPress={() => handleAddUserRole(role)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor:
                          state.user_roles &&
                          state.user_roles.includes(role.key)
                            ? Colors.primary
                            : '#f2f2f2',
                        borderRadius: 8,
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color:
                            state.user_roles &&
                            state.user_roles.includes(role.key)
                              ? 'white'
                              : 'black',
                        }}>
                        {role.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
          <Text style={[userStyle.heading, {marginTop: 10}]}>
            Table Permissions
          </Text>
          <View style={styles.horizontalBar} />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            <Text style={{width: Dimensions.get('window').width * 0.27}}>
              Name
            </Text>
            <Text
              style={{
                width: Dimensions.get('window').width * 0.14,
                textAlign: 'center',
              }}>
              Read
            </Text>
            <Text
              style={{
                width: Dimensions.get('window').width * 0.14,
                textAlign: 'center',
              }}>
              Write
            </Text>
            <Text
              style={{
                width: Dimensions.get('window').width * 0.14,
                textAlign: 'center',
              }}>
              Update
            </Text>
            <Text
              style={{
                width: Dimensions.get('window').width * 0.14,
                textAlign: 'center',
              }}>
              Delete
            </Text>
            <Text
              style={{
                width: Dimensions.get('window').width * 0.14,
                textAlign: 'center',
              }}>
              Verify
            </Text>
          </View>
          <View style={{marginBottom: 210}}>
            {reRender && (
              <FlatList
                data={tables}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 210,
                }}
                renderItem={({item: table, index: tableidx}) => {
                  return (
                    <View key={tableidx}>
                      <View
                        style={{
                          flexDirection: 'row',
                          borderTopWidth: 1,
                          borderTopColor: '#ccc',
                        }}>
                        <View
                          style={{
                            width: Dimensions.get('window').width * 0.27,
                            alignItems: 'center',
                            flexDirection: 'row',
                          }}>
                          <Text>{table.name}</Text>
                        </View>
                        {['read', 'write', 'update', 'delete', 'verify'].map(
                          (i, x) => {
                            const checked = table.permission[i];
                            return (
                              <View
                                key={`${table.kv_id}${x}`}
                                style={{
                                  width: Dimensions.get('window').width * 0.139,
                                  justifyContent: 'center',
                                  flexDirection: 'row',
                                }}>
                                <View
                                  style={{
                                    borderWidth: Platform.OS === 'ios' ? 2 : 0,
                                    margin: Platform.OS === 'ios' ? 4 : 0,
                                    borderRadius: 4,
                                    borderColor: Colors.primary,
                                  }}>
                                  <Checkbox
                                    color={Colors.primary}
                                    status={checked ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                      if (checked) {
                                        const d = tables;
                                        d[tableidx].permission = {
                                          ...d[tableidx].permission,
                                          [i]: false,
                                        };
                                        setTables(d);
                                        setRender(reRender + 1);
                                        updatePermissions(table.value, {
                                          ...d[tableidx].permission,
                                          [i]: false,
                                        });
                                      } else {
                                        const d = tables;
                                        d[tableidx].permission = {
                                          ...d[tableidx].permission,
                                          [i]: true,
                                        };
                                        setTables(d);
                                        setRender(reRender + 1);
                                        updatePermissions(table.value, {
                                          ...d[tableidx].permission,
                                          [i]: true,
                                        });
                                      }
                                    }}
                                  />
                                </View>
                              </View>
                            );
                          },
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={styles.emptyTabView}>
          <Text>Cannot view user permission.</Text>
        </View>
      )}
    </View>
  );
};

const userStyle = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
});
export default UserPermissions;
