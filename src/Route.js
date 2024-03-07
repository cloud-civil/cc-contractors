import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import {useDispatch, useSelector} from 'react-redux';
import {AUTH_SETTINGS, setToken} from './cc-hooks/src/authSlice';
import {getUserSession} from './apiHooks';
import {authenticateUser, loginFailed} from './cc-hooks/src/authSlice';
import TabNavigator from './screens/TabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignupScreen from './screens/SignupScreen';
import CustomLoader from './components/CustomLoader';
import SelectOrg from './screens/SelectORG';
import {setOrg} from './cc-hooks/src/authSlice';
import ProjectStack from './screens/project/ProjectStack';
import {axiosInstance} from './apiHooks/axiosInstance';
import ContractorDetails from './screens/vendors-and-contractors/ContractorDetails';
import VendorDetails from './screens/vendors-and-contractors/VendorDetails';
import AssetDetails from './screens/org-assets/AssetDetails';
import UserDetails from './screens/org-users/UserDetails';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CodePush from 'react-native-code-push';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

const logErrorToService = async (error, errorInfo, stateToken) => {
  axiosInstance(stateToken, {
    data: JSON.stringify({
      error_title: error.toString(),
      error_stack: errorInfo.componentStack,
      error_from: 'react-native',
    }),
  })
    .post('/createErrorLog')
    .catch(() => {})
    .catch(err => console.error(err));
};

const ErrorBoundary = ({children, stateToken}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.log(error, errorInfo);
      // Log the error to an error reporting service
      logErrorToService(error, errorInfo, stateToken);
      setHasError(true);
    };
    // Assign the error handler
    const errorListener = global.ErrorUtils.setGlobalHandler(handleError);
    return () => {
      // Remove the error handler on unmount
      global.ErrorUtils.setGlobalHandler(errorListener);
    };
  }, []);

  const restartApp = () => {
    CodePush.restartApp();
  };

  if (hasError) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={restartApp}>
          <Ionicons name="reload" size={30} color={'#2d2d2d'} />
        </TouchableOpacity>
        <Text style={{marginTop: 10, marginBottom: 6}}>
          Something went wrong!
        </Text>
        <Text>Please try again</Text>
      </View>
    );
  }
  return <>{children}</>;
};

function AppStack({stateToken}) {
  return (
    <ErrorBoundary stateToken={stateToken}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProjectStack"
            component={ProjectStack}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserDetails"
            component={UserDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AssetDetails"
            component={AssetDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ContractorDetails"
            component={ContractorDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="VendorDetails"
            component={VendorDetails}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}

function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
      .catch(() => {
        dispatch(loginFailed());
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
    return <AuthStack />;
  }
  if (auth === AUTH_SETTINGS.LOGIN_FAILED) {
    return <AuthStack />;
  }
  if (!userOrg) {
    return <SelectOrg authUser={authUser} />;
  }
  if (auth === AUTH_SETTINGS.AUTH_USER) {
    return <AppStack stateToken={stateToken} />;
  }
  return null;
}
