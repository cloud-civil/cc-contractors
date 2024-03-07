import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '../../components/CustomModal';
import {CustomFormButton} from '../../components/CustomButton';
import styles from '../../styles/styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../../styles/Colors';

const FormComponent = ({setShowModal}) => {
  return (
    <View style={{marginTop: 10}}>
      <View style={customStyle.flexRow}>
        <View style={{width: '80%', marginRight: 10}}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>
        <View style={[styles.assIcon, {width: 50, height: 50}]}>
          <MaterialIcons name="upgrade" size={40} color="white" />
        </View>
      </View>
      <View style={customStyle.flexCol}>
        <Text style={{textAlign: 'center', width: '70%'}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        <TouchableOpacity style={{marginTop: 10}}>
          <Text style={{color: Colors.primary}}>Learn more about it</Text>
        </TouchableOpacity>
      </View>
      <View style={customStyle.planBox}>
        <View>
          <Text style={{marginBottom: 4}}>Cloud Civil Pro</Text>
          <Text>
            <Text style={{fontWeight: '600'}}>&#8377;999.00</Text> a month
          </Text>
        </View>
        <View>
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={Colors.primary}
          />
        </View>
      </View>
      <View>
        <CustomFormButton onClick={() => {}}>
          <Text style={{color: 'white', fontSize: 16}}>Upgrade to Pro</Text>
        </CustomFormButton>
        <TouchableOpacity
          style={{marginTop: 16}}
          onPress={() => setShowModal(false)}>
          <Text style={customStyle.notNow}>Not Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PaymentModal = props => {
  const {showModal, setShowModal} = props;
  return (
    <CustomModal
      title={'Cloud Civil Pro'}
      visible={showModal}
      closeModal={() => {
        setShowModal(false);
      }}>
      <FormComponent {...props} />
    </CustomModal>
  );
};

const customStyle = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexCol: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 20,
  },
  planBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    padding: 10,
    borderRadius: 8,
    borderColor: Colors.primary,
    marginBottom: 20,
  },
  notNow: {
    fontWeight: 600,
    color: Colors.primary,
    textAlign: 'center',
  },
});

export default PaymentModal;
