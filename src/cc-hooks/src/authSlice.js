import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_SETTINGS = {
  INIT: '99',
  FETCHING: '100',
  FETCHED: '101',
  AUTH_USER: '102',
  LOGIN_FAILED: '103',
  AUTH_LOGIN: '104',
};

const storeData = async payload => {
  try {
    await AsyncStorage.setItem('AUTH_USER', JSON.stringify(payload.user));
    await AsyncStorage.setItem('AUTH_TOKEN', payload.token);
  } catch (e) {
    console.log(e);
  }
};

export const auth = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    authStatus: AUTH_SETTINGS.INIT,
    org: null,
    permissions: null,
  },
  reducers: {
    authenticateUser: (state, param) => {
      const {payload} = param;
      storeData(payload);
      state.token = payload.token;
      state.user = payload.user;
      state.authStatus = AUTH_SETTINGS.AUTH_USER;
    },
    logoutUser: state => {
      state.token = null;
      state.user = null;
      state.authStatus = AUTH_SETTINGS.AUTH_LOGIN;
      state.org = null;
      state.permissions = null;
    },
    loginFailed: state => {
      state.user = null;
      state.authStatus = AUTH_SETTINGS.LOGIN_FAILED;
    },
    setOrg: (state, param) => {
      state.org = param.payload;
    },
    setToken: (state, param) => {
      state.token = param.payload;
    },
    setPermissions: (state, param) => {
      const x = {};
      param.payload.forEach(y => {
        x[y.table_id] = y;
      });
      state.permissions = {
        asObject: x,
        asArray: param.payload,
      };
    },
  },
});

const {actions, reducer} = auth;
export const {
  authenticateUser,
  logoutUser,
  loginFailed,
  setOrg,
  setToken,
  setPermissions,
} = actions;
export default reducer;
