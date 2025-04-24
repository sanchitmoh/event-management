import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  roles?: string[];
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

class AuthService {
  // Login with backend
  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(API_ENDPOINTS.LOGIN, loginRequest);
      const data = response.data;

      if (data.token) {
        this.setToken(data.token);
        this.setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          roles: data.roles,
        });
      }

      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Failed to login. Please check your credentials.');
    }
  }

  // Firebase login with Google
  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // User info will be handled in onAuthStateChanged
    } catch (error) {
      console.error('Google login failed:', error);
      throw new Error('Failed to login with Google.');
    }
  }

  // Firebase login with GitHub
  async loginWithGithub(): Promise<void> {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      // User info will be handled in onAuthStateChanged
    } catch (error) {
      console.error('GitHub login failed:', error);
      throw new Error('Failed to login with GitHub.');
    }
  }

  // Register via backend
  async register(signupRequest: SignupRequest): Promise<{ message: string }> {
    try {
      const response = await axios.post<{ message: string }>(API_ENDPOINTS.REGISTER, {
        ...signupRequest,
        roles: signupRequest.roles ?? ['user'],
      });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Failed to register. Please try again.');
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Get current user from localStorage
  getCurrentUser(): { id: number | string; username: string; email: string; roles: string[] } | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  // Check if user has a specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.roles.includes(role);
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: { exp: number } = this.decodeToken(token);
      const exp = decoded.exp * 1000; // Convert to milliseconds
      return Date.now() > exp;
    } catch {
      return true; // Treat invalid tokens as expired
    }
  }

  // Setup Axios interceptors for adding Authorization header
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Decode JWT token
  private decodeToken<T>(token: string): T {
    const base64Url = token.split('.')[1];
    if (!base64Url) throw new Error('Invalid token');

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as T;
  }

  // Save token to localStorage
  private setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Save user to localStorage
  private setUser(user: { id: number | string; username: string; email: string; roles: string[] }) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export default new AuthService();

