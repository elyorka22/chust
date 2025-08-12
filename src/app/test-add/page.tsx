'use client';

import { useState } from 'react';

export default function TestAddPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testAddListing = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const testData = {
        title: 'Test объявление',
        description: 'Test описание',
        price: '100',
        currency: 'USD',
        property_type: 'Kvartira',
        area: '50',
        rooms: '2',
        floor: '3',
        total_floors: '5',
        latitude: 40.9977,
        longitude: 71.2374,
        contact_phone: '+998901234567',
        category: 'rent'
      };

      console.log('Sending test data:', testData);
      
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      console.log('API response:', result);
      
      setResult(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Test error:', error);
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Add Listing</h1>
      
      <button
        onClick={testAddListing}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Add Listing'}
      </button>
      
      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
} 