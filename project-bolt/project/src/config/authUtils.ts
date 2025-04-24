// src/utils/authUtils.ts
import axios from 'axios';

export const storeTokenAndSetAxiosHeader = (token: string) => {
  localStorage.setItem('authToken', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
  delete axios.defaults.headers.common['Authorization'];
};
