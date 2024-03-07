import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AUTH_SETTINGS, setToken} from './cc-hooks/src/authSlice';
import {getUserSession} from './apiHooks';
import {authenticateUser, loginFailed} from './cc-hooks/src/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomLoader from './components/CustomLoader';
import SelectOrg from './screens/SelectORG';
import {setOrg} from './cc-hooks/src/authSlice';
import AppStack from './screens/stacks/Appstack';
import AuthStack from './screens/stacks/AuthStack';

const getToken = async () => {
  const token = await AsyncStorage.getItem('AUTH_TOKEN');
  return token;
};

export default function Route() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth.authStatus);
  const authUser = useSelector(state => state.auth.user);
  const userOrg = useSelector(state => state.auth.org);
  const [stateToken, setStateToken] = useState('');

  useEffect(() => {
    if (auth === AUTH_SETTINGS.INIT) {
      getApi();
    }
    if (auth === AUTH_SETTINGS.AUTH_USER) {
      getUserOrg();
    }
  }, [auth]);

  const getApi = async () => {
    const token = await getToken();
    if (token) {
      dispatch(setToken(token));
      setStateToken(token);
    }
    getUserSession(token)
      .then(({data}) => {
        dispatch(
          authenticateUser({
            user: data.data,
            token: data.token,
          }),
        );
        setStateToken(data.token);
      })
      .catch(err => {
        dispatch(loginFailed());
        console.log(err, 'getUserSession');
      });
  };

  const getUserOrg = async () => {
    const data = await AsyncStorage.getItem('USER_ORG');
    if (data) {
      dispatch(setOrg(JSON.parse(data)));
    }
  };

  if (auth === AUTH_SETTINGS.INIT) {
    return <CustomLoader loading={true} />;
  }
  if (auth === AUTH_SETTINGS.AUTH_LOGIN) {
    return <AuthStack stateToken={stateToken} />;
  }
  if (auth === AUTH_SETTINGS.LOGIN_FAILED) {
    return <AuthStack stateToken={stateToken} />;
  }
  if (!userOrg) {
    return <SelectOrg authUser={authUser} />;
  }
  if (auth === AUTH_SETTINGS.AUTH_USER) {
    return <AppStack stateToken={stateToken} />;
  }
  return null;
}
