const API_URL = 'http://localhost:8081/api/auth/';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  roles?: string[];
  fullName?: string;
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
  // Login method
  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(API_URL + 'signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
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
  }

  // Register method
  async register(signupRequest: SignupRequest): Promise<{ message: string }> {
    const response = await fetch(API_URL + 'signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  }

  // Logout method
  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  // Get current user from localStorage
  getCurrentUser(): { id: number; username: string; email: string; roles: string[] } | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if the user is logged in (i.e., if token exists)
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Check if the current user has a specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.roles.includes(role);
  }

  // Helper methods for localStorage operations
  private setToken(token: string) {
    localStorage.setItem('token', token);
  }

  private setUser(user: { id: number; username: string; email: string; roles: string[] }) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private removeToken() {
    localStorage.removeItem('token');
  }

  private removeUser() {
    localStorage.removeItem('user');
  }

  // Check if the token has expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Define a type for the decoded JWT payload
            interface DecodedToken {
              exp: number; // Expiration time in seconds
              [key: string]: unknown; // Other optional fields
            }
      
            const decoded: DecodedToken = jwtDecode<DecodedToken>(token); // Use jwt-decode to parse JWT
      const exp = decoded.exp * 1000; // exp is in seconds, convert to milliseconds
      return Date.now() > exp;
    } catch {
      return true;
    }
  }
}

function jwtDecode<T>(token: string): T {
  const base64Url = token.split('.')[1];
  if (!base64Url) {
    throw new Error('Invalid token format');
  }
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload) as T;
}

export default new AuthService();
// Removed duplicate implementation of jwtDecode

