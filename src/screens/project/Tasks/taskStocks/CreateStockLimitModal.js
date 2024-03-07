import {Text, View} from 'react-native';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import CustomModal from '../../../../components/CustomModal';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import {setTaskStocks} from '../../../../cc-hooks/src/taskSlice';
import Toast from 'react-native-toast-message';
import {CustomButton} from '../../../../components/CustomButton';
import Colors from '../../../../styles/Colors';
import Input from '../../../../components/Input';
import CustomDropdown from '../../../../components/CustomDropdown';

const FormComponent = props => {
  const {project_id, setShowModal, activeGroupId} = props;
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user, shallowEqual);
  const token = useSelector(state => state.auth.token, shallowEqual);
  const allTaskStocks = useSelector(
    state => state.task.taskStocks,
    shallowEqual,
  );
  const allTaskStocksOfProject = allTaskStocks[project_id] || [];
  const stocks__ = useSelector(
    state => state.stock.stocks[project_id],
    shallowEqual,
  );
  const stocksAsArray = (stocks__ && stocks__.asArray) || [];
  const [state, setState] = useState({
    stock_id: '',
    quantity: 0,
  });

  const createStockLimitForProjectTask = () => {
    const formData = {
      project_id,
      stock_id: state.stock_id,
      user_id: authUser.user_id,
      quantity: state.quantity,
      group_id: activeGroupId,
    };
    // console.log(formData);
    axiosInstance(token)
      .post('/createStockLimitForProjectTask', formData)
      .then(({data}) => {
        dispatch(
          setTaskStocks({
            project_id,
            data: [...allTaskStocksOfProject, data.data],
          }),
        );
        setShowModal(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Stock limit created succesfully',
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not create stock limit.',
        });
        console.log(
          err,
          '/createStockLimitForProjectTask',
          err?.response?.data?.message,
        );
      });
  };

  return (
    <View style={{marginTop: 10}}>
      {stocksAsArray.length ? (
        <CustomDropdown
          label="Select Material"
          search
          data={stocksAsArray}
          onSelect={item => {
            setState({...state, stock_id: item.stock_id});
          }}
          renderDisplayItem={item => item.name}
        />
      ) : (
        <Text style={{marginVertical: 14}}>
          No material has been added, Create material before.
        </Text>
      )}
      <Input
        value={state.quantity.toString()}
        label="Quantity"
        keyboardType="numeric"
        onChangeText={text => {
          setState({...state, quantity: text});
        }}
      />
      <CustomButton
        buttonStyle={{
          backgroundColor: Colors.primary,
          borderRadius: 8,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
        }}
        onClick={createStockLimitForProjectTask}>
        <Text style={{color: 'white', fontSize: 16}}>Create Stock Limit</Text>
      </CustomButton>
    </View>
  );
};

const CreateStockLimitModal = props => {
  const {showModal, setShowModal} = props;

  return (
    <CustomModal
      title="Set Material Limit"
      visible={showModal}
      closeModal={() => setShowModal(false)}>
      <FormComponent {...props} />
    </CustomModal>
  );
};

export default CreateStockLimitModal;
