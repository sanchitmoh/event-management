import React, { useState } from 'react';
import authService from '../services/auth.service';
import { useApi } from '../hooks/useApi';

const APITest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { data: events, loading: eventsLoading, error: eventsError } = useApi('get', '/events');

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await authService.login({ username: 'testuser', password: 'testpassword' });
      setTestResult(`Login successful: ${JSON.stringify(response)}`);
    } catch (error) {
      setTestResult(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testEvents = () => {
    if (eventsLoading) {
      setTestResult('Loading events...');
    } else if (eventsError) {
      setTestResult(`Error fetching events: ${eventsError.message}`);
    } else if (events) {
      setTestResult(`Events fetched successfully: ${JSON.stringify(events)}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testLogin}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Login API'}
        </button>

        <button
          onClick={testEvents}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Test Events API
        </button>

        {testResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <pre className="whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default APITest;

// Removed invalid JSON-like object