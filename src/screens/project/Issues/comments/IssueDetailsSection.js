import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {formatDate} from '../../../../utils';
import styles from '../../../../styles/styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {IMAGE_URL} from '@env';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageComponent from '../../../../components/ImageComponent';

const IssueDetailsSection = ({
  activeIssue,
  users,
  setActivity,
  userOrg,
  project_id,
  token,
  imageName,
  showImage,
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <View style={customStyle.avatarContent}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: 600}}>
            {users[activeIssue.assigned_by].fname[0]}
          </Text>
        </View>
        <View>
          <Text style={{fontWeight: 600, fontSize: 16, marginBottom: 4}}>
            {activeIssue.issue_name}
          </Text>
          <Text>{formatDate(activeIssue.start_date)}</Text>
        </View>
        <View style={{marginLeft: 'auto', marginRight: 10}}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 10,
              textTransform: 'capitalize',
              color:
                activeIssue.priority === 'low'
                  ? 'green'
                  : activeIssue.priority === 'medium'
                  ? 'orange'
                  : 'red',
            }}>
            {activeIssue.priority} priority
          </Text>
          <CustomButton
            onClick={() => {
              setActivity(prev => ({...prev, updateIssueModal: true}));
            }}
            buttonStyle={{
              backgroundColor: Colors.primary,
              borderRadius: 4,
              marginLeft: 'auto',
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 4,
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginRight: 3,
              }}>
              Update
            </Text>
            <MaterialCommunityIcons name="update" color="white" size={15} />
          </CustomButton>
        </View>
      </View>
      {imageName && (
        <>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => showImage(imageName)}>
            <ImageComponent
              imageUrl={`${IMAGE_URL}/project_image/${userOrg.org_id}/${project_id}/preview-${imageName}`}
              token={token}
              style={{
                width: Dimensions.get('window').width - 20,
                height: (Dimensions.get('window').width - 20) / 2,
                borderRadius: 10,
                marginBottom: 10,
              }}
            />
          </TouchableOpacity>
          <View
            style={[styles.horizontalBar, {marginBottom: 10, marginTop: 6}]}
          />
        </>
      )}
      <Text>{activeIssue.description}</Text>
      <View style={[styles.horizontalBar, {marginTop: 10}]} />
    </View>
  );
};

const customStyle = StyleSheet.create({
  avatarContent: {
    width: 30,
    height: 30,
    backgroundColor: 'grey',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});

export default IssueDetailsSection;
