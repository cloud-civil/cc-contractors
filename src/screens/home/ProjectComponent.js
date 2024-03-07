import React from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import styles from '../../styles/styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CodePush from 'react-native-code-push';
import Toast from 'react-native-toast-message';
import Colors from '../../styles/Colors';
import SizeButton from '../../components/SizeButton';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import DateComponent from '../../components/DateComponent';
import CircularProgress from '../../components/CircularProgress';

const screenWidth = Dimensions.get('window').width;

const ProjectComponent = ({
  projects,
  setShowCreateProjectModal,
  setShowPaymentModal,
  navigation,
  authUser,
  userOrg,
}) => {
  // const pems = useSelector(state => state.auth.permissions);
  // const permission = getPermissions(pems, 1012);

  const handleCreateProject = () => {
    if (projects.asArray.length === 1) {
      setShowPaymentModal(true);
      return;
    }
    setShowCreateProjectModal(true);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            CodePush.restartApp();
            Toast.show({
              type: 'info',
              text2: 'Project title was clicked.',
            });
          }}
          style={styles.headerContent}>
          <Text style={styles.heading}>Projects</Text>
        </TouchableOpacity>
        {authUser.user_id === userOrg.user_id && (
          <TouchableOpacity onPress={() => setShowCreateProjectModal(true)}>
            <Text style={{color: Colors.primary, fontWeight: '600'}}>
              Create Project
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {projects && projects.asArray && (
        <View>
          <FlatList
            data={projects.asArray}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              var metadata = {
                completed: 0,
                target: 0,
              };
              if (item && item.metadata && typeof item.metadata === 'string') {
                metadata = item && item.metadata;
              } else {
                metadata = item.metadata;
              }
              const progress__ = metadata
                ? (metadata?.completed / metadata?.target) * 100
                : 0;
              let progress =
                progress__ > 100 ? 100 : progress__ < 100 ? 0 : progress__;
              progress = progress || 60;
              return (
                <SizeButton
                  onClick={() => {
                    navigation.navigate('ProjectStack', {
                      project_id: item.project_id,
                      role: item.role,
                    });
                  }}>
                  <View style={customStyle.projectCard}>
                    <View
                      style={{
                        width: screenWidth * 0.7 * 0.5,
                        height: screenWidth * 0.3,
                        marginRight: 'auto',
                      }}>
                      <Text numberOfLines={3} style={customStyle.projectName}>
                        {item.name}
                      </Text>

                      <View style={{marginTop: 'auto'}}>
                        <DateComponent
                          date={item.start_date}
                          style={{marginBottom: 6}}
                        />
                        <Text
                          numberOfLines={1}
                          style={{color: '#666', marginBottom: 4}}>
                          {item.address}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <CircularProgress
                        progress={progress} //Check progress above and redefine it
                        radius={50}
                        strokeWidth={10}
                        color="#4caf50"
                      />
                    </View>
                  </View>
                </SizeButton>
              );
            }}
            ListFooterComponent={() => (
              <CreateProjectButton
                authUser={authUser}
                userOrg={userOrg}
                handleCreateProject={handleCreateProject}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

const customStyle = StyleSheet.create({
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth * 0.7,
    height: screenWidth * 0.36,
    backgroundColor: 'white',
    marginRight: 10,
    borderRadius: 16,
    padding: 10,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 'auto',
  },
});

const CreateProjectButton = ({authUser, userOrg, handleCreateProject}) => {
  if (authUser.user_id === userOrg.user_id) {
    return (
      <SizeButton onClick={handleCreateProject}>
        <View activeOpacity={0.8} style={customStyle.projectCard}>
          <Text style={[styles.projectCardHeading, {marginRight: 6}]}>
            New Project
          </Text>
          <FontAwesome6 name="plus" color={'#2d2d2d'} size={20} />
        </View>
      </SizeButton>
    );
  }
  return null;
};

export default ProjectComponent;
