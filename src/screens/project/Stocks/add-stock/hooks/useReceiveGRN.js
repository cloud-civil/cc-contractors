import {useState} from 'react';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {axiosInstance} from '../../../../../apiHooks/axiosInstance';

const useReceiveGRN = ({
  token,
  activity,
  setActivity,
  formData,
  userOrg,
  project_id,
  uploadedUrls,
  resetFields,
}) => {
  const [isReceiving, setIsReceiving] = useState(false);

  const receiveGrn = () => {
    if (!validate()) {
      return;
    }
    setIsReceiving(true);
    const grn = {
      grn_id: activity.activeGRN.grn_id,
      org_id: userOrg.org_id,
      project_id,
      vendor_id: formData.vendor_id,
      stock_id: formData.stock_id,
      quantity: parseInt(formData.quantity, 10),
      received_at: formData.receivedTime,
      location: JSON.stringify(formData.location),
      vehicle_no: formData.vehicle_no,
      has_invoice: formData.has_invoice,
      images: JSON.stringify(uploadedUrls),
      files: [],
      verification: JSON.stringify({
        verified: false,
        verified_by: null,
      }),
    };

    axiosInstance(token)
      .post(`/grn/${project_id}/receiveGrn`, grn)
      .then(() => {
        resetFields();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'GRN Received succesfully.',
        });
        setActivity(prev => ({...prev, showReceiveGRNModal: false}));
        // setIsReceiving(false);
      })
      .catch(err => {
        // setIsReceiving(false);
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: err?.response?.data?.message,
        });
        console.error(
          err,
          '/grn/${project_id}/receiveGrn',
          err?.response?.data?.message,
        );
      });
  };

  const validate = () => {
    if (formData.quantity === 0 || formData.quantity === '') {
      Alert.alert('Invalid Quantity', 'Provide quantity value greater than 0.');
      return false;
    }
    if (
      activity.activeGRN.quantity <
      activity.activeGRN.received + parseInt(formData.quantity)
    ) {
      Alert.alert(
        'Invalid Quantity',
        `Quantity value should not exceed ${
          activity.activeGRN.quantity - activity.activeGRN.received
        }.`,
      );
      return false;
    }
    return true;
  };

  return {receiveGrn, isReceiving};
};

export default useReceiveGRN;
