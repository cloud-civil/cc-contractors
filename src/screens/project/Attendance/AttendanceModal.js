import {Text, TouchableOpacity, View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import DateTimePicker from 'react-native-ui-datepicker';
import styles from '../../../styles/styles';
import {CustomButton} from '../../../components/CustomButton';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import CustomModal from '../../../components/CustomModal';
import Colors from '../../../styles/Colors';
import Input from '../../../components/Input';
import {useState} from 'react';
import {formatDate} from '../../../utils';
import Toast from 'react-native-toast-message';
// import 'dayjs/locale/tr';

const initData = {
  attendance_date: new Date(),
  work_shift: '',
  labourType: '',
  quantity: 0,
  amount: 0,
  remarks: '',
};

const FormComponent = ({setShowModal, contractor, project_id, setRender}) => {
  const token = useSelector(state => state.auth.token);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [labourData, setLabourData] = useState([]);
  const [formData, setFormData] = useState(initData);

  const addLabour = () => {
    setLabourData(prevState => [
      ...prevState,
      {
        labourType: formData.labourType,
        quantity: parseInt(formData.quantity),
        amount: parseFloat(formData.amount),
      },
    ]);
    setFormData({...formData, labourType: '', quantity: 0, amount: 0});
  };

  const resetFields = () => {
    setShowModal(false);
    setDatePickerVisible(false);
    setLabourData([]);
    setFormData(initData);
  };

  const handleData = (labourData, formData, project_id) => {
    const finalLabourData = labourData;
    const {labourType, quantity, amount, remarks} = formData;
    if (labourType && quantity && amount) {
      finalLabourData.push({
        labourType,
        quantity: parseInt(quantity),
        amount: parseFloat(amount),
      });
    }
    let totalAmount = 0;
    finalLabourData.forEach(f => {
      totalAmount += f.quantity * f.amount;
    });
    const {attendance_date, work_shift} = formData;
    return {
      project_id: parseInt(project_id),
      contractor_id: parseInt(contractor.contractor_id),
      attendance_date: attendance_date,
      work_shift,
      labours: finalLabourData,
      verification: JSON.stringify({
        verified_id: null,
        verified: false,
      }),
      metadata: JSON.stringify({
        totalAmount,
        paid: 0,
        labourData: finalLabourData,
      }),
      totalAmount,
      remarks,
    };
  };

  const markAttendance = () => {
    const data = handleData(labourData, formData, project_id);
    // console.log(data);
    axiosInstance(token)
      .post('/createVendorsAttendance', data)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Attendance created succesfully.',
        });
        setRender(prev => prev + 1);
        resetFields();
      })
      .catch(err => {
        Toast.show({
          type: 'success',
          text1: 'Failed',
          text2: 'Failed to create attendance.',
        });
        console.log(
          err,
          '/createVendorsAttendance',
          err?.response?.data?.message,
        );
      });
  };

  return (
    <View style={{paddingTop: 20}}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.dateButton,
          isDatePickerVisible
            ? {borderColor: Colors.primary, borderWidth: 1.5}
            : null,
        ]}
        onPress={() => {
          setDatePickerVisible(!isDatePickerVisible);
        }}>
        <Text style={styles.dateLabel}>Attendance Date</Text>
        <Text style={styles.date}>{formatDate(formData.attendance_date)}</Text>
      </TouchableOpacity>
      {isDatePickerVisible && (
        <View>
          <DateTimePicker
            mode="date"
            // locale={'hi'}
            maximumDate={new Date()}
            value={formData.attendance_date}
            onValueChange={date => {
              console.log(date);
              setFormData({
                ...formData,
                attendance_date: new Date(date).toJSON(),
              });
              setDatePickerVisible(false);
            }}
          />
        </View>
      )}
      <View
        style={{
          borderBottomWidth: 0.8,
          borderBottomColor: '#aaa',
          marginBottom: 8,
          paddingBottom: 4,
        }}>
        <RadioButton.Group
          onValueChange={item => setFormData({...formData, work_shift: item})}
          value={formData.work_shift}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{marginRight: 10}}>Work Shift</Text>
            <RadioButton value={'day'} color={Colors.primary} />
            <Text style={{marginRight: 8}}>Day</Text>
            <RadioButton value={'night'} color={Colors.primary} />
            <Text>Night</Text>
          </View>
        </RadioButton.Group>
      </View>

      {labourData.length > 0 ? (
        <View style={{}}>
          {labourData.map((labour, index) => {
            return (
              <View
                key={index}
                onClick={() => {
                  setLabourData(prevState => {
                    return prevState.filter(
                      x => x.labourType !== labour.labourType,
                    );
                  });
                }}
                style={{
                  borderBottomWidth: 1,
                  paddingBottom: 6,
                  marginBottom: 6,
                  borderBottomColor: '#aaa',
                }}>
                <Text>
                  {labour.quantity} {labour.labourType}{' '}
                  {labour.quantity > 1 ? 'workers' : 'worker'}
                </Text>
                <Text>
                  Per {labour.labourType} worker is given {labour.amount} INR.
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <View style={{width: '49%'}}>
          <Input
            value={formData.quantity.toString()}
            label="How many labour ?"
            onChangeText={text => setFormData({...formData, quantity: text})}
            keyboardType="numeric"
          />
        </View>
        <View style={{width: '49%'}}>
          <Input
            value={formData.amount.toString()}
            label="Amount per labour"
            onChangeText={text => setFormData({...formData, amount: text})}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Input
          value={formData.labourType}
          label="Labour Type"
          onChangeText={text => setFormData({...formData, labourType: text})}
        />
        <View style={{width: '40%'}}>
          <CustomButton
            buttonStyle={{
              backgroundColor: '#f2f2f2',
              borderRadius: 8,
              marginTop: -4,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 14,
              marginLeft: 10,
              borderWidth: 1,
              borderColor: '#ccc',
            }}
            onClick={addLabour}>
            <Text style={{color: '#2d2d2d', fontSize: 16}}>Add Labour</Text>
            {/* <MaterialCommunityIcons
        name="account-multiple-plus"
        size={22}
        color={'white'}
      /> */}
          </CustomButton>
        </View>
      </View>

      <Input
        value={formData.remarks}
        label="Remarks"
        onChangeText={text => setFormData({...formData, remarks: text})}
      />

      <CustomButton
        buttonStyle={{
          backgroundColor: Colors.primary,
          borderRadius: 8,
          marginTop: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
        }}
        onClick={markAttendance}>
        <Text style={{color: 'white', fontSize: 16, marginRight: 10}}>
          Mark Attendance
        </Text>
      </CustomButton>
    </View>
  );
};
const AttendanceModal = props => {
  const {showModal, setShowModal} = props;

  return (
    <CustomModal
      title={'Give Attendance'}
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default AttendanceModal;
