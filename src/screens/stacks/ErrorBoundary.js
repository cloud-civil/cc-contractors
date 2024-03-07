import {TouchableOpacity} from 'react-native-gesture-handler';
import {axiosInstance} from '../../apiHooks/axiosInstance';
import {Text, View} from 'react-native';
import CodePush from 'react-native-code-push';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useEffect, useState} from 'react';

const ErrorBoundary = ({children, stateToken}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.log(error, errorInfo);
      logErrorToService(error, errorInfo, stateToken);
      setHasError(true);
    };
    const errorListener = global.ErrorUtils.setGlobalHandler(handleError);
    return () => {
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

const logErrorToService = async (error, errorInfo, stateToken) => {
  axiosInstance(stateToken, {
    data: JSON.stringify({
      error_title: error.toString(),
      error_stack: errorInfo.componentStack,
      error_from: 'react-native',
    }),
  })
    .post('/createErrorLog')
    .catch(err => {
      console.error(err, '/createErrorLog1', err?.response?.data?.message);
    })
    .catch(err =>
      console.error(err, '/createErrorLog', err?.response?.data?.message),
    );
};

export default ErrorBoundary;
