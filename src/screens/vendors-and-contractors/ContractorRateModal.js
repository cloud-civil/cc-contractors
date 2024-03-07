import {useState} from 'react';
import CustomModal from '../../components/CustomModal';
import {Text, View} from 'react-native';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles/styles';
import Input from '../../components/Input';
import {CustomButton} from '../../components/CustomButton';
import Colors from '../../styles/Colors';
import Toast from 'react-native-toast-message';
import {units} from '../../utils/constants';

const initData = {
  name: '',
  amount: '',
  work_limit: '',
  project_id: '',
  unit: '',
};

const FormComponent = props => {
  const {activeContractor, rates, userOrg, setRates, setShowModal} = props;
  const token = useSelector(state => state.auth.token);
  const projectsArray = useSelector(state => state.project.projects.asArray);
  const [formData, setFormData] = useState(initData);

  const submit = () => {
    const {name, amount, work_limit, project_id, unit} = formData;
    axiosInstance(token)
      .post('/addContractorRate', {
        project_id,
        org_id: userOrg.org_id,
        contractor_id: activeContractor.contractor_id,
        name,
        amount: parseFloat(amount),
        unit,
        work_limit: parseFloat(work_limit),
      })
      .then(({data}) => {
        setRates([...rates, data.data]);
        setShowModal(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Rate added succesfully.',
        });
      })
      .catch(err => {
        setShowModal(false);
        Toast.show({
          type: 'error',
          text1: 'Faild',
          text2: 'Could not add rate.',
        });
        console.log(err, '/addContractorRate');
      });
  };
  return (
    <View style={{marginTop: 6}}>
      <SelectDropdown
        buttonStyle={[styles.dropdownButtonStyle, {borderColor: '#bbb'}]}
        defaultButtonText={
          formData.project_id ? formData.project_id : 'Select Project'
        }
        buttonTextStyle={styles.dropdownButtonText}
        renderDropdownIcon={() => (
          <MaterialIcons name="keyboard-arrow-down" size={24} color={'#666'} />
        )}
        dropdownStyle={{
          borderRadius: 8,
        }}
        data={projectsArray}
        onSelect={selectedItem => {
          setFormData({...formData, project_id: selectedItem.project_id});
        }}
        buttonTextAfterSelection={selectedItem => {
          return selectedItem.name;
        }}
        rowTextForSelection={item => {
          return item.name;
        }}
      />
      <Input
        value={formData.name}
        mode={'outlined'}
        label="Rate Name (Slab Casting, 1st Floor)"
        onChangeText={text => setFormData({...formData, name: text})}
      />
      <Input
        value={formData.amount}
        mode={'outlined'}
        label="Amount (In Rupees Per Work Unit)"
        onChangeText={text => setFormData({...formData, amount: text})}
      />
      <Input
        value={formData.work_limit}
        mode={'outlined'}
        keyboardType="numeric"
        label="Work Limit (In Numbers)"
        onChangeText={text => setFormData({...formData, work_limit: text})}
      />
      <SelectDropdown
        buttonStyle={styles.dropdownButtonStyle}
        defaultButtonText="Select Work Unit (Eg: sqft)"
        buttonTextStyle={styles.dropdownButtonText}
        renderDropdownIcon={() => (
          <MaterialIcons name="keyboard-arrow-down" size={24} color={'#666'} />
        )}
        renderSearchInputLeftIcon={() => (
          <MaterialIcons name="search" size={20} />
        )}
        dropdownStyle={{
          borderRadius: 8,
        }}
        data={units}
        onSelect={selectedItem => {
          setFormData({...formData, unit: selectedItem.name});
        }}
        buttonTextAfterSelection={selectedItem => {
          return selectedItem.name;
        }}
        rowTextForSelection={item => {
          return item.name;
        }}
      />
      <CustomButton
        onClick={submit}
        buttonStyle={{
          backgroundColor: Colors.primary,
          borderRadius: 8,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
        }}>
        <Text style={{color: 'white'}}>Add Rate</Text>
      </CustomButton>
    </View>
  );
};

const ContractorRateModal = props => {
  const {showModal, setShowModal} = props;
  return (
    <CustomModal
      title="Set Contractor Rate"
      visible={showModal}
      closeModal={() => setShowModal(false)}>
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default ContractorRateModal;
