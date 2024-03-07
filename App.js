import React from 'react';
import {Provider} from 'react-redux';
import store from './src/cc-hooks/src/store';
import Route from './src/Route';
import {PaperProvider, DefaultTheme} from 'react-native-paper';
import codePush from 'react-native-code-push';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import toastConfig from './toastConfig';
import {StyleSheet} from 'react-native';

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};

function App() {
  const theme = {
    ...DefaultTheme,
  };
  return (
    <>
      <StatusBar style="dark" />
      <GestureHandlerRootView style={style.gestureHandler}>
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <Route />
          </PaperProvider>
        </Provider>
      </GestureHandlerRootView>
      <Toast config={toastConfig} position="bottom" />
    </>
  );
}

const style = StyleSheet.create({
  gestureHandler: {flex: 1},
});

export default codePush(codePushOptions)(App);
