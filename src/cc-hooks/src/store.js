import {configureStore} from '@reduxjs/toolkit';
import auth from './authSlice';
import viewSlice from './viewSlice';
import sideNavSlice from './sideNavSlice';
import appSlice from './appSlice';
import taskSlice from './taskSlice';
import stockSlice from './stockSlice';
import projectSlice from './projectSlice';
import imageSlice from './imageSlice';

export default configureStore({
  reducer: {
    auth: auth,
    view: viewSlice,
    sideNav: sideNavSlice,
    app: appSlice,
    task: taskSlice,
    stock: stockSlice,
    project: projectSlice,
    image: imageSlice,
  },
});
