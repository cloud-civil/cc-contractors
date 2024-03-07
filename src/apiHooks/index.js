import Toast from 'react-native-toast-message';
import {axiosInstance} from './axiosInstance';
export const LOGIN = '/login';
export const LOGIN_ORG = '/login_org';
export const SIGNUP = '/signup';
export const USER_SESSION = '/session';

export const loginRequest = async (data, token) =>
  axiosInstance(token).post(LOGIN, data);

export const loginOrgRequest = async (data, token) =>
  axiosInstance(token).post(LOGIN_ORG, data);

export const getUserSession = token => axiosInstance(token).get(USER_SESSION);

export const imageUpload = async (selectedFile, org_id, project_id, token) => {
  if (selectedFile) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: `${selectedFile.uri}`,
        type: 'image/jpeg',
        name: `${selectedFile.fileName}`,
      });
      formData.append('width', selectedFile.width);
      formData.append('height', selectedFile.height);
      formData.append('org_id', org_id);
      formData.append('project_id', project_id);
      return await axiosInstance(token).post('/imageUpload', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      console.log(err, '/imageUpload', err?.response?.data?.message);
    }
  }
};

export const orgImageUpload = async (selectedFile, org_id, token) => {
  if (selectedFile) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: `${selectedFile.uri}`,
        type: 'image/jpeg',
        name: `${selectedFile.fileName}`,
      });
      formData.append('width', selectedFile.width);
      formData.append('height', selectedFile.height);
      formData.append('org_id', org_id);
      return await axiosInstance(token).post('/imageUpload', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      console.log(err.response.data, '/imageUpload');
    }
  } else {
    Toast.show({
      type: 'info',
      text1: 'No Image',
      text2: 'PLease select an image before uploading.',
    });
  }
};
