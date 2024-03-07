import {useState} from 'react';
import {View, Text} from 'react-native';
import CustomModal from '../../components/CustomModal';
import Colors from '../../styles/Colors';
import {CustomButton} from '../../components/CustomButton';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import {setUsers} from '../../cc-hooks/src/appSlice';
import Input from '../../components/Input';

const FormComponent = ({setShowModal}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const orgUsers = useSelector(state => state.app.users.asArray);
  const userOrg = useSelector(state => state.auth.org);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');

  const handleSuccess = data => {
    dispatch(
      setUsers([
        ...orgUsers,
        {
          fname,
          lname,
          phone,
          org_id: userOrg.org_id,
          user_id: data.data.user_id,
        },
      ]),
    );
    setShowModal(false);
    resetFields();
    alert('User has been created and added to organization');
  };

  const resetFields = () => {
    setFname('');
    setLname('');
    setPhone('');
  };

  const handleAddUser = () => {
    if (phone.length >= 10) {
      axiosInstance(token)
        .post('/addUser', {
          fname,
          lname,
          phone,
          org_id: userOrg.org_id,
        })
        .then(({data}) => {
          handleSuccess(data);
        })
        .catch(() => {
          setShowModal(false);
          resetFields();
          alert('Could not create user.');
        });
    }
  };

  return (
    <View style={{marginTop: 10}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: '49%'}}>
          <Input value={fname} label="Frist name" onChangeText={setFname} />
        </View>
        <View style={{width: '49%'}}>
          <Input value={lname} label="Last Name" onChangeText={setLname} />
        </View>
      </View>
      <Input value={phone} label="Phone Number" onChangeText={setPhone} />
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
          onClick={handleAddUser}>
          <Text style={{color: 'white', fontSize: 16}}>Add User</Text>
        </CustomButton>
      </View>
    </View>
  );
};
export const AddUserModal = props => {
  const {showModal, setShowModal} = props;

  return (
    <CustomModal
      title="Add User"
      visible={showModal}
      closeModal={() => setShowModal(false)}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
