'use client';

import { useState } from 'react';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testCreateListing = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Тестовая квартира',
          price: '85000',
          contact_phone: '+998901234567',
          category: 'rent',
          description: 'Тестовое описание квартиры',
          currency: 'USD',
          property_type: 'Kvartira',
          area: '80',
          rooms: '3',
          floor: '4',
          total_floors: '12',
          latitude: 40.9977,
          longitude: 71.2374
        }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetListings = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/listings');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
        
        <div className="space-y-4">
          <button
            onClick={testCreateListing}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Create Listing'}
          </button>
          
          <button
            onClick={testGetListings}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test Get Listings'}
          </button>
        </div>

        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 