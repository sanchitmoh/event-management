import { useState, useCallback } from 'react';
import api from '../services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface ApiHook<T> extends ApiState<T> {
  execute: (data?: Record<string, unknown>) => Promise<T | null>;
  reset: () => void;
}

type ApiMethod = 'get' | 'post' | 'put' | 'delete';

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
function useApi<T>(
  method: ApiMethod,
  url: string,
  immediate = false
): ApiHook<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });
  const execute = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_data?: Record<string, unknown>): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });
      try {
        // @ts-expect-error api methods are dynamically accessed
        const data = await api[method](url, data);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error });
        return null;
      }
    },
    [method, url]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  // Execute immediately if requested
  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return {
    ...state,
    execute,
    reset,
  };
}

export default useApi; 