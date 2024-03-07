import React, {useState} from 'react';
import {
  View,
  Text,
  // TouchableOpacity,
  Alert,
} from 'react-native';

import CustomModal from '../../../components/CustomModal';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  CustomFormButton,
  CustomFormIconButton,
} from '../../../components/CustomButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {setGroupTasks, setTaskStocks} from '../../../cc-hooks/src/taskSlice';
import {resetImages} from '../../../cc-hooks/src/imageSlice';
import Toast from 'react-native-toast-message';
import {takePicture} from '../../../utils/camera';
import Input from '../../../components/Input';
import UploadImageComponent from '../../../components/UploadImageComponent';

const FormComponent = props => {
  const {
    project_id,
    activity,
    setActivity,
    activeGroupId: x,
    setRender,
    reRender,
  } = props;
  const dispatch = useDispatch();
  const activeGroupId = x === 'main' ? activity.activeTask.parent_id : x;
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const taskStocks = useSelector(state => state.task.taskStocks, shallowEqual);
  const [__completed, setTaskDone] = useState('0');
  const [remarks, setRemarks] = useState('');
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const uploadedUrls = useSelector(
    state => state.image.uploadedUrls,
    shallowEqual,
  );
  const groupTasks = useSelector(state => state.task.groupTasks, shallowEqual);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const handleTakePicture = async () => {
    takePicture(
      project_id,
      token,
      userOrg.org_id,
      dispatch,
      setImageUploadLoading,
    );
  };

  const updateTaskDone = () => {
    const completed = parseInt(__completed, 10);
    if (completed > activity.activeTask.target) {
      Alert.alert('Invalid', 'Trying to assign more value than target');
      return;
    }

    const submitData = {
      project_id,
      org_id: userOrg.org_id,
      task_id: activity.activeTask.task_id,
      group_id: activeGroupId,
      user_id: authUser.user_id,
      completed: parseFloat(completed),
      stocks: [],
      contractor_id: null,
      images: JSON.stringify(uploadedUrls),
      files: [],
      metadata: JSON.stringify(remarks),
    };

    axiosInstance(token)
      .post('/taskCompleted', submitData)
      .then(({data}) => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Task updated succesfully.',
        });
        const newObj = JSON.parse(
          JSON.stringify(groupTasks[project_id].asObject),
        );
        const newArr = newObj[activeGroupId].map(item => {
          if (item.task_id === activity.activeTask.task_id) {
            return {...item, completed: item.completed + completed};
          }
          return item;
        });
        newObj[activeGroupId] = newArr;
        dispatch(setGroupTasks({project_id, data: newObj}));
        dispatch(
          setTaskStocks({
            project_id,
            data: [...taskStocks[project_id], ...data.task_stocks],
          }),
        );
        if (setRender && reRender !== undefined) {
          setRender(reRender + 1);
        }
        resetFields();
      })
      .catch(err => {
        console.log(
          err,
          'Error in /taskCompleted',
          err?.response?.data?.message,
        );
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: err?.response?.data?.message,
        });
      });
  };

  const resetFields = () => {
    setActivity(prev => ({...prev, showUpdateTaskModal: false}));
    setTaskDone(0);
    dispatch(resetImages());
  };

  return (
    <View style={{marginTop: 6}}>
      {activity.activeTask && (
        <Text style={{marginBottom: 10, fontWeight: 500}}>
          Target: {activity.activeTask.target} {activity.activeTask.unit}
        </Text>
      )}
      <Input
        autoFocus={true}
        value={__completed.toString()}
        label={
          activity.activeTask
            ? `Work done progress (${activity.activeTask.unit})`
            : 'Work done progress'
        }
        keyboardType="numeric"
        onChangeText={setTaskDone}
      />
      <Input value={remarks} label="Remarks" onChangeText={setRemarks} />

      <UploadImageComponent
        imageUploadLoading={imageUploadLoading}
        token={token}
      />

      <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
        <CustomFormIconButton
          disabled={imageUploadLoading}
          onClick={handleTakePicture}>
          <MaterialIcons name="camera-alt" size={22} color={'white'} />
        </CustomFormIconButton>
        <View style={{flex: 1}}>
          <CustomFormButton
            disabled={imageUploadLoading}
            onClick={updateTaskDone}>
            <Text style={{color: 'white', fontSize: 16}}>Update Task</Text>
          </CustomFormButton>
        </View>
      </View>
    </View>
  );
};
export const TaskDoneUpdateModal = props => {
  const {activity, setActivity} = props;
  const dispatch = useDispatch();
  return (
    <CustomModal
      visible={activity.showUpdateTaskModal}
      title={`Update Task ${activity.activeTask && activity.activeTask.name}`}
      closeModal={() => {
        setActivity(prev => ({...prev, showUpdateTaskModal: false}));
        dispatch(resetImages());
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
