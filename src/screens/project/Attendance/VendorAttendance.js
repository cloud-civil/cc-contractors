import {FlatList, Text, View} from 'react-native';
import {GoBack} from '../../../components/HeaderButtons';
import styles from '../../../styles/styles';
import {useSelector} from 'react-redux';
import SizeButton from '../../../components/SizeButton';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';

const VendorAttendance = ({route}) => {
  const {project_id} = route.params;
  const navigation = useNavigation();
  const contractors = useSelector(state => state.app.contractors.asArray);
  const projectsAsObject = useSelector(
    state => state.project.projects.asObject,
  );
  const project = (projectsAsObject && projectsAsObject[project_id]) || null;

  if (!project) return null;
  if (project && project.settings && !project.settings[1028])
    return (
      <View style={{}}>
        <View style={{marginTop: 34}} />
        <View
          style={{
            marginBottom: 10,
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
              Contractors Attendance
            </Text>
          </View>
        </View>
        <View style={styles.emptyTabView}>
          <Text style={{margin: 10}}>Module disabled</Text>
        </View>
      </View>
    );

  return (
    <View style={{}}>
      <View style={{marginTop: 44}} />
      <View
        style={{
          marginBottom: 10,
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
            Contractors Attendance
          </Text>
        </View>
      </View>
      <View style={{marginHorizontal: 10}}>
        {contractors.length ? (
          <FlatList
            data={contractors}
            renderItem={({item}) => {
              return (
                <SizeButton
                  onClick={() =>
                    navigation.navigate('giveAttendance', {contractor: item})
                  }
                  key={item.vendor_id}>
                  <View style={styles.card}>
                    <View style={styles.assIcon}>
                      <FontAwesome6
                        name="building-user"
                        size={20}
                        color={'white'}
                      />
                    </View>
                    <View style={{marginLeft: 10}}>
                      <Text style={{fontWeight: '500'}}>{item.name}</Text>
                    </View>
                  </View>
                </SizeButton>
              );
            }}
          />
        ) : (
          <View style={[styles.emptyTabView]}>
            <Text>There is no contractor</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default VendorAttendance;
