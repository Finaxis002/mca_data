

import React, { useState } from 'react';
import './App.css';
import './components/GstInfo'
import GstInfo from './components/GstInfo';

// API details
const baseURL = 'https://api.data.gov.in/resource/4dbe5667-7b6b-41d7-82af-211562424d9a';
const apiKey = '579b464db66ec23bdd000001afc2455999a844ea6dd71e41a9a2d235';

const App = () => {
  const [cin, setCin] = useState(''); // CIN entered by the user
  const [companyName, setCompanyName] = useState(''); // Company Name entered by the user
  const [data, setData] = useState(null); // Store the company data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const handleSearch = async () => {
    if (!cin.trim() && !companyName.trim()) {
      alert('Please enter a CIN number or Company Name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Construct the API URL with the appropriate filter
      let url = `${baseURL}?api-key=${apiKey}&format=json`;
      if (cin.trim()) {
        url += `&filters[CIN]=${encodeURIComponent(cin)}`;
      }
      if (companyName.trim()) {
        url += `&filters[CompanyName]=${encodeURIComponent(companyName)}`;
      }

      // Fetch data from the API
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const json = await response.json();
      if (json.records && json.records.length > 0) {
        setData(json.records); // Store all matching records
        console.log(json.records)
      } else {
        setData(null);
        setError('No company found for the given CIN or Company Name.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className='text-3xl font-bold'>Search Company by CIN or Company Name</h1>
      
       <div className='flex gap-2 mt-2'>

      
      {/* Input for CIN */}
      <div style={{ marginBottom: '20px' }} className='border-solid border-2 border-indigo-600'>
        <input
          type="text"
          placeholder="Enter CIN number"
          value={cin}
          onChange={(e) => setCin(e.target.value)}
          style={{ padding: '10px', width: '300px', fontSize: '16px', marginRight: '10px' }}
        />
      </div>

      {/* Input for Company Name */}
      <div style={{ marginBottom: '20px' }} className='border-solid border-2 border-indigo-600'>
        <input
          type="text"
          placeholder="Enter Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
      </div>
          
      {/* Search Button */}
      <button
        onClick={handleSearch}
        style={{
          fontSize: '25px',
          cursor: 'pointer',
        }}
        className='border-solid border-2 border-black-600 ps-3 pe-3 pt-0 pb-0'
      >
        Search
      </button>
      </div>
      {/* Loading State */}
      {isLoading && <p>Loading data...</p>}

      {/* Error State */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Company Data */}
      {data && !isLoading && !error && (
        <div style={{ marginTop: '20px' }}>
          <h2>Company Details</h2>
          {data.map((record, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p><strong>CIN:</strong> {record.CIN}</p>
              <p><strong>Company Name:</strong> {record.CompanyName}</p>
              <p><strong>ROC Code:</strong> {record.CompanyROCcode}</p>
              <p><strong>Category:</strong> {record.CompanyCategory}</p>
              <p><strong>Sub-Category:</strong> {record.CompanySubCategory}</p>
              <p><strong>Status:</strong> {record.CompanyStatus}</p>
              <p><strong>Registration Date:</strong> {record.CompanyRegistrationdate_date}</p>
              <p><strong>Authorized Capital:</strong> {record.AuthorizedCapital}</p>
              <p><strong>Paid-Up Capital:</strong> {record.PaidupCapital}</p>
              <p><strong>Address:</strong> {record.Registered_Office_Address}</p>
            </div>
          ))}
        </div>
      )}
      <GstInfo />
    </div>
  );
};

export default App;
