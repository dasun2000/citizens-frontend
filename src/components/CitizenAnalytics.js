import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';

const CitizenAnalytics = () => {
  const [data, setData] = useState([]);
  const [viewType, setViewType] = useState('country');
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  const API_BASE_URL = "https://citizens-backend-production.up.railway.app";

 
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (countries.length > 0) {
      loadData();
    }
  }, [viewType, selectedCountry, countries]);

  const loadCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/countries`);
      setCountries(response.data);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      let result = [];

      if (viewType === 'country') {
        
        for (const country of countries) {
          let totalCitizens = 0;
          try {
            const territories = await axios.get(`${API_BASE_URL}/territories/${country.ID}`);
            for (const territory of territories.data) {
              const districts = await axios.get(`${API_BASE_URL}/districts/${territory.ID}`);
              for (const district of districts.data) {
                const citizens = await axios.get(`${API_BASE_URL}/citizens/district/${district.ID}`);
                totalCitizens += citizens.data.length;
              }
            }
          } catch (error) {
            console.error(`Error counting citizens for country ${country.CountryName}:`, error);
          }
          
          result.push({
            name: country.CountryName,
            count: totalCitizens
          });
        }
      }

      else if (viewType === 'territory') {
       
        const countryFilter = selectedCountry ? countries.filter(c => c.ID.toString() === selectedCountry) : countries;
        
        for (const country of countryFilter) {
          try {
            const territories = await axios.get(`${API_BASE_URL}/territories/${country.ID}`);
            for (const territory of territories.data) {
              let totalCitizens = 0;
              const districts = await axios.get(`${API_BASE_URL}/districts/${territory.ID}`);
              for (const district of districts.data) {
                const citizens = await axios.get(`${API_BASE_URL}/citizens/district/${district.ID}`);
                totalCitizens += citizens.data.length;
              }
              
              result.push({
                name: territory.TerritoryName,
                count: totalCitizens,
                country: country.CountryName
              });
            }
          } catch (error) {
            console.error(`Error counting citizens for territories:`, error);
          }
        }
      }

      else if (viewType === 'district') {
        
        const countryFilter = selectedCountry ? countries.filter(c => c.ID.toString() === selectedCountry) : countries;
        
        for (const country of countryFilter) {
          try {
            const territories = await axios.get(`${API_BASE_URL}/territories/${country.ID}`);
            for (const territory of territories.data) {
              const districts = await axios.get(`${API_BASE_URL}/districts/${territory.ID}`);
              for (const district of districts.data) {
                const citizens = await axios.get(`${API_BASE_URL}/citizens/district/${district.ID}`);
                
                result.push({
                  name: district.DistrictName,
                  count: citizens.data.length,
                  territory: territory.TerritoryName,
                  country: country.CountryName
                });
              }
            }
          } catch (error) {
            console.error(`Error counting citizens for districts:`, error);
          }
        }
      }

      else if (viewType === 'seat') {
        
        const countryFilter = selectedCountry ? countries.filter(c => c.ID.toString() === selectedCountry) : countries;
        
        for (const country of countryFilter) {
          try {
            const territories = await axios.get(`${API_BASE_URL}/territories/${country.ID}`);
            for (const territory of territories.data) {
              const districts = await axios.get(`${API_BASE_URL}/districts/${territory.ID}`);
              for (const district of districts.data) {
                const seats = await axios.get(`${API_BASE_URL}/seats/${district.ID}`);
                for (const seat of seats.data) {
                  const citizens = await axios.get(`${API_BASE_URL}/citizens/seat/${seat.ID}`);
                  
                  result.push({
                    name: seat.SeatDescption || `Seat ${seat.ID}`,
                    count: citizens.data.length,
                    district: district.DistrictName,
                    territory: territory.TerritoryName,
                    country: country.CountryName
                  });
                }
              }
            }
          } catch (error) {
            console.error(`Error counting citizens for seats:`, error);
          }
        }
      }

      setData(result.sort((a, b) => b.count - a.count));
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const totalCitizens = data.reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading Analytics...</h2>
        <p>Please wait while we calculate citizen statistics.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Citizen Population Analytics
      </h2>
      
      
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>View by:</label>
          <select 
            value={viewType} 
            onChange={(e) => setViewType(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="country">Country</option>
            <option value="territory">Territory</option>
            <option value="district">District</option>
            <option value="seat">Seat</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Country:</label>
          <select 
            value={selectedCountry} 
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country.ID} value={country.ID}>
                {country.CountryName}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={loadData}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>

      
      <div style={{ 
        marginBottom: '30px', 
        display: 'flex', 
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px', 
          textAlign: 'center',
          minWidth: '150px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Citizens</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalCitizens}</div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f3e5f5', 
          borderRadius: '8px', 
          textAlign: 'center',
          minWidth: '150px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>Locations</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{data.length}</div>
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No Data Found</h3>
          <p>No citizen data available for the selected criteria.</p>
        </div>
      ) : (
        <>
          
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
              Citizens by {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data.slice(0, 15)} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={120}
                  fontSize={10}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'Citizens']}
                />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          
          {data.length <= 10 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                Population Distribution
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.count}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          
          <div>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Detailed Breakdown</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                      {viewType.charAt(0).toUpperCase() + viewType.slice(1)} Name
                    </th>
                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right' }}>
                      Citizens
                    </th>
                    {viewType !== 'country' && (
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                        Location
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} style={{ 
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' 
                    }}>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {item.name}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        border: '1px solid #ddd', 
                        textAlign: 'right',
                        fontWeight: 'bold'
                      }}>
                        {item.count}
                      </td>
                      {viewType !== 'country' && (
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          {viewType === 'territory' && item.country}
                          {viewType === 'district' && `${item.territory}, ${item.country}`}
                          {viewType === 'seat' && `${item.district}, ${item.territory}`}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CitizenAnalytics;