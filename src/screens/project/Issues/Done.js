import {FlatList, Text, View} from 'react-native';
import styles from '../../../styles/styles';
import IssueCard from './IssueCard';

const IssuesDone = props => {
  const {activity} = props;

  return (
    <View style={styles.container}>
      {activity.issuesData &&
      activity.issuesData.some(item => item.status === 'done') ? (
        <FlatList
          data={activity.issuesData}
          renderItem={({item}) => {
            if (item.status !== 'done') {
              return null;
            }
            return <IssueCard key={item.issue_id} {...props} item={item} />;
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>There is no completed issue.</Text>
        </View>
      )}
    </View>
  );
};

export default IssuesDone;
