import {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import Colors from '../../../styles/Colors';
import {CustomButton} from '../../../components/CustomButton';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import CustomModal from '../../../components/CustomModal';
import Toast from 'react-native-toast-message';
import Input from '../../../components/Input';
import CustomDropdown from '../../../components/CustomDropdown';

const FormComponent = props => {
  const {setActivity, activity, token} = props;
  const [updateState, setUpdateState] = useState({
    issue_name: '',
    description: '',
    status: '',
  });

  useEffect(() => {
    if (activity.activeIssue) {
      setUpdateState({
        issue_name: activity.activeIssue.issue_name,
        description: activity.activeIssue.description,
        status: activity.activeIssue.status,
      });
    }
  }, [activity.activeIssue]);

  const handleEditIssue = () => {
    const updateState__ = {
      issue_name: updateState.issue_name,
      description: updateState.description,
      status: updateState.status,
    };

    axiosInstance(token)
      .post(`update-issue/${activity.activeIssue.issue_id}`, updateState__)
      .then(({data}) => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Issue has been updated succesfully.',
        });
        const newArr = activity.issuesData.map(item => {
          if (item.issue_id === activity.activeIssue.issue_id) {
            return data;
          }
          return item;
        });
        setActivity(prev => ({
          ...prev,
          issuesData: newArr,
          editIssueModal: false,
        }));
      })
      .catch(err => {
        console.error(err, 'update-issue/', err?.response?.data?.message);
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Unable to update issue.',
        });
      });
  };
  return (
    <View style={{marginTop: 10}}>
      <View>
        <Input
          value={updateState.issue_name}
          label="Issue Name"
          onChangeText={text =>
            setUpdateState({...updateState, issue_name: text})
          }
        />
        <Input
          value={updateState.description}
          label="Description"
          onChangeText={text =>
            setUpdateState({...updateState, description: text})
          }
        />

        <CustomDropdown
          label="Select Status"
          data={['idle', 'in_progress', 'on_hold', 'done']}
          onSelect={item => {
            setUpdateState({
              ...updateState,
              status: item,
            });
          }}
          renderDisplayItem={item => {
            const name =
              item === 'idle'
                ? 'Idle'
                : item === 'in_progress'
                ? 'In Progress'
                : item === 'done'
                ? 'Done'
                : item === 'on_hold'
                ? 'On Hold'
                : 'Select Priority';
            return name;
          }}
        />
      </View>

      <View>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}
          onClick={handleEditIssue}>
          <Text style={{color: 'white', fontSize: 16}}>Update Issue</Text>
        </CustomButton>
      </View>
    </View>
  );
};
export const EditIssueModal = props => {
  const {activity, setActivity} = props;
  return (
    <CustomModal
      title="Edit Issue"
      visible={activity.editIssueModal}
      closeModal={() =>
        setActivity(prev => ({...prev, editIssueModal: false}))
      }>
      <FormComponent {...props} />
    </CustomModal>
  );
};
