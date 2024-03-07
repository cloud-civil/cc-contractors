import {useState} from 'react';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {Alert, Text, View} from 'react-native';
import Colors from '../../../styles/Colors';
import {CustomButton} from '../../../components/CustomButton';
import Toast from 'react-native-toast-message';
import CustomModal from '../../../components/CustomModal';
import Input from '../../../components/Input';

export const FormComponent = props => {
  const {
    token,
    project_id,
    activeGroupId,
    reRender,
    setRender,
    setShowCategoryModal,
  } = props;
  const [name, setName] = useState('');
  const CreateTaskCategory = () => {
    if (name === '') {
      Alert.alert('Invalid', 'Task category name should not be empty.');
      return;
    }
    const x = {
      project_id,
      name,
      parent_id: activeGroupId === 'main' ? null : activeGroupId,
    };
    axiosInstance(token)
      .post('/createTaskCategory', x)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Task category created succesfully',
        });
        setShowCategoryModal(false);
        setRender(reRender + 1);
        setName('');
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to create Task category',
        });
      });
  };

  return (
    <View style={{marginTop: 10}}>
      <Input
        value={name}
        label="Task category name"
        onChangeText={setName}
        autoFocus={true}
      />

      <View style={{marginTop: 4}}>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}
          onClick={CreateTaskCategory}>
          <Text style={{color: 'white', fontSize: 16}}>Create Category</Text>
        </CustomButton>
      </View>
    </View>
  );
};

export const CreateTaskCategoryModal = props => {
  const {showCategoryModal, setShowCategoryModal} = props;

  return (
    <CustomModal
      title="Create Task Category"
      visible={showCategoryModal}
      closeModal={() => {
        setShowCategoryModal(false);
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
