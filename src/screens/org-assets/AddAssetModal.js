import {useState} from 'react';
import CustomModal from '../../components/CustomModal';
import {Alert, Text, View} from 'react-native';
import Colors from '../../styles/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {CustomButton} from '../../components/CustomButton';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {setOrgAssetsData} from '../../cc-hooks/src/appSlice';
import Toast from 'react-native-toast-message';
import Input from '../../components/Input';
import {createHookData} from '../../cc-utils/src';

export const FormComponent = ({setShowModal}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const userOrg = useSelector(state => state.auth.org);
  const assets = useSelector(state => state.app.assets);
  const [name, setName] = useState('');
  const [asset_id, setAssetId] = useState('');
  const [asset_type, setAssetType] = useState('');
  const [asset_value, setAssetValue] = useState('');

  const createAsset = () => {
    if (!validateForm()) {
      return;
    }
    const assetData = {
      org_id: userOrg.org_id,
      name,
      asset_uid: asset_id,
      asset_type: asset_type,
      asset_value: parseFloat(asset_value),
    };
    axiosInstance(token)
      .post('/createAsset', assetData)
      .then(({data}) => {
        dispatch(
          setOrgAssetsData({
            data: createHookData('asset_id', [...assets.asArray, ...data.data]),
          }),
        );
        setShowModal(false);
        resetFields();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Asset created succesfully',
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to create asset',
        });
        console.log(err, '/createAsset', err?.response?.data?.message);
      });
  };

  const validateForm = () => {
    if (!name || !asset_id || !asset_type || !asset_value) {
      Alert.alert('Invalid', 'Please fill all the fields.');
      return false;
    } else {
      return true;
    }
  };

  const resetFields = () => {
    setName('');
    setAssetId('');
    setAssetType('');
    setAssetValue('');
  };
  return (
    <View style={{marginTop: 10}}>
      <View>
        <Input value={name} label="Asset Name" onChangeText={setName} />
        <Input
          value={asset_id}
          label="Machine ID/ Asset ID"
          onChangeText={setAssetId}
        />
        <Input
          value={asset_type}
          label="Asset Type"
          onChangeText={setAssetType}
        />
        <Input
          value={asset_value}
          label="Asset Value"
          onChangeText={setAssetValue}
          keyboardType="numeric"
        />
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
          onClick={createAsset}>
          <Text style={{color: 'white', fontSize: 16}}>Create Asset</Text>
        </CustomButton>
      </View>
    </View>
  );
};

export const AddAssetModal = props => {
  const {showModal, setShowModal} = props;

  return (
    <CustomModal
      title="Add Asset"
      visible={showModal}
      closeModal={() => setShowModal(false)}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
