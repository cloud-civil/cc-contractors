/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {shallowEqual, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {GoBack} from '../../../components/HeaderButtons';
import {View} from 'react-native';
import {Text} from 'react-native';
import IssuesInProgress from './InProgress';
import IssuesOnHold from './OnHold';
import IssuesDone from './Done';
import NewIssues from './NewIssues';
import FloatingButton from '../../../components/FloatingButton';
import {AddIssueModal} from './AddIssueModal';
import {getPermissions} from '../../../utils';
import {useNavigation} from '@react-navigation/native';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import Tabs from '../../../components/Tabs';
import {UpdateIssueModal} from './UpdateIssueModal';
import {EditIssueModal} from './EditIssueModal';
import useDeleteIssue from './hooks/useDeleteIssue';

const tabs = ['New Issues', 'In Progress', 'On Hold', 'Done'];

const IssueNavigation = ({route}) => {
  const {project_id} = route.params;
  const navigation = useNavigation();
  const pems = useSelector(state => state.auth.permissions, shallowEqual);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const users = useSelector(state => state.app.users.asObject, shallowEqual);
  const x = getPermissions(pems, 1025);
  const permission = x && JSON.parse(x.permission);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [activity, setActivity] = useState({
    addIssueModal: false,
    updateIssueModal: false,
    activeIssue: null,
    editIssueModal: false,
    loading: true,
    issuesData: [],
  });

  useEffect(() => {
    axiosInstance(token)
      .get(`/getAllIssuesByOrgId?org_id=${userOrg.org_id}`)
      .then(({data}) => {
        setActivity(prev => ({...prev, issuesData: data.data, loading: false}));
      })
      .catch(err => {
        console.log(err, '/getAllIssuesByOrgId', err?.response?.data?.message);
      });
  }, []);

  const {handleDelete, isDeleting} = useDeleteIssue(
    token,
    userOrg,
    project_id,
    activity,
    setActivity,
  );

  const props = {
    project_id,
    activity,
    setActivity,
    token,
    userOrg,
    users,
    handleDelete,
    isDeleting,
  };

  const renderTabComponents = () => {
    switch (activeTab) {
      case tabs[0]:
        return <NewIssues {...props} />;
      case tabs[1]:
        return <IssuesInProgress {...props} />;
      case tabs[2]:
        return <IssuesOnHold {...props} />;
      case tabs[3]:
        return <IssuesDone {...props} />;
      default:
        return null;
    }
  };

  return (
    <>
      <View style={{paddingTop: 34, backgroundColor: 'white'}} />
      <View
        style={{
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',

          backgroundColor: 'white',
        }}>
        <GoBack onClick={() => navigation.goBack()} />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: '#3e3e3e',
            }}>
            Issues
          </Text>
        </View>
      </View>

      <Tabs
        data={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        numOfTab={4}
        minusWidth={0}
        backgroundColor="white"
        icons={icons}
      />

      {renderTabComponents()}

      {permission && permission.write && (
        <FloatingButton
          buttonStyle={{margin: 10}}
          onClick={() => {
            setActivity(prev => ({...prev, addIssueModal: true}));
          }}>
          <MaterialCommunityIcons
            name="alert-plus-outline"
            color={'white'}
            size={28}
          />
        </FloatingButton>
      )}
      {activity.addIssueModal && <AddIssueModal {...props} />}
      {activity.activeIssue && activity.updateIssueModal && (
        <UpdateIssueModal {...props} />
      )}
      {activity.activeIssue && activity.editIssueModal && (
        <EditIssueModal {...props} />
      )}
    </>
  );
};

const icons = [
  <MaterialCommunityIcons key={0} name="alert-circle-outline" size={20} />,
  <MaterialCommunityIcons key={1} name="progress-clock" size={20} />,
  <MaterialCommunityIcons key={2} name="motion-pause" size={20} />,
  <MaterialCommunityIcons
    key={3}
    name="alert-circle-check-outline"
    size={20}
  />,
];

export default IssueNavigation;
