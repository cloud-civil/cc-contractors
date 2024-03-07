import {useEffect, useState} from 'react';
import {View, Text, Image, FlatList} from 'react-native';
import Colors from '../../../../styles/Colors';
import {CustomButton} from '../../../../components/CustomButton';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import {formateAmount} from '../../../../utils';
import CustomModal from '../../../../components/CustomModal';
import Input from '../../../../components/Input';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {takePicture} from '../../../../utils/camera';
import {ImageLoadingSkeleton} from '../../../../components/Skeleton';
import {IMAGE_URL} from '@env';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {deleteImage, resetImages} from '../../../../cc-hooks/src/imageSlice';
import {calculateTotal} from '../../../../cc-utils/src';

const FormComponent = props => {
  const {setShowModal, project_id, vendor_id, activeBill, reRender, setRender} =
    props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const userOrg = useSelector(state => state.auth.org);
  const uploadedUrls = useSelector(state => state.image.uploadedUrls);

  const [amount, setAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [pgroup_id] = useState(activeBill.bill[0].pgroup_id);

  useEffect(() => {
    const totalPrice = calculateTotal(activeBill.bill).totalPrice;
    setTotalAmount(totalPrice);
    setAmount(totalPrice.toString());
  }, []);

  const handleTakePicture = async () => {
    takePicture(
      project_id,
      token,
      userOrg.org_id,
      dispatch,
      setImageUploadLoading,
    );
  };

  const payBill = () => {
    if (pgroup_id) {
      const x = {
        amount: amount,
        totalAmount,
        project_id: parseInt(project_id, 10),
        vendor_id,
        images: JSON.stringify(uploadedUrls),
        bill_id: pgroup_id,
        status: 'init',
      };

      axiosInstance(token)
        .post('/expense/vendor/initMaterialVendorBill', x)
        .then(() => {
          setShowModal(false);
          setRender(reRender + 1);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Bill created for vendor succesfully.',
          });
        })
        .catch(err => {
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: 'Failed to create bill',
          });
          console.log(
            err,
            '/expense/vendor/payMaterialVendorBill',
            err?.response?.data?.message,
          );
        });
    }
  };

  return (
    <View style={{marginTop: 10}}>
      <Text style={{marginBottom: 10}}>
        Amount Payable:{' '}
        <Text style={{fontWeight: '600'}}>
          {formateAmount(totalAmount) || 0} INR
        </Text>
      </Text>
      <Input
        value={amount}
        keyboardType="numeric"
        label="Initialize Amount"
        onChangeText={setAmount}
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: 10}}
        keyExtractor={item => item.id}
        data={
          imageUploadLoading
            ? [...uploadedUrls, {skeleton: true, id: 10000}]
            : uploadedUrls
        }
        horizontal={true}
        renderItem={({item}) => {
          if (item.skeleton) {
            return <ImageLoadingSkeleton key={item.id} />;
          } else {
            const {data: image} = item;
            return (
              <View
                style={{marginRight: 10, position: 'relative'}}
                key={item.id}>
                <Image
                  source={{
                    uri: `${IMAGE_URL}/previewUploadedImage/thumbnail-${image.fullName}`,
                    headers: {
                      Authorization: token,
                    },
                  }}
                  style={{width: 60, height: 80, borderRadius: 8}}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 18,
                    height: 18,
                  }}>
                  <TouchableOpacity
                    onPress={() => dispatch(deleteImage({id: item.id}))}>
                    <MaterialIcons
                      name="delete-outline"
                      size={18}
                      color={'white'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
        }}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            height: 45,
            width: 45,
            borderRadius: 10,
            marginRight: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={handleTakePicture}>
          <MaterialIcons name="camera-alt" size={22} color={'white'} />
        </CustomButton>
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
            onClick={payBill}>
            <Text style={{color: 'white', fontSize: 16}}>Submit</Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};
export const VendorBillPaymentModal = props => {
  const {showModal, setShowModal} = props;
  const dispatch = useDispatch();
  return (
    <CustomModal
      title="Initialize Vendor Payment"
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
        dispatch(resetImages());
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};
