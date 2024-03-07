import React from 'react';
import SizeButton from '../../../../components/SizeButton';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import styles from '../../../../styles/styles';
import Colors from '../../../../styles/Colors';

const CategoryCard = ({
  taskCategoriesGroup,
  setActiveGroupId,
  setLinks,
  __tasks,
  item,
  navigation,
  reRender,
}) => {
  return (
    <SizeButton
      handleLongPress={() =>
        navigation.navigate('TaskComponent', {
          __tasks: __tasks,
          activeGroupId: item.group_id,
          reRender: reRender,
          activeGroup: item.name,
        })
      }
      onClick={() => {
        setActiveGroupId(item.group_id);
        setLinks(prevState => [...prevState, item.group_id]);
      }}
      key={item.group_id}
      buttonStyle={{
        marginBottom: taskCategoriesGroup[item.group_id].length > 0 ? 14 : 4,
      }}>
      {taskCategoriesGroup &&
        taskCategoriesGroup[item.group_id] &&
        taskCategoriesGroup[item.group_id].length > 0 && (
          <View
            style={[
              styles.card,
              {
                height: 50,
                width: '94%',
                justifyContent: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                zIndex: -10,
                marginBottom: -66,
                marginTop: 14,
              },
            ]}
          />
        )}
      <View style={styles.card}>
        <View style={styles.assIcon}>
          <MaterialIcons name="task-alt" size={28} color="white" />
        </View>
        <View
          style={{
            marginLeft: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View
            style={{
              fontWeight: 600,
              fontSize: 18,
              marginBlock: 6,
            }}>
            <Text>{item.name}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {__tasks &&
              __tasks[item.group_id] &&
              __tasks[item.group_id].length > 0 && (
                <View
                  style={{
                    marginRight: 10,
                    width: 20,
                    height: 20,
                    backgroundColor: '#4da6ff',
                    color: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    fontSize: 14,
                  }}>
                  <Text style={{color: 'white'}}>
                    {__tasks[item.group_id] && __tasks[item.group_id].length}
                  </Text>
                </View>
              )}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TaskComponent', {
                  __tasks: __tasks,
                  activeGroupId: item.group_id,
                  reRender: reRender,
                  activeGroup: item.name,
                });
              }}>
              <View
                style={{
                  height: 40,
                  width: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome6 name="list" size={20} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SizeButton>
  );
};

export default CategoryCard;
