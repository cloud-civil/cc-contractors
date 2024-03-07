import {
  FlatList,
  StyleSheet,
  // TouchableOpacity,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Text} from 'react-native';
import {useEffect, useState} from 'react';
import DashBoardIssue from './DashBoardIssue';
import {useSelector} from 'react-redux';
import TaskMnitoring from './TaskMonitoring';
import LowStock from './LowStock';

const DashBoard = () => {
  const projects = useSelector(state => state.project.projects);
  const [activeProjectId, setActiveProjectId] = useState(null);

  useEffect(() => {
    if (projects && projects.asArray && projects.asArray.length > 0) {
      const activeProject = projects.asArray[0];
      setActiveProjectId(activeProject.project_id);
    }
  }, [projects]);

  if (activeProjectId === null) {
    return null;
  }

  return (
    <View style={customStyle.dashBoardContainer}>
      <View style={{margin: 10}}>
        {projects && (
          <FlatList
            data={projects.asArray}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setActiveProjectId(item.project_id)}
                  style={{
                    marginRight: 8,
                    backgroundColor:
                      activeProjectId === item.project_id ? '#222' : 'white',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      color:
                        activeProjectId === item.project_id ? '#fff' : '#222',
                      fontWeight: '500',
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
      <TaskMnitoring project_id={activeProjectId} />
      <LowStock project_id={activeProjectId} />
      <DashBoardIssue project_id={activeProjectId} />
    </View>
  );
};

const customStyle = StyleSheet.create({
  dashBoardContainer: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default DashBoard;
