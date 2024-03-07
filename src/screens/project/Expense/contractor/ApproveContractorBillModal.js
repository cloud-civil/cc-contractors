import {useState} from 'react';
import {View, Text, Image, FlatList} from 'react-native';
import Colors from '../../../../styles/Colors';
import {CustomButton} from '../../../../components/CustomButton';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useSelector} from 'react-redux';
import {formateAmount} from '../../../../utils';
import CustomModal from '../../../../components/CustomModal';
import Input from '../../../../components/Input';
import Toast from 'react-native-toast-message';
import {IMAGE_URL} from '@env';

const FormComponent = props => {
  const {setActivity, activity, project_id, setRender} = props;
  const userOrg = useSelector(state => state.auth.org);
  const token = useSelector(state => state.auth.token);
  const [amount, setAmount] = useState(
    activity?.approveBill?.amount.toString(),
  );
  const images = activity?.approveBill?.images
    ? JSON.parse(activity?.approveBill?.images)
    : [];

  const approveBill = () => {
    const submitData = {
      amount: parseFloat(amount),
      project_id: parseInt(project_id, 10),
      contractor_id: activity.contractor_id,
      bill_id: activity.approveBill.bill_id,
    };
    axiosInstance(token)
      .post('/expense/contractor/approveContractorPayment', submitData)
      .then(() => {
        setActivity({...activity, approveModal: false});
        setRender(prev => prev + 1);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Bill approved succesfully',
        });
      })
      .catch(err => {
        Toast.show({type: 'error', text1: 'error', text2: 'Failed to approve'});
        console.log(
          err,
          '/expense/vendor/approveMaterialVendorBill',
          err?.response?.data?.message,
        );
      });
  };

  return (
    <View style={{marginTop: 10}}>
      <Text style={{marginBottom: 10}}>
        Amount Payable:{' '}
        <Text style={{fontWeight: '600'}}>
          {formateAmount(activity?.approveBill?.amount) || 'NA'} INR
        </Text>
      </Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: 10}}
        data={images}
        horizontal={true}
        renderItem={({item, index}) => {
          return (
            <View style={{marginRight: 10, position: 'relative'}} key={index}>
              <Image
                source={{
                  uri: `${IMAGE_URL}/project_image/${userOrg.org_id}/${project_id}/thumbnail-${item.fullName}`,
                  headers: {
                    Authorization: token,
                  },
                }}
                style={{width: 60, height: 80, borderRadius: 8}}
              />
            </View>
          );
        }}
      />

      <Input
        value={amount}
        keyboardType="numeric"
        label="Approve Amount"
        onChangeText={setAmount}
      />

      <View style={{flex: 1}}>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}
          onClick={approveBill}>
          <Text style={{color: 'white', fontSize: 16}}>Approve</Text>
        </CustomButton>
      </View>
    </View>
  );
};
export const ApproveContractorBillModal = props => {
  const {activity, setActivity} = props;
  //   console.log(props);

  return (
    <CustomModal
      title="Approve Amount"
      visible={activity.approveModal}
      closeModal={() => {
        setActivity({...activity, approveModal: false});
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
