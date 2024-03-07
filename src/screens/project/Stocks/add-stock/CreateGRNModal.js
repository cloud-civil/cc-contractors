import {useState} from 'react';
import {Text, View} from 'react-native';

import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {CustomFormButton} from '../../../../components/CustomButton';
import CustomModal from '../../../../components/CustomModal';
import Input from '../../../../components/Input';
import CustomDropdown from '../../../../components/CustomDropdown';
import useCreateGRN from './hooks/useCreateGRN';

const FormComponent = props => {
  const {project_id, setActivity} = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token, shallowEqual);
  const userOrg = useSelector(state => state.auth.org, shallowEqual);
  const grns = useSelector(state => state.app.grns[project_id], shallowEqual);
  const stocks__ = useSelector(state => state.stock.stocks, shallowEqual);
  const stocks = (stocks__[project_id] && stocks__[project_id].asArray) || [];

  const [formData, setFormData] = useState({
    stock_id: null,
    quantity: 0,
  });

  const {createGRN, isCreating} = useCreateGRN({
    formData,
    setFormData,
    token,
    setActivity,
    dispatch,
    userOrg,
    project_id,
    grns,
  });

  return (
    <View style={{marginTop: 10}}>
      <View>
        {stocks.length ? (
          <CustomDropdown
            label="Select Material"
            data={stocks}
            onSelect={item => {
              setFormData(prev => ({...prev, stock_id: item.stock_id}));
            }}
            renderDisplayItem={item => item.name}
          />
        ) : (
          <Text style={{marginVertical: 14}}>
            No material has been added, Create material before.
          </Text>
        )}

        <Input
          value={formData.quantity.toString()}
          label="Order Quantity"
          onChangeText={text => {
            setFormData(prev => ({...prev, quantity: text}));
          }}
          keyboardType="numeric"
        />
      </View>

      <View>
        <CustomFormButton onClick={createGRN} loading={isCreating}>
          <Text style={{color: 'white', fontSize: 16}}>Create GRN</Text>
        </CustomFormButton>
      </View>
    </View>
  );
};
export const CreateGRNModal = props => {
  const {activity, setActivity} = props;
  return (
    <CustomModal
      title="Create GRN"
      visible={activity.showCreateGRNModal}
      closeModal={() =>
        setActivity(prev => ({...prev, showCreateGRNModal: false}))
      }>
      <FormComponent {...props} />
    </CustomModal>
  );
};
