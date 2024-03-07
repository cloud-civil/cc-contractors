import {View, Text} from 'react-native';
import styles from '../../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomIconButton} from '../../../components/CustomButton';
import Colors from '../../../styles/Colors';
import SizeButton from '../../../components/SizeButton';
import {useNavigation} from '@react-navigation/native';

const IssueCard = props => {
  const {
    item,
    project_id,
    users,
    setActivity,
    newIssue,
    handleDelete,
    isDeleting,
  } = props;
  const navigation = useNavigation();

  const handleEdit = () => {
    setActivity(prev => ({
      ...prev,
      activeIssue: item,
      editIssueModal: true,
    }));
  };

  const handleUpdate = () => {
    setActivity(prev => ({
      ...prev,
      activeIssue: item,
      updateIssueModal: true,
    }));
  };

  return (
    <SizeButton
      onClick={() =>
        navigation.navigate('IssueComment', {
          activeIssue: item,
          project_id,
        })
      }>
      <View style={styles.card}>
        <View
          style={[
            styles.assIcon,
            {backgroundColor: getStatusColor(item.status, item.priority)},
          ]}>
          <MaterialCommunityIcons
            name={getIconName(item, newIssue)}
            size={26}
            color={'white'}
          />
        </View>
        <View
          style={{
            marginLeft: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{width: '52%'}}>
            <Text style={{fontWeight: 600}}>{item.issue_name}</Text>
            <Text numberOfLines={1} style={{fontSize: 13, marginVertical: 2}}>
              {item.description}
            </Text>

            <Text style={{fontWeight: 500}}>
              {getUserFullName(users, item.assigned_to)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 'auto',
            }}>
            <CustomIconButton onClick={handleEdit}>
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color={Colors.primary}
              />
            </CustomIconButton>
            <CustomIconButton onClick={handleUpdate}>
              <MaterialCommunityIcons
                name="update"
                size={24}
                color={Colors.primary}
              />
            </CustomIconButton>
            <CustomIconButton
              loading={isDeleting}
              onClick={() => handleDelete(item)}>
              <MaterialCommunityIcons
                name="delete-outline"
                size={24}
                color={Colors.error}
              />
            </CustomIconButton>
          </View>
        </View>
      </View>
    </SizeButton>
  );
};

const getStatusColor = (status, priority) => {
  if (status === 'done') return 'green';
  if (priority === 'low') return Colors.primary;
  if (priority === 'medium') return Colors.warning;
  if (priority === 'high') return Colors.error;
  return null;
};

const getIconName = (item, newIssue) => {
  if (newIssue) return 'alert-circle-outline';
  if (item.status === 'in_progress') return 'progress-clock';
  if (item.status === 'on_hold') return 'motion-pause';
  if (item.status === 'done') return 'alert-circle-check-outline';
  return null;
};

const getUserFullName = (users, userId) => {
  return `${users[userId]?.fname} ${users[userId]?.lname}`;
};

export default IssueCard;
