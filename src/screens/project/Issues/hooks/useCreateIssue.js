import {useState} from 'react';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {resetImages} from '../../../../cc-hooks/src/imageSlice';

const useCreateIssue = (
  token,
  activity,
  setActivity,
  uploadedUrls,
  formData,
  setFormData,
  initData,
  dispatch,
) => {
  const [isCreating, setIsCreating] = useState(false);

  const createIssue = () => {
    setIsCreating(true);
    if (!validate()) {
      setTimeout(() => {
        setIsCreating(false);
      }, 2000);
      return;
    }
    try {
      axiosInstance(token)
        .post('/addNewIssue', {
          ...formData,
          images: JSON.stringify(uploadedUrls),
        })
        .then(({data}) => {
          setActivity(prev => ({
            ...prev,
            issuesData: [...activity.issuesData, data.data],
          }));
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Issue created succesfully.',
          });
          resetFields();
          setIsCreating(false);
        })
        .catch(err => {
          setIsCreating(false);
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: 'Failed to create issue.',
          });
          console.log(err, '/addNewIssue', err?.response?.data?.message);
        });
    } catch (error) {
      setIsCreating(false);
      console.error('Error submitting form:', error);
    }
  };

  const validate = () => {
    if (!formData.assigned_to || !formData.issue_name) {
      Alert.alert('Invalid', 'Please fill all the required fields.');
      return false;
    }
    return true;
  };

  const resetFields = () => {
    setActivity(prev => ({...prev, addIssueModal: false}));
    setFormData(initData);
    dispatch(resetImages());
  };

  return {createIssue, isCreating};
};

export default useCreateIssue;
