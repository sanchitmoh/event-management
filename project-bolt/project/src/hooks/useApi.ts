import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '../services/api';


interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for API calls with loading, error, and data states
 * @param method - HTTP method (get, post, put, delete)
 * @param url - API endpoint URL (will be appended to base URL)
 * @param immediate - If true, execute the API call immediately
 * @returns An object containing data, loading, error, execute, and reset
 * 
 * @example
 * // GET request
 * const { data, loading, error, execute } = useApi<User[]>('get', '/users');
 * 
 * // POST request
 * const { data, loading, error, execute } = useApi<User>('post', '/users');
 * execute({ name: 'John', email: 'john@example.com' });
 */

export function useApi<T, B = unknown>(method: 'get' | 'post', endpoint: string, body?: B): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWithAuth(endpoint, { method, body: body ? JSON.stringify(body) : undefined });
      const data = await response.json() as T; // Parse response data into JSON
      setData(data); // Set data to parsed JSON
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [method, endpoint, body]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

export default useApi; 