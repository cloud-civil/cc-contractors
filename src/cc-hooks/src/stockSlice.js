/* eslint-disable radix */
import {createSlice} from '@reduxjs/toolkit';

export const app = createSlice({
  name: 'stock',
  initialState: {
    stocks: {},
    stock_groups: {},
    requested_stocks: {},
    reRender: 0,
  },
  reducers: {
    setRequestedStocks: (state, params) => {
      const {project_id, data} = params.payload;
      state.stocks[project_id] = data;
      state.requested_stocks[project_id] = data;
    },
    setStocksAndStockGroups: (state, params) => {
      const {project_id, data, groups} = params.payload;
      state.stocks[project_id] = data;
      state.stock_groups[project_id] = groups;
    },
    setStocks: (state, params) => {
      const {project_id, data} = params.payload;
      state.stocks[project_id] = data;
      state.reRender += 1;
    },
    setStocksGroup: (state, params) => {
      const {project_id, data} = params.payload;
      state.stock_groups[project_id] = data;
      state.reRender += 1;
    },
    createStockData: (state, params) => {
      const {project_id, data} = params.payload;
      const thisstocks = state.stocks[project_id];
      state.stocks[project_id] = {
        asArray: [...thisstocks.asArray, ...[data]],
        asObject: {
          ...thisstocks.asObject,
          [data.stock_id]: data,
        },
      };
    },
    updateStockData: (state, params) => {
      const {project_id, data} = params.payload;
      const newArr = state.stocks[project_id].asArray.map(s => {
        if (s.stock_id === data.stock_id) {
          return data;
        }
        return s;
      });
      state.stocks[project_id].asArray = newArr;
      state.stocks[project_id].asObject[data.stock_id] = data;
      state.reRender += 1;
    },
  },
});

export const {
  setRequestedStocks,
  setStocksAndStockGroups,
  setStocks,
  setStocksGroup,
  createStockData,
  updateStockData,
} = app.actions;

export default app.reducer;
