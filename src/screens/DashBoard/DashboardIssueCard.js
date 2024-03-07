import {Dimensions, Text, View} from 'react-native';
import SizeButton from '../../components/SizeButton';
import styles from '../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomIconButton} from '../../components/CustomButton';
import Colors from '../../styles/Colors';
import {useNavigation} from '@react-navigation/native';

const DashboardIssueCard = ({item, users, setActivity, activity}) => {
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
            item.priority === 'high'
              ? {backgroundColor: '#FE390F'}
              : item.priority === 'medium'
              ? {backgroundColor: '#FEAB0F'}
              : null,
          ]}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
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
                {users[item.assigned_to].fname} {users[item.assigned_to].lname}
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

export default DashboardIssueCard;
