import {useState} from 'react';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {setGrns} from '../../../../../cc-hooks/src/appSlice';
import {axiosInstance} from '../../../../../apiHooks/axiosInstance';

const useCreateGRN = ({
  token,
  setActivity,
  formData,
  setFormData,
  dispatch,
  userOrg,
  project_id,
  grns,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const createGRN = () => {
    if (formData.quantity === '' || parseInt(formData.quantity) === 0) {
      Alert.alert('Invalid quantity', 'Please provide a valid quantity.');
      return;
    }
    if (!formData.stock_id) {
      Alert.alert('Invalid Stock', 'Please provide a valid stock.');
      return;
    }
    setIsCreating(true);
    const grn = {
      org_id: userOrg.org_id,
      project_id,
      stock_id: formData.stock_id,
      quantity: parseFloat(formData.quantity),
    };
    axiosInstance(token)
      .post(`/grn/${project_id}/createGrn`, grn)
      .then(({data}) => {
        dispatch(setGrns({project_id, data: [data.data, ...grns]}));
        setActivity(prev => ({...prev, showCreateGRNModal: false}));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'GRN created succesfullly.',
        });
        resetFields();
        setIsCreating(false);
      })
      .catch(err => {
        setIsCreating(false);
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to create GRN',
        });
        console.error(err.response.data.message);
      });
  };

  const resetFields = () => {
    setActivity(prev => ({...prev, addIssueModal: false}));
    setFormData({
      stock_id: null,
      quantity: 0,
    });
  };

  return {createGRN, isCreating};
};

export default useCreateGRN;
