import React from 'react';
import {Alert, FlatList, Image, View} from 'react-native';
import {CustomButton} from '../../../../components/CustomButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Input from '../../../../components/Input';
import {ImageLoadingSkeleton} from '../../../../components/Skeleton';
import {IMAGE_URL} from '@env';
import {useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {deleteImage, resetImages} from '../../../../cc-hooks/src/imageSlice';
import Colors from '../../../../styles/Colors';
import {Text} from 'react-native';
import CustomModal from '../../../../components/CustomModal';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import Toast from 'react-native-toast-message';
import {takePicture} from '../../../../utils/camera';

const FormComponent = props => {
  const {state, setState, project_id, setShowModal, setReRender} = props;
  const dispatch = useDispatch();
  const token = useSelector(state_ => state_.auth.token, shallowEqual);
  const userOrg = useSelector(state_ => state_.auth.org, shallowEqual);
  const authUser = useSelector(state_ => state_.auth.user, shallowEqual);

  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const uploadedUrls = useSelector(
    state_ => state_.image.uploadedUrls,
    shallowEqual,
  );

  const handleTakePicture = async () => {
    takePicture(
      project_id,
      token,
      userOrg.org_id,
      dispatch,
      setImageUploadLoading,
    );
  };

  const createExpense = () => {
    if (state.userBalance) {
      const _expense = parseInt(state.expense, 10);
      const data = {
        title: state.title,
        org_id: userOrg.org_id,
        project_id,
        expense: _expense,
        account_details: {},
        balance: state.userBalance.balance - _expense,
        remark: '',
        images: JSON.stringify(uploadedUrls),
      };
      axiosInstance(token)
        .post(`/expense/user/${authUser.user_id}/addUserExpense`, data)
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Expense created for user succesfully.',
          });
          setReRender(prev => prev + 1);
          setShowModal(false);
        })
        .catch(err => {
          setShowModal(false);
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: 'Could not create expense',
          });
          console.error(err);
        });
    } else {
      Alert.alert('No Balance', "You don't have enough balance.");
      setShowModal(false);
    }
  };

  return (
    <View>
      <View style={{marginTop: 10}}>
        <Input
          label={'Expense Title'}
          value={state.title}
          onChangeText={text => {
            setState({
              ...state,
              title: text,
            });
          }}
        />
        <Input
          label={'Expense'}
          value={state.expense}
          onChangeText={text => {
            setState({
              ...state,
              expense: text,
            });
          }}
          keyboardType="numeric"
        />
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: 10}}
        keyExtractor={item => item.id}
        data={
          imageUploadLoading
            ? [...uploadedUrls, {skeleton: true, id: 10000}]
            : uploadedUrls
        }
        horizontal={true}
        renderItem={({item}) => {
          if (item.skeleton) {
            return <ImageLoadingSkeleton key={item.id} />;
          } else {
            return (
              <View
                style={{marginRight: 10, position: 'relative'}}
                key={item.id}>
                <Image
                  source={{
                    uri: `${IMAGE_URL}/previewUploadedImage/thumbnail-${item.fullName}`,
                    headers: {
                      Authorization: token,
                    },
                  }}
                  style={{width: 60, height: 80, borderRadius: 8}}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 18,
                    height: 18,
                  }}>
                  <TouchableOpacity
                    onPress={() => dispatch(deleteImage({id: item.id}))}>
                    <MaterialIcons
                      name="delete-outline"
                      size={18}
                      color={'white'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
        }}
      />

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            height: 45,
            width: 45,
            borderRadius: 10,
            marginRight: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={handleTakePicture}>
          <MaterialIcons name="camera-alt" size={22} color={'white'} />
        </CustomButton>
        <View style={{flex: 1}}>
          <CustomButton
            buttonStyle={{
              backgroundColor: Colors.primary,
              borderRadius: 8,
              flex: 1,
              marginTop: 6,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
            }}
            onClick={createExpense}
            style={{width: '45%'}}>
            <Text style={{textAlign: 'center', color: 'white'}}>Create</Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

const AddExpenseModal = props => {
  const {showModal, setShowModal} = props;
  const dispatch = useDispatch();
  return (
    <CustomModal
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
        dispatch(resetImages());
      }}
      title="Add Expense">
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default AddExpenseModal;
