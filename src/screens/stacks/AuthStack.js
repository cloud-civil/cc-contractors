import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../LoginScreen';
import SignupScreen from '../SignupScreen';
import ErrorBoundary from './ErrorBoundary';

const Stack = createNativeStackNavigator();

const AuthStack = ({stateToken}) => {
  return (
    <ErrorBoundary stateToken={stateToken}>
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
    </ErrorBoundary>
  );
};

export default AuthStack;
