import {Dimensions, Text, View} from 'react-native';
import SizeButton from '../../components/SizeButton';
import styles from '../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomIconButton} from '../../components/CustomButton';
import Colors from '../../styles/Colors';
import {useNavigation} from '@react-navigation/native';

const DashboardIssueCard = ({item, users, setActivity, activity, newIssue}) => {
  const navigation = useNavigation();
  return (
    <SizeButton
      key={item.issue_id}
      onClick={() =>
        navigation.navigate('IssueComment', {
          activeIssue: item,
          project_id: activity.project_id,
        })
      }>
      <View
        style={[
          styles.cardBorder,
          {
            width: Dimensions.get('window').width - 36,
            borderBottomWidth: 1,
          },
        ]}>
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
          <View style={{width: '80%'}}>
            <Text style={{marginBottom: 2, fontWeight: 600}}>
              {item.issue_name}
            </Text>
            <Text numberOfLines={1} style={{fontSize: 13}}>
              {item.description}
            </Text>
            <Text style={{fontSize: 13}}>
              Assigned to:{' '}
              <Text style={{fontWeight: 500}}>
                {getUserFullName(users, item)}
              </Text>
            </Text>
          </View>
          <CustomIconButton
            onClick={() => {
              setActivity(prev => ({
                ...prev,
                activeIssue: item,
                updateIssueModal: true,
              }));
            }}>
            <MaterialCommunityIcons
              name="update"
              size={24}
              color={Colors.primary}
            />
          </CustomIconButton>
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

const getUserFullName = (users, item) => {
  return `${users[item.assigned_to]?.fname} ${users[item.assigned_to].lname}`;
};

export default DashboardIssueCard;
