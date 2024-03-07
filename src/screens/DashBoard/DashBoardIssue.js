/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import Tabs from '../../components/Tabs';
import InProgressIssue from './InProgressIssue';
import NewIssues from './NewIssues';
import DoneIssues from './DoneIssues';
import {UpdateIssueModal} from '../project/Issues/UpdateIssueModal';

const DashBoardIssue = ({project_id}) => {
  const token = useSelector(state => state.auth.token);
  const tabs = ['New Issues', 'In Progress', 'Done'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showUpdateIssueModal, setShowUpdateIssueModal] = useState(false);
  const [activeIssue, setActiveIssue] = useState(null);
  const [issuesData, setIssuesState] = useState({
    newIssues: [],
    updatedIssues: [],
    doneIssues: [],
  });

  const props = {
    setActiveIssue,
    setShowUpdateIssueModal,
    issuesData,
  };

  useEffect(() => {
    axiosInstance(token)
      .get(`/getAllIssuesByProjectId?project_id=${project_id}`)
      .then(res => {
        setIssuesState({
          newIssues: res.data.data.newIssues,
          updatedIssues: res.data.data.updatedIssues,
          doneIssues: res.data.data.doneIssues,
        });
      })
      .catch(err => console.error(err));
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
        Issues
      </Text>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          height: 300,
          padding: 10,
        }}>
        <Tabs
          numOfTab={3}
          data={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          minusWidth={40}
        />
        {activeTab === tabs[0] && <NewIssues {...props} />}
        {activeTab === tabs[1] && <InProgressIssue {...props} />}
        {activeTab === tabs[2] && <DoneIssues {...props} />}
      </View>
      {activeIssue && (
        <UpdateIssueModal
          project_id={project_id}
          showModal={showUpdateIssueModal}
          setShowModal={setShowUpdateIssueModal}
          activeIssue={activeIssue}
        />
      )}
    </View>
  );
};

export default DashBoardIssue;
