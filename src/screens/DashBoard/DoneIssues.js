import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import DashboardIssueCard from './DashboardIssueCard'

const DoneIssues = (props) => {
  const { activity, setActivity } = props
  const users = useSelector((state) => state.app.users.asObject)

  return (
    <View style={{ marginTop: 10 }}>
      {activity.doneIssues && activity.doneIssues.length ? (
        <FlatList
          data={activity.doneIssues}
          showsVerticalScrollIndicator={false}
          contentbuttonStyle={{
            paddingBottom: 10
          }}
          renderItem={({ item }) => {
            return (
              <DashboardIssueCard
                activity={activity}
                setActivity={setActivity}
                item={item}
                users={users}
              />
            )
          }}
        />
      ) : (
        <View style={{ marginTop: 100 }}>
          <Text style={{ textAlign: 'center' }}>No completed issues.</Text>
        </View>
      )}
    </View>
  )
}

export default DoneIssues
