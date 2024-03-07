import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import styles from '../../../styles/styles';
import Colors from '../../../styles/Colors';
import IssueCard from './IssueCard';

const NewIssues = props => {
  const {activity} = props;
  const isNewIssue = date => {
    const createdAt = new Date(date);
    const timeDifference = Date.now() - createdAt.getTime();
    return timeDifference < 24 * 60 * 60 * 1000;
  };

  return (
    <View style={styles.container}>
      {!activity.loading ? (
        <>
          {activity.issuesData &&
          activity.issuesData.some(
            item => isNewIssue(item.created_at) && item.status !== 'done',
          ) ? (
            <FlatList
              data={activity.issuesData}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 60}}
              renderItem={({item}) => {
                if (!isNewIssue(item.created_at) || item.status === 'done') {
                  return null;
                }
                return (
                  <IssueCard
                    key={item.issue_id}
                    item={item}
                    {...props}
                    newIssue
                  />
                );
              }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>There is no new issues.</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyTabView}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

export default NewIssues;
