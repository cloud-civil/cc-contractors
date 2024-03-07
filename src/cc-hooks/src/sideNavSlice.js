import { createSlice } from '@reduxjs/toolkit'

export const sideNav = createSlice({
  name: 'sideNav',
  initialState: {
    open: true,
  },
  reducers: {
    close: (state) => {
      state.open = false
    },
    open: (state) => {
      state.open = true
    },
    toggle: (state) => {
      state.open = !state.open
    },
  },
})

// Action creators are generated for each case reducer function
export const { close, open, toggle } = sideNav.actions

export default sideNav.reducer
