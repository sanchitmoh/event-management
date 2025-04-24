import AuthService from './AuthService';
import config from '../config/config';

/**
 * Helper function to make authenticated API calls
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = AuthService.getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    ...options,
    headers,
  });
  
  // Handle 401 Unauthorized - token might be expired
  if (response.status === 401) {
    AuthService.logout();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
  
  return response;
}

/**
 * GET request
 */
export async function get<T>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(endpoint);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API error: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * POST request
 */
export async function post<T, U = unknown>(endpoint: string, data: U): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API error: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * PUT request
 */
export async function put<T, U = unknown>(endpoint: string, data: U): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API error: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API error: ${response.status}`);
  }
  
  return await response.json();
}

export default {
  get,
  post,
  put,
  delete: del,
}; 