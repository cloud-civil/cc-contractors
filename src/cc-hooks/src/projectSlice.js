import {createSlice} from '@reduxjs/toolkit';

export const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: {},
    assets: {},
    permissions: {},
    users: {
      asArray: null,
      asObject: null,
    },
  },
  reducers: {
    setProjects: (state, params) => {
      let x = {};
      params.payload.forEach(y => {
        x[y.project_id] = y;
      });
      state.projects = {
        asArray: params.payload,
        asObject: x,
      };
    },
    setProjectAssets: (state, params) => {
      const {project_id, data} = params.payload;
      state.assets[project_id] = {
        asArray: data,
        asObject: null,
      };
    },
    setProjectPermissions: (state, params) => {
      const {project_id, data} = params.payload;
      state.permissions[project_id] = {
        asArray: data,
        asObject: null,
      };
    },
    setProjectUsers: (state, params) => {
      state.users.asArray = params.payload.asArray;
      state.users.asObject = params.payload.asObject;
    },
    addProjectUsers: (state, params) => {
      const {user} = params.payload;
      state.users.asArray.push(user);
      state.users.asObject[user.user_id] = user;
    },
    removeProjectUsers: (state, params) => {
      const {user} = params.payload;
      const newArray = state.users.asArray.filter(
        item => item.user_id !== user.user_id,
      );
      state.users.asArray = newArray;
      delete state.users.asObject[user.user_id];
    },
    updateAssetEndDate: (state, action) => {
      const currentDate = new Date();
      const {asset_id, project_id} = action.payload;
      const updatedArray =
        state.assets[project_id] &&
        state.assets[project_id].asArray.map(asset =>
          asset.asset_id === asset_id
            ? {...asset, end_date: currentDate.toISOString()}
            : asset,
        );
      state.assets[project_id] = {
        asArray: updatedArray,
        asObject: null,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setProjects,
  setProjectUsers,
  addProjectUsers,
  removeProjectUsers,
  setProjectAssets,
  setProjectPermissions,
  updateAssetEndDate,
} = projectSlice.actions;

export default projectSlice.reducer;
