import {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import CustomModal from '../../../../components/CustomModal';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import styles from '../../../../styles/styles';
import {units} from '../../../../utils/constants';
import DateTimePicker from 'react-native-ui-datepicker';
import {formatDate} from '../../../../utils';
import {CustomFormButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import {addNewTask} from '../../../../cc-hooks/src/taskSlice';
import Toast from 'react-native-toast-message';
import Input from '../../../../components/Input';
import CustomDropdown from '../../../../components/CustomDropdown';

const FormComponent = props => {
  const {project_id, setActivity, activeGroupId} = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const __users = useSelector(state => state.app.users, shallowEqual);
  const userArray = __users.asArray;

  const [name, setName] = useState('');
  const [target, setTarget] = useState(0);
  const [unit, setUnit] = useState('');
  const [user_id, setUserId] = useState('');

  const [start_date, setStartDate] = useState(new Date());
  const [end_date, setEndDate] = useState(new Date());

  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const createTask = () => {
    const data = {
      name,
      start_date:
        typeof start_date === 'object' ? start_date.toISOString() : start_date,
      end_date:
        typeof end_date === 'object' ? end_date.toISOString() : end_date,
      unit,
      target: parseInt(target, 10),
      completed: 0,
      project_id: parseInt(project_id),
      status: 'idle',
      parent_id: activeGroupId,
      user_id: parseInt(user_id, 10),
    };
    axiosInstance(token)
      .post('/createTaskForProject', data)
      .then(res => {
        const newTaskId = res.data.data[0].task_id;
        dispatch(
          addNewTask({
            project_id,
            parent_id: activeGroupId,
            data: {...data, task_id: newTaskId},
          }),
        );
        setActivity(prev => ({
          ...prev,
          showCreateTaskModal: false,
        }));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Task ${name} created succesfully.`,
        });
        resetFields();
      })
      .catch(err => {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Couldn"t create Task',
        });
      });
  };

  const resetFields = () => {
    setName('');
    setTarget('');
    setStartDate(new Date());
    setEndDate(new Date());
    setStartDatePickerVisible(false);
    setEndDatePickerVisible(false);
  };

  return (
    <View style={{marginTop: 8}}>
      <Input value={name} onChangeText={setName} label="Task Name" />
      <Input
        value={target.toString()}
        keyboardType="numeric"
        onChangeText={setTarget}
        label="Work Area"
      />
      <CustomDropdown
        label="Select Unit"
        search
        data={units}
        onSelect={item => {
          setUnit(item.name);
        }}
        renderDisplayItem={item => item.name}
      />
      <CustomDropdown
        label="Assign User"
        search
        data={userArray}
        onSelect={item => {
          setUserId(item.user_id);
        }}
        renderDisplayItem={item => `${item.fname} ${item.lname}`}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 6,
          backgroundColor: 'white',
        }}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              width: '49%',
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
            minimumDate={start_date}
          />
        </View>
      )}

      <CustomFormButton onClick={createTask}>
        <Text style={{color: 'white', fontSize: 16}}>Create Task</Text>
      </CustomFormButton>
    </View>
  );
};

const CreateTaskModal = props => {
  const {activity, setActivity} = props;
  return (
    <CustomModal
      title={'Create Task'}
      visible={activity.showCreateTaskModal}
      closeModal={() => {
        setActivity(prev => ({
          ...prev,
          showCreateTaskModal: false,
        }));
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default CreateTaskModal;
