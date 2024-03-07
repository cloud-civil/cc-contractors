import {useState} from 'react';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';

const useDeleteIssue = (token, userOrg, project_id, activity, setActivity) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = item => {
    Alert.alert(
      'Delete !',
      'Are you sure you want to delete this issue ?',
      [
        {
          text: 'No',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => deleteIssue(item),
        },
      ],
      {cancelable: false},
    );
  };

  const deleteIssue = item => {
    axiosInstance(token)
      .post('/deleteIssue', {
        issue_id: item.issue_id,
        org_id: userOrg.org_id,
        project_id,
      })
      .then(() => {
        setActivity(prev => ({
          ...prev,
          issuesData: activity.issuesData.filter(
            i => i.issue_id !== item.issue_id,
          ),
        }));
        setIsDeleting(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Issue has been deleted succesfully.',
        });
      })
      .catch(err => {
        setIsDeleting(false);
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not delete issue.',
        });
        console.log(err, '/deleteIssue', err?.response?.data?.message);
      });
  };

  return {handleDelete, isDeleting};
};

export default useDeleteIssue;
