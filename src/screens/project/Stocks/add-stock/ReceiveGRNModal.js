import {useState} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import styles from '../../../../styles/styles';
import Colors from '../../../../styles/Colors';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from 'react-native-ui-datepicker';
import {formatDate} from '../../../../utils';
import {
  CustomFormButton,
  CustomFormIconButton,
} from '../../../../components/CustomButton';
import {resetImages} from '../../../../cc-hooks/src/imageSlice';
import CustomModal from '../../../../components/CustomModal';
import Input from '../../../../components/Input';
import {takePicture} from '../../../../utils/camera';
import LocationComponent from '../../../../components/LocationComponent';
import UploadImageComponent from '../../../../components/UploadImageComponent';
import useReceiveGRN from './hooks/useReceiveGRN';
import CustomDropdown from '../../../../components/CustomDropdown';

const initLocation = {
  latitude: null,
  longitude: null,
  address: '',
};

const FormComponent = props => {
  const {project_id, activity, setActivity, vendors, stocksArray} = props;

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const stocksObject__ = useSelector(state => state.stock.stocks, shallowEqual);
  const stocksObject =
    (stocksObject__[project_id] && stocksObject__[project_id].asObject) || [];
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const uploadedUrls = useSelector(
    state => state.image.uploadedUrls,
    shallowEqual,
  );

  const [quantity, setQuantity] = useState('');
  const [vehicle_no, setVehicleNo] = useState('');
  const [location, setLocation] = useState(initLocation);
  const [vendor_id, setVendorId] = useState('');
  const [stock_id, setStockId] = useState('');
  const [receivedTime, setReceivedTime] = useState(new Date());
  const [has_invoice, setHasInvoice] = useState(0);

  const [isReceivedTimePickerVisible, setReceivedTimePickerVisible] =
    useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const handleTakePicture = async () => {
    takePicture(
      project_id,
      token,
      userOrg.org_id,
      dispatch,
      setImageUploadLoading,
      uploadedUrls,
    );
  };

  const resetFields = () => {
    setActivity(prev => ({...prev, showReceiveGRNModal: false}));
    dispatch(resetImages());
    setQuantity(0);
    setVehicleNo('');
    setLocation(initLocation);
    setReceivedTime(new Date());
    setHasInvoice(0);
  };

  const formData = {
    quantity,
    receivedTime,
    vehicle_no,
    has_invoice,
    location,
    vendor_id,
    stock_id,
  };

  const {receiveGrn, isReceiving} = useReceiveGRN({
    formData,
    token,
    activity,
    setActivity,
    userOrg,
    project_id,
    resetFields,
    uploadedUrls,
  });

  return (
    <View style={{marginTop: 10}}>
      <CustomDropdown
        label="Select Material"
        data={stocksArray}
        onSelect={item => setStockId(item.stock_id)}
        renderDisplayItem={item => item.name}
      />
      <CustomDropdown
        label="Select Vendor"
        data={vendors}
        onSelect={item => setVendorId(item.vendor_id)}
        renderDisplayItem={item => item.name}
      />
      {stocksObject && activity.activeGRN && (
        <View style={{paddingBottom: 10}}>
          <View style={{}}>
            <Text>
              Item:{' '}
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                {stocksObject[activity.activeGRN.stock_id.toString()].name}
              </Text>
            </Text>
          </View>
          <View style={{marginVertical: 5}}>
            <Text style={{marginBottom: 4}}>
              Ordered Quantity:{' '}
              <Text style={{fontWeight: 'bold'}}>
                {activity.activeGRN.quantity}{' '}
                {stocksObject[activity.activeGRN.stock_id.toString()].unit}
              </Text>{' '}
            </Text>
            <Text>
              Total Received:{' '}
              <Text style={{fontWeight: 'bold'}}>
                {activity.activeGRN.received}{' '}
                {stocksObject[activity.activeGRN.stock_id.toString()].unit}
              </Text>{' '}
            </Text>
          </View>
        </View>
      )}

      <View>
        <Input
          value={quantity.toString()}
          label="Received Quantity"
          keyboardType="numeric"
          onChangeText={setQuantity}
        />
        <Input
          value={vehicle_no}
          label="Vehicle Number"
          autoCapitalize="characters"
          onChangeText={setVehicleNo}
        />

        <LocationComponent setLocation={setLocation} location={location} />

        <View
          style={{
            flexDirection: 'row',
            marginTop: 6,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                width: '84%',
                borderColor: isReceivedTimePickerVisible
                  ? Colors.primary
                  : '#bbb',
              },
            ]}
            onPress={() =>
              setReceivedTimePickerVisible(!isReceivedTimePickerVisible)
            }>
            <Text style={styles.dateLabel}>Received Time</Text>
            <Text style={styles.date}>{formatDate(receivedTime)}</Text>
          </TouchableOpacity>

          <CustomFormIconButton
            disabled={imageUploadLoading}
            style={{marginRight: 0}}
            onClick={handleTakePicture}>
            <MaterialIcons name="camera-alt" size={22} color={'white'} />
          </CustomFormIconButton>
        </View>
        <RadioButton.Group
          onValueChange={newValue => setHasInvoice(newValue)}
          value={has_invoice}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              marginBottom: 8,
            }}>
            <Text style={{color: 'black', marginRight: 10}}>Has Invoice ?</Text>
            <View
              style={{
                borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
                borderBottomColor: Colors.primary,
              }}>
              <RadioButton value={1} color={Colors.primary} />
            </View>
            <Text style={{marginRight: 8}}>Yes</Text>
            <View
              style={{
                borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
                borderBottomColor: Colors.primary,
              }}>
              <RadioButton value={0} color={Colors.primary} />
            </View>
            <Text>No</Text>
          </View>
        </RadioButton.Group>

        {isReceivedTimePickerVisible && (
          <View>
            <DateTimePicker
              value={receivedTime}
              onValueChange={date => {
                setReceivedTime(date);
                setReceivedTimePickerVisible(false);
              }}
            />
          </View>
        )}
        <UploadImageComponent
          imageUploadLoading={imageUploadLoading}
          token={token}
        />
      </View>

      <View>
        <CustomFormButton
          loading={isReceiving}
          onClick={receiveGrn}
          disabled={imageUploadLoading}>
          <Text style={{color: 'white', fontSize: 16}}>Receive</Text>
        </CustomFormButton>
      </View>
    </View>
  );
};
export const ReceiveGRNModal = props => {
  const {activity, setActivity} = props;
  const dispatch = useDispatch();

  return (
    <CustomModal
      title="Receive GRN"
      visible={activity.showReceiveGRNModal}
      closeModal={() => {
        dispatch(resetImages());
        setActivity(prev => ({...prev, showReceiveGRNModal: false}));
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
