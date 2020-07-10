import axios from 'axios';
import {Key} from '@/store/auth';

const retrieveAccessToken = () => {
  return localStorage.getItem(Key.ACCESS_TOKEN);
};

export const api = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  headers: {
    Authorization: `Bearer ${retrieveAccessToken()}`,
  },
});

export const updateAccessToken = () => {
  api.defaults.headers = {
    Authorization: `Bearer ${retrieveAccessToken()}`,
  };
};
