import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const CitizenAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://citizens-backend-production.up.railway.app";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get all countries
      const countriesResponse = await axios.get(`${API_BASE_URL}/countries`);
      const countries = countriesResponse.data;
      
      const result = [];

      // Count citizens for each country
      for (const country of countries) {
        let totalCitizens = 0;
        
        try {
          // Get territories for this country
          const territories = await axios.get(`${API_BASE_URL}/territories/${country.ID}`);
          
          // For each territory, get districts and count citizens
          for (const territory of territories.data) {
            const districts = await axios.get(`${API_BASE_URL}/districts/${territory.ID}`);
            
            for (const district of districts.data) {
              const citizens = await axios.get(`${API_BASE_URL}/citizens/district/${district.ID}`);
              totalCitizens += citizens.data.length;
            }
          }
        } catch (error) {
          console.error(`Error for country ${country.CountryName}:`, error);
        }
        
        result.push({
          name: country.CountryName,
          citizens: totalCitizens
        });
      }

      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  const totalCitizens = data.reduce((sum, item) => sum + item.citizens, 0);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Citizen Analytics</h2>
      
      {/* Total Count */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#f0f0f0',
        borderRadius: '8px'
      }}>
        <h3>Total Citizens: {totalCitizens}</h3>
      </div>

      {/* Chart */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ textAlign: 'center' }}>Citizens by Country</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="citizens" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Simple Table */}
      <div>
        <h3 style={{ textAlign: 'center' }}>Country Breakdown</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0 auto' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Country</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Citizens</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {item.citizens}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={loadData}
          style={{
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
    </div>
  );
};

export default CitizenAnalytics;