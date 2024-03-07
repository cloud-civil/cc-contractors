import React from 'react';
import {FlatList, Platform, Text, View} from 'react-native';
import styles from '../../../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomButton} from '../../../../components/CustomButton';
import {formatDate, formateAmount} from '../../../../utils';
import Colors from '../../../../styles/Colors';
import {calculateDays} from './utils';

const InProgress = ({
  tasks,
  currentDate,
  permission,
  setActivity,
  screenWidth,
}) => {
  return (
    <View
      style={{
        width: screenWidth - 20,
        height: '84%',
      }}>
      {(tasks.length > 0 &&
        !tasks.some(
          task =>
            new Date(task.start_date) <= currentDate &&
            new Date(task.end_date) >= currentDate,
        )) ||
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
            if (
              new Date(task.start_date) <= currentDate &&
              new Date(task.end_date) >= currentDate
            ) {
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
                    <View style={{width: '65%'}}>
                      <Text style={{fontSize: 14, fontWeight: 600}}>
                        {task.name}
                      </Text>
                      <Text style={{fontSize: 14}}>
                        Target: {formateAmount(task.target)} {task.unit}
                      </Text>
                      <Text style={{fontSize: 14}}>
                        Completed: {formateAmount(task.completed) || 0}{' '}
                        {task.unit}
                      </Text>
                    </View>
                    <View style={{}}>
                      <Text style={{marginLeft: 'auto', marginBottom: 4}}>
                        <Text style={{fontWeight: '600'}}>
                          {calculateDays(currentDate, task.end_date)}
                        </Text>{' '}
                        {calculateDays(currentDate, task.end_date) === 1
                          ? 'day'
                          : 'days'}{' '}
                        left
                      </Text>
                      {permission && permission.write ? (
                        <CustomButton
                          onClick={() => {
                            setActivity(prev => ({
                              ...prev,
                              activeTask: task,
                              showUpdateTaskModal: true,
                            }));
                          }}
                          buttonStyle={{
                            backgroundColor: Colors.primary,
                            borderRadius: 4,
                            marginLeft: 'auto',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 13,
                              marginRight: 3,
                            }}>
                            Update
                          </Text>
                          <MaterialCommunityIcons
                            name="update"
                            color="white"
                            size={15}
                          />
                        </CustomButton>
                      ) : (
                        <Text>Finish by {formatDate(task.end_date)}</Text>
                      )}
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

export default InProgress;
