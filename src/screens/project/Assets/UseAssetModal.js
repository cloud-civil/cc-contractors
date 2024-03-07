import React from 'react';
import {Text, View} from 'react-native';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import CustomModal from '../../../components/CustomModal';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {CustomFormButton} from '../../../components/CustomButton';
import {useState} from 'react';
import {setOrgAssetsData} from '../../../cc-hooks/src/appSlice';
import {createHookData} from '../../../cc-utils/src';
import CustomDropdown from '../../../components/CustomDropdown';

const FormComponent = props => {
  const {project_id, setShowModal, activeAsset, setRender, reRender} = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const orgUsersAsArray = useSelector(
    state => state.app.users.asArray,
    shallowEqual,
  );
  const orgAssets = useSelector(state => state.app.assets, shallowEqual);
  const [user_id, setUserId] = useState('');

  const useAsset = () => {
    axiosInstance(token)
      .post('/useAssetInProjectId', {
        project_id,
        user_id: user_id,
        asset_id: activeAsset.asset_id,
        // asset_rate_id: formData.asset_rate_id
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Asset has been used succesfully.',
        });
        setRender({
          ...reRender,
          available: reRender.available + 1,
          used: reRender.used + 1,
        });
        const newAssets = orgAssets.asArray.map(item => {
          if (item.asset_id === activeAsset.asset_id) {
            return {...item, status: 101};
          }
          return item;
        });
        dispatch(
          setOrgAssetsData({
            data: createHookData('asset_id', newAssets),
          }),
        );
        setShowModal(false);
        setUserId('');
      })
      .catch(err => {
        console.error(
          err,
          '/useAssetInProjectId',
          err?.response?.data?.message,
        );
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to use asset.',
        });
      });
  };

  return (
    <View style={{marginTop: 6}}>
      <CustomDropdown
        label="Assign User"
        data={orgUsersAsArray}
        onSelect={selectedItem => {
          setUserId(selectedItem.user_id);
        }}
        renderDisplayItem={item => `${item.fname} ${item.lname}`}
      />
      <CustomFormButton onClick={useAsset}>
        <Text style={{color: 'white', fontSize: 16}}>Issue</Text>
      </CustomFormButton>
    </View>
  );
};

const UseAssetModal = props => {
  const {showModal, setShowModal} = props;

  return (
    <CustomModal
      title="Use Asset"
      visible={showModal}
      closeModal={() => setShowModal(false)}>
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default UseAssetModal;
