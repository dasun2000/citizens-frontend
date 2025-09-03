import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';

const CitizenAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://citizens-backend-production.up.railway.app";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/countries`);
      const countries = response.data || [];
      
      // Add sample citizen counts for chart (you can replace with real data)
      const dataWithCounts = countries.map((country, index) => ({
        ...country,
        citizenCount: Math.floor(Math.random() * 1000) + 100 // Sample data
      }));
      
      setData(dataWithCounts);
    } catch (error) {
      console.error('Error loading data:', error);
      setData([]);
    }
    setLoading(false);
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Citizen Analytics</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Total Countries: {data.length}</strong>
      </div>

      {/* Simple Chart */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Citizens by Country</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="CountryName" />
            <YAxis />
            <Bar dataKey="citizenCount" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Country Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Country Code</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Citizens</th>
          </tr>
        </thead>
        <tbody>
          {data.map((country, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {country.CountryName}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {country.CountryCode}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {country.citizenCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        onClick={loadData}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Refresh Data
      </button>
    </div>
  );
};

export default CitizenAnalytics;