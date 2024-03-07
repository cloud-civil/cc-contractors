import axios from 'axios';
import {BASE_URL} from '@env';

export const noAuthAxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosInstance = token => {
  return axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      Authorization: token,
    },
  });
};
