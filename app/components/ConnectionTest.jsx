'use client';

import { useState, useEffect } from 'react';

export default function ConnectionTest() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setMessage('Backend connection successful!');
        console.log('Products data:', data);
      } catch (err) {
        setError('Failed to connect to backend: ' + err.message);
        console.error('Connection error:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Connection Test</h2>
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
} 