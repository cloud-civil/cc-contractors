import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {IMAGE_URL} from '@env';
import {GoBack} from '../../../../components/HeaderButtons';
import styles from '../../../../styles/styles';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../../styles/Colors';
import {CustomButton} from '../../../../components/CustomButton';
import ImageView from 'react-native-image-viewing';
import {deleteImage, resetImages} from '../../../../cc-hooks/src/imageSlice';
import {useNavigation} from '@react-navigation/native';
import {UpdateIssueModal} from '../UpdateIssueModal';
import Toast from 'react-native-toast-message';
import {ImageLoadingSkeleton} from '../../../../components/Skeleton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {takePicture} from '../../../../utils/camera';
import CommentSection from './CommentSection';
import IssueDetailsSection from './IssueDetailsSection';

const IssueCommnet = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {activeIssue, project_id} = route.params;
  const token = useSelector(state => state.auth.token, shallowEqual);
  const users = useSelector(state => state.app.users.asObject, shallowEqual);
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const uploadedUrls = useSelector(
    state => state.image.uploadedUrls,
    shallowEqual,
  );
  const [comment, setComment] = useState('');
  const [commentData, setCommentData] = useState([]);
  const [reRender, setRender] = useState(0);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);
  const [activity, setActivity] = useState({
    updateIssueModal: false,
    activeIssue: activeIssue,
  });
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const imageName = JSON.parse(activeIssue?.images)?.[0]?.fullName;

  const handleTakePicture = async () => {
    takePicture(
      project_id,
      token,
      userOrg.org_id,
      dispatch,
      setImageUploadLoading,
    );
  };

  const getAllIssueCommentByIssueId = async () => {
    axiosInstance(token)
      .get(`/getAllIssueCommentByIssueId?issue_id=${activeIssue.issue_id}`)
      .then(({data}) => {
        setCommentData(data.data);
        setLoadingComments(false);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    getAllIssueCommentByIssueId();
  }, [reRender]);

  const handleComment = () => {
    if (comment === '' && uploadedUrls.length === 0) {
      return;
    }
    try {
      const data = {
        issue_id: activeIssue.issue_id,
        comment,
        images: JSON.stringify(uploadedUrls),
        user_id: authUser.user_id,
      };

      axiosInstance(token)
        .post('/addCommentToIssue', data)
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Comment added succesfully.',
          });
          setRender(prev => prev + 1);
          setComment('');
          dispatch(resetImages());
        })
        .catch(err => console.error(err));
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const showImage = imageName => {
    setActiveImage([
      {
        uri: `${IMAGE_URL}/project_image/${userOrg.org_id}/${project_id}/preview-${imageName}`,
      },
    ]);
    setShowPhotoModal(true);
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, {backgroundColor: 'white'}]}>
        <View style={{paddingTop: 34}} />
        <View
          style={{
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -10,
            backgroundColor: 'white',
          }}>
          <GoBack onClick={() => navigation.goBack()} />
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: '#3e3e3e',
              }}>
              Comments
            </Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={[1]}
            renderItem={() => {
              return (
                <>
                  <IssueDetailsSection
                    activeIssue={activeIssue}
                    users={users}
                    setActivity={setActivity}
                    userOrg={userOrg}
                    project_id={project_id}
                    token={token}
                    imageName={imageName}
                    showImage={showImage}
                  />
                  <CommentSection
                    loadingComments={loadingComments}
                    commentData={commentData}
                    users={users}
                    userOrg={userOrg}
                    project_id={project_id}
                    token={token}
                    showImage={showImage}
                  />
                </>
              );
            }}
          />

          <View style={customStyle.bottomContainer}>
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

            <View style={customStyle.inputContainer}>
              <CustomButton
                buttonStyle={{
                  backgroundColor: Colors.primary,
                  width: 34,
                  height: 34,
                  marginLeft: 6,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={handleTakePicture}>
                <MaterialCommunityIcons
                  name="camera"
                  size={22}
                  color={'white'}
                />
              </CustomButton>
              <TextInput
                placeholder="Comment..."
                value={comment}
                onChangeText={setComment}
                style={customStyle.inputComment}
                onSubmitEditing={handleComment}
                returnKeyType="send"
              />
              {comment !== '' || uploadedUrls.length !== 0 ? (
                <TouchableOpacity
                  style={{marginRight: 10}}
                  onPress={handleComment}>
                  <MaterialCommunityIcons
                    name="send"
                    size={22}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <ImageView
        images={activeImage}
        imageIndex={0}
        visible={showPhotoModal}
        onRequestClose={() => {
          setShowPhotoModal(false);
        }}
      />
      {activity.activeIssue && activity.updateIssueModal && (
        <UpdateIssueModal
          setRender={setRender}
          project_id={project_id}
          activity={activity}
          setActivity={setActivity}
          token={token}
          userOrg={userOrg}
        />
      )}
    </>
  );
};

const customStyle = StyleSheet.create({
  bottomContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  inputComment: {
    height: 45,
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default IssueCommnet;
