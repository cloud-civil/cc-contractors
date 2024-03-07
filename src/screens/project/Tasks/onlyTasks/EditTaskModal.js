import {useEffect, useState} from 'react';
import CustomModal from '../../../../components/CustomModal';
import {Text, TouchableOpacity, View} from 'react-native';
// import {TouchableOpacity} from 'react-native-gesture-handler';

import styles from '../../../../styles/styles';
import {units} from '../../../../utils/constants';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {formatDate} from '../../../../utils';
import DateTimePicker from 'react-native-ui-datepicker';
import {CustomFormButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {editTask} from '../../../../cc-hooks/src/taskSlice';
import Toast from 'react-native-toast-message';
import Input from '../../../../components/Input';
import CustomDropdown from '../../../../components/CustomDropdown';

const FormComponent = props => {
  const {setActivity, activity, activeGroupId, project_id} = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const __users = useSelector(state => state.app.users, shallowEqual);
  const userArray = __users.asArray;

  const [name, setName] = useState('');
  // const [budget, setBudget] = useState('');
  const [target, setTarget] = useState(0);
  const [unit, setUnit] = useState('');
  const [user_id, setUserId] = useState('');
  const [unitName, setUnitName] = useState('Select Unit');
  const [oldUser, setOldUser] = useState('Select User');

  const [start_date, setStartDate] = useState(new Date());
  const [end_date, setEndDate] = useState(new Date());
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  useEffect(() => {
    if (activity.activeTask.name) {
      setName(activity.activeTask.name);
    }
    if (activity.activeTask.target) {
      setTarget(activity.activeTask.target);
    }
    if (activity.activeTask.unit) {
      setUnitName(activity.activeTask.unit);
      setUnit(activity.activeTask.unit);
    }
    if (activity.activeTask.user_id) {
      const user = __users.asObject[activity.activeTask.user_id];
      user?.fname && user?.lname && setOldUser(`${user?.fname} ${user?.lname}`);
      setUserId(user?.user_id);
    }
    if (activity.activeTask.start_date) {
      setStartDate(new Date(activity.activeTask.start_date));
    }
    if (activity.activeTask.end_date) {
      setEndDate(new Date(activity.activeTask.end_date));
    }
  }, [activity.activeTask]);

  const EditTask = () => {
    const __target = parseInt(target, 10);
    const data = {
      task_id: activity.activeTask.task_id,
      name,
      // budget: parseInt(budget),
      start_date,
      end_date,
      unit,
      target: __target,
      user_id,
    };

    axiosInstance(token)
      .post('/updateTaskForProject', data)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'success',
          text2: `Task ${name} edited succesfully.`,
        });
        dispatch(editTask({task: data, project_id, parent_id: activeGroupId}));
        resetFields();
      })
      .catch(() => {
        dispatch(editTask({task: data, project_id, parent_id: activeGroupId}));
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: `Couldn"t edit Task ${name}`,
        });
      });
  };
  const resetFields = () => {
    setActivity(prev => ({
      ...prev,
      showEditTaskModal: false,
    }));
    setName('');
    setStartDate(new Date());
    setEndDate(new Date());
    setStartDatePickerVisible(false);
    setEndDatePickerVisible(false);
  };
  return (
    <View style={{marginTop: 10}}>
      <View>
        <Input value={name} label="Name" onChangeText={setName} />
        <Input
          value={target.toString()}
          label="Target"
          onChangeText={setTarget}
        />
        <CustomDropdown
          label={unitName}
          search
          data={units}
          onSelect={item => {
            setUnit(item.value);
          }}
          renderDisplayItem={item => item.name}
        />

        <CustomDropdown
          label={oldUser}
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
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
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
            />
          </View>
        )}
      </View>

      <View>
        <CustomFormButton onClick={EditTask}>
          <Text style={{color: 'white', fontSize: 16}}>Edit Task</Text>
        </CustomFormButton>
      </View>
    </View>
  );
};
const EditTaskModal = props => {
  const {activity, setActivity} = props;

  return (
    <CustomModal
      title="Edit Task"
      visible={activity.showEditTaskModal}
      closeModal={() => {
        setActivity(prev => ({
          ...prev,
          showEditTaskModal: false,
        }));
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default EditTaskModal;
