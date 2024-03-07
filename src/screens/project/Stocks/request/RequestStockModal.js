import {Text, View} from 'react-native';
import CustomModal from '../../../../components/CustomModal';
import {useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import Toast from 'react-native-toast-message';
import Input from '../../../../components/Input';
import CustomDropdown from '../../../../components/CustomDropdown';

const FormComponent = ({setActivity, project_id, reRender, setRender}) => {
  const token = useSelector(state => state.auth.token, shallowEqual);
  const stocks = useSelector(
    state => state.stock.stocks[project_id],
    shallowEqual,
  );

  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const [stock, setStock] = useState('');
  const [quantity, setQuantity] = useState('');

  const requestStock = () => {
    if (!stock.stock_id || !quantity) {
      Toast.show({
        type: 'info',
        text1: 'Failed',
        text2: 'Stock name cannot be empty',
      });
      return;
    }
    const ccStock = {
      quantity: quantity,
      project_id: parseInt(project_id, 10),
      stock_id: parseInt(stock.stock_id, 10),
      org_id: userOrg.org_id,
      verification: JSON.stringify({
        verified: false,
        verified_by: null,
      }),
    };
    axiosInstance(token)
      .post('/requestStocksForProject', ccStock)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Created stock request succesfully.',
        });
        setRender(reRender + 1);
        setActivity(prev => ({...prev, showRequestStockModal: false}));
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not create stock request.',
        });
        setActivity(prev => ({...prev, showRequestStockModal: false}));
      });
  };
  return (
    <View style={{marginTop: 10}}>
      {stocks.asArray.length ? (
        <CustomDropdown
          label="Select Material"
          data={stocks.asArray}
          onSelect={item => {
            setStock(item);
          }}
          renderDisplayItem={item => {
            return item.name;
          }}
        />
      ) : (
        <Text style={{marginVertical: 10}}>
          No material has been added, Create material before.
        </Text>
      )}
      <Input
        value={quantity.toString()}
        label={`Quantity${
          stock ? ' (' + stocks.asObject[stock.stock_id].unit + ')' : ''
        }`}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <CustomButton
        buttonStyle={{
          backgroundColor: Colors.primary,
          borderRadius: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
        }}
        onClick={requestStock}>
        <Text style={{color: 'white', fontSize: 16}}>Request</Text>
      </CustomButton>
    </View>
  );
};
const RequestStockModal = props => {
  const {activity, setActivity} = props;

  return (
    <CustomModal
      title={'Request Material'}
      visible={activity.showRequestStockModal}
      closeModal={() =>
        setActivity(prev => ({...prev, showRequestStockModal: false}))
      }>
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default RequestStockModal;
