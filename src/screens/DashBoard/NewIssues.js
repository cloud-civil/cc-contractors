import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import DashboardIssueCard from './DashboardIssueCard';

const NewIssues = props => {
  const {activity, setActivity} = props;
  const users = useSelector(state => state.app.users.asObject);

  return (
    <View style={{marginTop: 10}}>
      {activity.newIssues && activity.newIssues.length ? (
        <FlatList
          data={activity.newIssues}
          showsVerticalScrollIndicator={false}
          contentbuttonStyle={{
            paddingBottom: 10,
          }}
          renderItem={({item}) => {
            return (
              <DashboardIssueCard
                item={item}
                users={users}
                activity={activity}
                setActivity={setActivity}
              />
            );
          }}
        />
      ) : (
        <View style={{marginTop: 100}}>
          <Text style={{textAlign: 'center'}}>No new issues today.</Text>
        </View>
      )}
    </View>
  );
};

export default NewIssues;
