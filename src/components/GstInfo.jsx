import React, { useState } from 'react';

const GstInfo = () => {
  const [gstin, setGstin] = useState(''); // GSTIN entered by the user
  const [data, setData] = useState(null); // Store GSTIN details
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const handleSearch = async () => {
    if (!gstin.trim()) {
      alert('Please enter a valid GSTIN number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Replace with your GSTIN API URL
      const url = `http://sheet.gstincheck.co.in/check/70cd2e8bd3d5de39150c588d81df11f5/${encodeURIComponent(gstin)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const json = await response.json();
      if (json.flag) {
        setData(json.data); // Store GSTIN details
      } else {
        setData(null);
        setError(json.message || 'No details found for the given GSTIN.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px' }}>
      <h2>GSTIN Details</h2>

      {/* Input for GSTIN */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter GSTIN number"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            fontSize: '16px',
            cursor: 'pointer',
            border: '1px solid #ddd'
          }}
        >
          Search
        </button>
      </div>

      {/* Loading State */}
      {isLoading && <p>Loading data...</p>}

      {/* Error State */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display GSTIN Data */}
      {data && !isLoading && !error && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <p><strong>GSTIN:</strong> {data.gstin}</p>
          <p><strong>Legal Name:</strong> {data.lgnm}</p>
          <p><strong>Trade Name:</strong> {data.tradeNam}</p>
          <p><strong>Registration Date:</strong> {data.rgdt}</p>
          <p><strong>Address:</strong> {data.pradr.adr}</p>
          <p><strong>Status:</strong> {data.sts}</p>
        </div>
      )}
    </div>
  );
};

export default GstInfo;
