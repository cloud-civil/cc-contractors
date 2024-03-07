import React, {useState} from 'react';
import {
  View,
  Text,
  // StatusBar,
  // TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {loginRequest} from '../apiHooks';
import {useDispatch} from 'react-redux';
import {authenticateUser} from '../cc-hooks/src/authSlice';
import {CustomButton} from '../components/CustomButton';
import Colors from '../styles/Colors';
import Toast from 'react-native-toast-message';
import Input from '../components/Input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const __data = {phone, password};
    loginRequest(__data)
      .then(({data}) => {
        dispatch(
          authenticateUser({
            user: data.data,
            token: data.token,
          }),
        );
      })
      .catch(err => {
        console.log(
          err,
          '/login',
          err?.response?.data?.message,
          JSON.stringify(err),
        );
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: err?.response?.data?.message,
        });
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <View style={{marginHorizontal: 30, height: 250, flex: 1}}>
        <Text style={{fontWeight: 600, fontSize: 28}}>Login</Text>
        <View style={{marginVertical: 10, flex: 1}}>
          <Input
            keyboardType="numeric"
            label="Phone Number"
            onChangeText={setPhone}
            maxLength={10}
          />
          <View style={{position: 'relative', flex: 1}}>
            <Input
              label="Password"
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            {password.length ? (
              <View style={{position: 'absolute', right: 14, top: 22}}>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={!showPassword ? 'eye' : 'eye-off'}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
        <CustomButton
          buttonStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}
          onClick={handleLogin}>
          <Text style={{color: 'white', fontSize: 16}}>Login</Text>
        </CustomButton>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Text>Don&apos;t have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{color: Colors.primary}}> Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
