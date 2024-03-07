/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import {Text} from 'react-native';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import Tabs from '../../components/Tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SizeButton from '../../components/SizeButton';
import styles from '../../styles/styles';
import {formatDate} from '../../utils';
import {FlatList} from 'react-native-gesture-handler';

const TaskMnitoring = ({project_id}) => {
  const token = useSelector(state => state.auth.token);
  const [notCompletedTasks, setNotCompletedTasks] = useState([]);
  const screenWidth = Dimensions.get('window').width;

  const tabs = ['Not Updated'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    if (project_id) {
      axiosInstance(token)
        .get(`/getTaskNotCompletedByProjectId?project_id=${project_id}`)
        .then(({data}) => {
          setNotCompletedTasks(data.data);
        });
    }
  }, [project_id]);

  return (
    <View style={{marginHorizontal: 10}}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          marginVertical: 10,
          marginLeft: 10,
        }}>
        Task Monitoring
      </Text>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          height: 300,
          // flex: 1,
          padding: 10,
          paddingBottom: 0,
        }}>
        <Tabs
          numOfTab={3}
          data={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          minusWidth={40}
        />
        {notCompletedTasks.length > 0 ? (
          <FlatList
            data={notCompletedTasks}
            showsVerticalScrollIndicator={false}
            contentbuttonStyle={{
              paddingBottom: 10,
            }}
            renderItem={({item, index}) => {
              return (
                <SizeButton key={item.task_id}>
                  <View
                    style={[
                      styles.cardBorder,
                      {
                        width: Dimensions.get('window').width - 42,
                        borderBottomWidth:
                          notCompletedTasks.length - 1 !== index ? 1 : 0,
                      },
                    ]}>
                    <View
                      style={{
                        // marginLeft: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={styles.assIcon}>
                        <MaterialCommunityIcons
                          name="transit-transfer"
                          size={26}
                          color={'white'}
                        />
                      </View>
                      <View style={{marginLeft: 10, width: screenWidth * 0.5}}>
                        <Text
                          numberOfLines={1}
                          style={{marginBottom: 2, fontWeight: 600}}>
                          {item.name}
                        </Text>
                        <Text numberOfLines={1}>
                          {item.completed || 0}/{item.target}
                          {item.unit}
                        </Text>
                      </View>

                      {/* <CustomButton
                        onClick={() => {
                          // setActiveIssue(item);
                          // setShowEditIssueModal(true);
                        }}
                        buttonStyle={{
                          backgroundColor: '#f2f2f2',
                          borderRadius: 8,
                          marginRight: 10,
                          padding: 6
                        }}
                        >
                        <MaterialCommunityIcons
                          name="update"
                          size={24}
                          color={Colors.primary}
                        />
                      </CustomButton> */}
                    </View>
                    <View
                      style={{
                        marginLeft: 'auto',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          marginLeft: 'auto',
                          marginBottom: 3,
                        }}>
                        Last updated
                      </Text>
                      <Text style={{fontWeight: '600', fontSize: 12}}>
                        {formatDate(item.updated_at)}
                      </Text>
                    </View>
                  </View>
                </SizeButton>
              );
            }}
          />
        ) : (
          <View style={{marginTop: 100}}>
            <Text style={{textAlign: 'center'}}>No tasks to show.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TaskMnitoring;
