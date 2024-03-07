import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import DashboardIssueCard from './DashboardIssueCard';

const InProgressIssue = props => {
  const {activity, setActivity} = props;
  const users = useSelector(state => state.app.users.asObject);

  return (
    <View style={{marginTop: 10}}>
      {activity.updatedIssues && activity.updatedIssues.length ? (
        <FlatList
          data={activity.updatedIssues}
          showsVerticalScrollIndicator={false}
          contentbuttonStyle={{
            paddingBottom: 10,
          }}
          renderItem={({item}) => {
            return (
              <DashboardIssueCard
                activity={activity}
                setActivity={setActivity}
                item={item}
                users={users}
              />
            );
          }}
        />
      ) : (
        <View style={{marginTop: 100}}>
          <Text style={{textAlign: 'center'}}>No issues in progress.</Text>
        </View>
      )}
    </View>
  );
};

export default InProgressIssue;
