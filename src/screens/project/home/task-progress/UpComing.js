import {FlatList, Platform, Text, View} from 'react-native';
import styles from '../../../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatDate} from '../../../../utils';
import {calculateDays} from './utils';

const UpComing = ({tasks, currentDate, screenWidth}) => {
  return (
    <View
      style={{
        width: screenWidth - 20,
        height: '84%',
      }}>
      {(tasks.length > 0 &&
        !tasks.some(task => new Date(task.start_date) > currentDate)) ||
      tasks.length === 0 ? (
        <Text style={{textAlign: 'center', marginTop: 200}}>
          No tasks matching the condition.
        </Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={tasks}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 10 : 4,
          }}
          renderItem={({item: task}) => {
            if (task.completed >= task.target) return null;
            if (new Date(task.start_date) > currentDate) {
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
                        width: '54%',
                      }}>
                      {task.name}
                    </Text>
                    <View>
                      <Text style={{marginLeft: 'auto', marginBottom: 4}}>
                        <Text style={{fontWeight: '600'}}>
                          {calculateDays(currentDate, task.start_date)}
                        </Text>{' '}
                        {calculateDays(currentDate, task.start_date) === 1
                          ? 'day'
                          : 'days'}{' '}
                        to start
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text>Start by {formatDate(task.start_date)}</Text>
                      </View>
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

export default UpComing;
