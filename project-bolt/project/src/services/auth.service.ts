import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

class AuthService {
  async login(username: string, password: string) {
    const response = await axios.post(API_ENDPOINTS.LOGIN, {
      username,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    }
    
    return response.data;
  }
  
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  
  async register(username: string, email: string, password: string, fullName: string) {
    return axios.post(API_ENDPOINTS.REGISTER, {
      username,
      email,
      password,
      fullName,
      roles: ["user"]
    });
  }
  
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) return JSON.parse(userStr);
    return null;
  }
  
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  }
  
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
  
  // Add auth header with JWT
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers["Authorization"] = 'Bearer ' + token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

export default new AuthService(); 