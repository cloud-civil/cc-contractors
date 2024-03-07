import {useState} from 'react';
import CustomModal from '../../../components/CustomModal';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../../../styles/styles';
import Colors from '../../../styles/Colors';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  CustomFormButton,
  CustomFormIconButton,
} from '../../../components/CustomButton';
import {formatDate} from '../../../utils';
import DateTimePicker from 'react-native-ui-datepicker';
import Input from '../../../components/Input';
import {takePicture} from '../../../utils/camera';
import {resetImages} from '../../../cc-hooks/src/imageSlice';
import useCreateIssue from './hooks/useCreateIssue';
import UploadImageComponent from '../../../components/UploadImageComponent';
import CustomDropdown from '../../../components/CustomDropdown';

export const FormComponent = ({
  setActivity,
  project_id,
  activity,
  token,
  userOrg,
}) => {
  const dispatch = useDispatch();
  const orgUsers = useSelector(state => state.app.users.asArray, shallowEqual);

  const uploadedUrls = useSelector(
    state => state.image.uploadedUrls,
    shallowEqual,
  );
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const initData = {
    issue_name: '',
    org_id: userOrg.org_id,
    description: '',
    priority: '',
    start_date: new Date(),
    end_date: new Date(),
    status: '',
    assigned_to: '',
    assigned_by: orgUsers[0]?.user_id || '',
    project_id: project_id,
  };
  const [formData, setFormData] = useState(initData);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const handleTakePicture = async () => {
    takePicture(
      project_id,
      token,
      userOrg.org_id,
      dispatch,
      setImageUploadLoading,
    );
  };

  const {createIssue, isCreating} = useCreateIssue(
    token,
    activity,
    setActivity,
    uploadedUrls,
    formData,
    setFormData,
    initData,
    dispatch,
  );

  return (
    <View style={{marginTop: 10}}>
      <View>
        <Input
          value={formData.issue_name}
          label="Issue Name"
          onChangeText={text => setFormData({...formData, issue_name: text})}
        />
        <Input
          value={formData.description}
          label="Description"
          onChangeText={text => setFormData({...formData, description: text})}
        />

        <CustomDropdown
          label="Select Priority"
          search
          data={['low', 'medium', 'high']}
          onSelect={item => {
            setFormData({
              ...formData,
              priority: item,
            });
          }}
        />

        <CustomDropdown
          label="Select status"
          data={['idle', 'in_progress', 'on_hold', 'completed']}
          onSelect={item => {
            setFormData({
              ...formData,
              status: item,
            });
          }}
          renderDisplayItem={item => {
            const text =
              item === 'idle'
                ? 'Idle'
                : item === 'in_progress'
                ? 'In progress'
                : item === 'done'
                ? 'Done'
                : item === 'on_hold'
                ? 'On hold'
                : 'Select status';
            return text;
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              width: '49%',
              marginTop: 6,
              borderColor: isStartDatePickerVisible ? Colors.primary : '#bbb',
            },
          ]}
          onPress={() => {
            if (isEndDatePickerVisible) {
              setEndDatePickerVisible(false);
            }
            setStartDatePickerVisible(!isStartDatePickerVisible);
          }}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.date}>{formatDate(formData.start_date)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              width: '49%',
              marginTop: 6,
              borderColor: isEndDatePickerVisible ? Colors.primary : '#bbb',
            },
          ]}
          onPress={() => {
            if (isStartDatePickerVisible) {
              setStartDatePickerVisible(false);
            }
            setEndDatePickerVisible(!isEndDatePickerVisible);
          }}>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.date}>{formatDate(formData.end_date)}</Text>
        </TouchableOpacity>
      </View>

      {isStartDatePickerVisible && (
        <View>
          <DateTimePicker
            value={formData.start_date}
            onValueChange={date => {
              setFormData({...formData, start_date: date});
              setStartDatePickerVisible(false);
            }}
          />
        </View>
      )}
      {isEndDatePickerVisible && (
        <View>
          <DateTimePicker
            value={formData.end_date}
            onValueChange={date => {
              setFormData({...formData, end_date: date});
              setEndDatePickerVisible(false);
            }}
          />
        </View>
      )}

      <View>
        <CustomDropdown
          label="Assign user"
          data={orgUsers}
          onSelect={item => {
            setFormData({
              ...formData,
              assigned_to: item.user_id,
            });
          }}
          renderDisplayItem={item => {
            return item.fname + ' ' + item.lname;
          }}
        />
      </View>

      <UploadImageComponent
        imageUploadLoading={imageUploadLoading}
        token={token}
      />

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CustomFormIconButton onClick={handleTakePicture}>
          <MaterialIcons name="camera-alt" size={22} color={'white'} />
        </CustomFormIconButton>
        <View style={{flex: 1}}>
          <CustomFormButton onClick={createIssue} loading={isCreating}>
            <Text style={{color: 'white', fontSize: 16}}>Create Issue</Text>
          </CustomFormButton>
        </View>
      </View>
    </View>
  );
};

export const AddIssueModal = props => {
  const {activity, setActivity} = props;
  const dispatch = useDispatch();
  return (
    <CustomModal
      title="Add Issue"
      visible={activity.addIssueModal}
      closeModal={() => {
        setActivity(prev => ({...prev, addIssueModal: false}));
        dispatch(resetImages());
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
