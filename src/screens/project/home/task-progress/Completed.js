import {FlatList, Platform, Text, View} from 'react-native';
import styles from '../../../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Completed = ({tasks, screenWidth}) => {
  return (
    <View style={{width: screenWidth - 20, height: '84%'}}>
      {(tasks.length > 0 &&
        !tasks.some(task => task.completed >= task.target)) ||
      tasks.length === 0 ? (
        <Text style={{textAlign: 'center', marginTop: 200}}>
          No tasks matching the condition.
        </Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={tasks}
          contentbuttonStyle={{paddingBottom: Platform.OS === 'ios' ? 10 : 4}}
          renderItem={({item: task}) => {
            if (task.completed >= task.target) {
              return (
                <View
                  key={task.task_id}
                  style={[styles.cardBorder, {borderBottomWidth: 1}]}>
                  <View style={styles.assIcon}>
                    <MaterialCommunityIcons
                      name="transit-transfer"
                      color="white"
                      size={26}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flex: 1,
                      alignItems: 'center',
                      marginLeft: 10,
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        width: '70%',
                      }}>
                      {task.name}
                    </Text>
                    <View style={[styles.tag, {marginLeft: 5}]}>
                      <MaterialCommunityIcons
                        name="check-decagram"
                        size={14}
                        color="#fff"
                      />
                      <Text style={styles.tagText}>Complete</Text>
                    </View>
                  </View>
                </View>
              );
            }
          }}
        />
      )}
    </View>
  );
};

export default Completed;
