import {createSlice} from '@reduxjs/toolkit';

const innerState = {
  roles: null,
  assets: {},
  user_roles: {},
  vendors: {
    asArray: null,
    asObject: null,
  },
  users: {
    asArray: null,
    asObject: null,
    hasData: false,
  },
  contractors: {},
  porders: {},
  rorders: {},
  grns: {},
  reRender: 0,
  assetReRender: {
    useRender: 0,
    returnRender: 0,
    brokenRender: 0,
  },
};

export const app = createSlice({
  name: 'app',
  initialState: JSON.parse(JSON.stringify(innerState)),
  reducers: {
    resetState: () => JSON.parse(JSON.stringify(innerState)),
    setOrgAssetsData: (state, params) => {
      state.assets = params.payload.data;
    },
    setUserRolesData: (state, params) => {
      const {project_id, data} = params.payload;
      state.user_roles[project_id] = {
        asArray: data,
        asObject: null,
      };
    },
    setVendorsData: (state, params) => {
      const asObject = {};
      params.payload.forEach(x => {
        asObject[x.vendor_id] = x;
      });
      state.vendors = {
        asArray: params.payload,
        asObject,
      };
    },
    setContractorsData: (state, params) => {
      const asObject = {};
      params.payload.forEach(x => {
        asObject[x.contractor_id] = x;
      });
      state.contractors = {
        asArray: params.payload,
        asObject,
      };
    },
    setUsers: (state, params) => {
      const asObject = {};
      params.payload.forEach(user => {
        asObject[user.user_id] = user;
      });
      state.users = {
        asArray: params.payload,
        asObject,
      };
    },
    setAssets: (state, params) => {
      const asObject = {};
      params.payload.forEach(asset => {
        asObject[asset.asset_id] = asset;
      });
      state.users = {
        asArray: params.payload,
        asObject,
      };
    },
    setPurchaseOrders: (state, params) => {
      const {project_id, data} = params.payload;
      state.porders[project_id] = {
        asArray: data,
        asObject: null,
      };
      state.reRender += 1;
    },
    setReceiveOrders: (state, params) => {
      const {project_id, data} = params.payload;
      state.rorders[project_id] = {
        asArray: data,
        asObject: null,
      };
      state.reRender += 1;
    },
    setGrns: (state, params) => {
      state.grns[params.payload.project_id] = params.payload.data;
    },
    receiveGRN: (state, params) => {
      const {grn_id, project_id, quantity} = params.payload;
      const index = state.grns[project_id].findIndex(
        item => item.grn_id === grn_id,
      );
      state.grns[project_id][index].received += quantity;
    },
    setReturnRender: state => {
      state.assetReRender.returnRender += 1;
    },
    setUseRender: state => {
      state.assetReRender.useRender += 1;
    },
    setBrokenRender: state => {
      state.assetReRender.brokenRender += 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  resetState,
  setOrgAssetsData,
  setVendorsData,
  setContractorsData,
  setUsers,
  setPurchaseOrders,
  setReceiveOrders,
  setGrns,
  setUserRolesData,
  receiveGRN,
  setReturnRender,
  setUseRender,
  setBrokenRender,
} = app.actions;

export default app.reducer;
