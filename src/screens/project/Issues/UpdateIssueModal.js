import {useEffect, useState} from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import styles from '../../../styles/styles';
import SelectDropdown from 'react-native-select-dropdown';
import Colors from '../../../styles/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CustomButton} from '../../../components/CustomButton';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import CustomModal from '../../../components/CustomModal';
import Toast from 'react-native-toast-message';
import TextArea from '../../../components/TextArea';
import {deleteImage, resetImages} from '../../../cc-hooks/src/imageSlice';
import {takePicture} from '../../../utils/camera';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ImageLoadingSkeleton} from '../../../components/Skeleton';
import {IMAGE_URL} from '@env';

const FormComponent = props => {
  const {setActivity, activity, project_id, setRender, token, userOrg} = props;
  const dispatch = useDispatch();
  const uploadedUrls = useSelector(
    state => state.image.uploadedUrls,
    shallowEqual,
  );
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const [formData, setFormData] = useState({
    comment: '',
    photo: null,
    status: '',
  });
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  useEffect(() => {
    if (activity.activeIssue) {
      setFormData({
        comment: activity.activeIssue.comment,
        status: activity.activeIssue.status,
      });
    }
  }, [activity.activeIssue]);

  const handleTakePicture = async () => {
    takePicture(
      project_id,
      token,
      userOrg.org_id,
      dispatch,
      setImageUploadLoading,
    );
  };

  const onUpdate = () => {
    const updateState__ = {
      issue_id: activity.activeIssue.issue_id,
      user_id: authUser.user_id,
      comment: formData.comment,
      images: JSON.stringify(uploadedUrls),
      status: formData.status,
    };

    axiosInstance(token)
      .post('/addCommentToIssue', updateState__)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Issue has been updated succesfully.',
        });
        const newArr = activity.issuesData.map(item => {
          if (item.issue_id === activity.activeIssue.issue_id) {
            return {...item, status: formData.status};
          }
          return item;
        });
        setActivity(prev => ({...prev, issuesData: newArr}));

        if (setRender) {
          setRender(prev => prev + 1);
        }
        resetFields();
      })
      .catch(err => {
        console.error(err, 'update-issue/', err?.response?.data?.message);
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Unable to update issue.',
        });
      });
  };

  const resetFields = () => {
    dispatch(resetImages());
    setActivity(prev => ({
      ...prev,
      updateIssueModal: false,
    }));
  };

  return (
    <View style={{marginTop: 10}}>
      <View>
        <TextArea
          value={formData.comment}
          label="Comment"
          onChangeText={text => setFormData({...formData, comment: text})}
        />

        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: 'center',
          }}>
          <SelectDropdown
            buttonStyle={[
              styles.dropdownButtonStyle,
              {width: '82%', marginTop: 0, marginBottom: 0},
            ]}
            buttonTextStyle={styles.dropdownButtonText}
            defaultButtonText="Select Status"
            renderDropdownIcon={() => (
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color={'#666'}
              />
            )}
            renderSearchInputLeftIcon={() => (
              <MaterialIcons name="search" size={20} />
            )}
            dropdownStyle={{
              borderRadius: 8,
            }}
            data={['idle', 'in_progress', 'on_hold', 'done']}
            onSelect={selectedItem => {
              setFormData({
                ...formData,
                status: selectedItem,
              });
            }}
            buttonTextAfterSelection={selectedItem => {
              return (
                <Text>
                  {selectedItem === 'idle'
                    ? 'Idle'
                    : selectedItem === 'in_progress'
                    ? 'In Progress'
                    : selectedItem === 'done'
                    ? 'Done'
                    : selectedItem === 'on_hold'
                    ? 'On Hold'
                    : 'Select Status'}
                </Text>
              );
            }}
            rowTextForSelection={item => {
              return (
                <Text>
                  {item === 'idle'
                    ? 'Idle'
                    : item === 'in_progress'
                    ? 'In Progress'
                    : item === 'done'
                    ? 'Done'
                    : item === 'on_hold'
                    ? 'On Hold'
                    : 'Select Priority'}
                </Text>
              );
            }}
          />
          <View style={{flex: 1}}>
            <CustomButton
              buttonStyle={{
                backgroundColor: Colors.primary,
                height: 48,
                width: 48,
                borderRadius: 10,
                marginLeft: 'auto',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={handleTakePicture}>
              <MaterialIcons name="camera-alt" size={22} color={'white'} />
            </CustomButton>
          </View>
        </View>
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
            const {data: image} = item;
            return (
              <View
                style={{marginRight: 10, position: 'relative'}}
                key={item.id}>
                <Image
                  source={{
                    uri: `${IMAGE_URL}/previewUploadedImage/thumbnail-${image.fullName}`,
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
          onClick={onUpdate}>
          <Text style={{color: 'white', fontSize: 16}}>Comment</Text>
        </CustomButton>
      </View>
    </View>
  );
};
export const UpdateIssueModal = props => {
  const {activity, setActivity} = props;
  const dispatch = useDispatch();

  return (
    <CustomModal
      title="Update Issue"
      visible={activity.updateIssueModal}
      closeModal={() => {
        dispatch(resetImages());
        setActivity(prev => ({
          ...prev,
          updateIssueModal: false,
        }));
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
