import {useState} from 'react';
import {
  View,
  Text,
  // StatusBar,
  // TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {CustomButton} from '../components/CustomButton';
import Colors from '../styles/Colors';
import {noAuthAxiosInstance} from '../apiHooks/axiosInstance';
import Toast from 'react-native-toast-message';
import Input from '../components/Input';

const SignupScreen = ({navigation}) => {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [request, setRequest] = useState(false);

  const signup = () => {
    handleVerifyCredentials();
    if (handleVerifyCredentials()) {
      setRequest(true);
      const data = {
        fname,
        lname,
        phone,
        password,
      };

      noAuthAxiosInstance
        .post('/signup', data)
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'You have been successfully signed up.',
          });
          setTimeout(() => {
            navigation.goBack();
            setRequest(false);
          }, 1500);
        })
        .catch(err => {
          setRequest(false);
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: err?.response?.data?.message,
          });
          console.log(
            err,
            '/signup',
            err?.response?.data?.message,
            JSON.stringify(err),
          );
        });
    }
  };

  const handleVerifyCredentials = () => {
    if (fname === '' || fname.length < 3) {
      Toast.show({
        type: 'info',
        text1: 'Invalid Info',
        text2:
          'Please enter a valid First Name that is atleast 3 character long.',
      });
    }

    if (phone.length !== 10) {
      Toast.show({
        type: 'info',
        text1: 'Invalid Info',
        text2: 'Please enter a valid 10 digit Phone Number.',
      });
    }
    if (password.length < 6) {
      Toast.show({
        type: 'info',
        text1: 'Invalid Info',
        text2: 'Please enter a password that is atleast 6 character long.',
      });
    }
    return true;
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <View style={{flex: 1, marginHorizontal: 30, height: 380}}>
        <Text style={{fontWeight: 600, fontSize: 28}}>Sign Up</Text>
        <View style={{marginVertical: 10, flex: 1}}>
          <Input value={fname} label="First Name" onChangeText={setFName} />
          <Input value={lname} label="Last Name" onChangeText={setLName} />
          <Input
            value={phone}
            label="Phone Number"
            keyboardType="numeric"
            onChangeText={setPhone}
          />
          <Input
            value={password}
            label="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>

        <CustomButton
          buttonStyle={{
            backgroundColor: request ? '#9BCDFF' : Colors.primary,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}
          disabled={request === true || false}
          onClick={signup}>
          <Text style={{color: 'white', fontSize: 16}}>
            {request ? 'Signing up...' : 'Sign Up'}
          </Text>
        </CustomButton>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Text>Already have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{color: Colors.primary}}> Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
