import {createSlice} from '@reduxjs/toolkit';

export const image = createSlice({
  name: 'image',
  initialState: {
    uploadedUrls: [],
  },
  reducers: {
    deleteImage: (state, params) => {
      const {fileName} = params.payload;
      const newUploadedUrls = state.uploadedUrls.filter(
        item => item.fileName !== fileName,
      );
      state.uploadedUrls = newUploadedUrls;
    },
    setUploadedUrls: (state, params) => {
      state.uploadedUrls = [...state.uploadedUrls, params.payload];
    },
    resetImages: state => {
      state.uploadedUrls = [];
    },
  },
});

export const {resetImages, deleteImage, setUploadedUrls} = image.actions;
export default image.reducer;
