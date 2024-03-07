import {useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
// import {TouchableOpacity} from 'react-native-gesture-handler';

import CustomModal from '../../components/CustomModal';
import {
  setProjectPermissions,
  setProjects,
} from '../../cc-hooks/src/projectSlice';
import {useDispatch, useSelector} from 'react-redux';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {CustomButton} from '../../components/CustomButton';
import styles from '../../styles/styles';
import DateTimePicker from 'react-native-ui-datepicker';
import {formatDate} from '../../utils';
import Colors from '../../styles/Colors';
import Toast from 'react-native-toast-message';
import Input from '../../components/Input';
import {parseProject} from '../../cc-utils/src/home';
import {handlePermissions} from '../../cc-utils/src';

const FormComponent = ({setShowModal}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const projects = useSelector(state => state.project.projects.asArray);
  const userOrg = useSelector(state => state.auth.org);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [start_date, setStartDate] = useState(new Date());
  const [end_date, setEndDate] = useState(new Date());
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const createProject = () => {
    if (!name || !address || !start_date || !end_date) {
      Alert.alert('Fill up', 'Please fill up all of the above fields.');
      return;
    }
    const newProject = {
      name,
      address,
      start_date,
      end_date,
      user_id: userOrg.user_id,
      org_id: userOrg.org_id,
    };
    axiosInstance(token)
      .post('/createProject', newProject)
      .then(({data}) => {
        dispatch(setProjects([...projects, parseProject(data.data)]));
        const pdata = handlePermissions(data.tablePermissionRows);
        dispatch(
          setProjectPermissions({
            project_id: data.data.project_id,
            data: pdata,
          }),
        );
        setShowModal(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Project ${name} created succesfully.`,
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not create project',
        });
        console.error(err, '/createProject', err?.response?.data?.message);
      });
  };

  return (
    <View style={{marginTop: 10}}>
      <View style={{}}>
        <Input value={name} label="Project Name" onChangeText={setName} />
        <Input value={address} label="Address" onChangeText={setAddress} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                width: '49%',
                marginTop: 6,
                borderColor: isStartDatePickerVisible ? Colors.primary : '#bbb',
              },
            ]}
            onPress={() => {
              if (isEndDatePickerVisible) {
                setEndDatePickerVisible(false);
              }
              setStartDatePickerVisible(!isStartDatePickerVisible);
            }}>
            <Text style={styles.dateLabel}>Start Date</Text>
            <Text style={styles.date}>{formatDate(start_date)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                width: '49%',
                marginTop: 6,
                borderColor: isEndDatePickerVisible ? Colors.primary : '#bbb',
              },
            ]}
            onPress={() => {
              if (isStartDatePickerVisible) {
                setStartDatePickerVisible(false);
              }
              setEndDatePickerVisible(!isEndDatePickerVisible);
            }}>
            <Text style={styles.dateLabel}>End Date</Text>
            <Text style={styles.date}>{formatDate(end_date)}</Text>
          </TouchableOpacity>
        </View>

        {isStartDatePickerVisible && (
          <View>
            <DateTimePicker
              value={start_date}
              onValueChange={date => {
                setStartDate(date);
                setStartDatePickerVisible(false);
              }}
              //   minimumDate={received_at}
            />
          </View>
        )}
        {isEndDatePickerVisible && (
          <View>
            <DateTimePicker
              value={end_date}
              onValueChange={date => {
                setEndDate(date);
                setEndDatePickerVisible(false);
              }}
              //   minimumDate={received_at}
            />
          </View>
        )}
      </View>
      <View>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}
          onClick={createProject}>
          <Text style={{color: 'white', fontSize: 16}}>Create Project</Text>
        </CustomButton>
      </View>
    </View>
  );
};
const CreateProjectModal = props => {
  const {showModal, setShowModal} = props;
  return (
    <CustomModal
      title={'Create Project'}
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default CreateProjectModal;
