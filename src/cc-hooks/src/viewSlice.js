import {createSlice} from '@reduxjs/toolkit';

export const viewSlice = createSlice({
  name: 'view',
  initialState: {
    view: '/',
    alert: {
      alertType: '',
      showAlert: false,
      title: '',
      body: '',
    },
  },
  reducers: {
    setView: (state, param) => {
      state.view = param.payload;
    },
    setShowAlert: (state, param) => {
      state.alert = param.payload;
    },
  },
});

const {actions, reducer} = viewSlice;
export const {setView, setShowAlert} = actions;
export default reducer;
