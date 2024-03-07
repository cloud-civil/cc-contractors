import {FlatList, Text, View} from 'react-native';
import styles from '../../../styles/styles';
import IssueCard from './IssueCard';

const IssuesOnHold = props => {
  const {activity} = props;

  return (
    <View style={styles.container}>
      {activity.issuesData &&
      activity.issuesData.some(item => item.status === 'on_hold') ? (
        <FlatList
          data={activity.issuesData}
          renderItem={({item}) => {
            if (item.status !== 'on_hold') {
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
          <Text>There is no issues on hold.</Text>
        </View>
      )}
    </View>
  );
};

export default IssuesOnHold;
