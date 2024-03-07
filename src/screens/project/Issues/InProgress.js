import {View, Text, FlatList} from 'react-native';
import styles from '../../../styles/styles';
import IssueCard from './IssueCard';

const IssueInProgress = props => {
  const {activity} = props;

  return (
    <View style={styles.container}>
      {activity.issuesData &&
      activity.issuesData.some(item => item.status === 'in_progress') ? (
        <FlatList
          data={activity.issuesData}
          renderItem={({item}) => {
            if (item.status !== 'in_progress') {
              return null;
            }
            return <IssueCard key={item.issue_id} item={item} {...props} />;
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>There is no issue in progress.</Text>
        </View>
      )}
    </View>
  );
};

export default IssueInProgress;
