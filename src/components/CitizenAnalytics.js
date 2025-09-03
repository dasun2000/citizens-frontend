import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from 'recharts';

const CitizenAnalytics = () => {
  const [data, setData] = useState({
    countries: [],
    territories: [],
    districts: [],
    seats: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('country');
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://citizens-backend-production.up.railway.app";

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const countriesResponse = await axios.get(`${API_BASE_URL}/countries`);
      const countries = countriesResponse.data;
      
      const countryData = [];
      const territoryData = [];
      const districtData = [];
      const seatData = [];

      for (const country of countries) {
        let countryTotal = 0;
        
        try {
          const territories = await axios.get(`${API_BASE_URL}/territories/${country.ID}`);
          
          for (const territory of territories.data) {
            let territoryTotal = 0;
            
            try {
              const districts = await axios.get(`${API_BASE_URL}/districts/${territory.ID}`);
              
              for (const district of districts.data) {
                try {
                  const citizens = await axios.get(`${API_BASE_URL}/citizens/district/${district.ID}`);
                  const districtCount = citizens.data.length;
                  territoryTotal += districtCount;
                  
                  districtData.push({
                    name: district.DistrictName,
                    count: districtCount,
                    parent: `${territory.TerritoryName}, ${country.CountryName}`
                  });
                  
                  try {
                    const seats = await axios.get(`${API_BASE_URL}/seats/${district.ID}`);
                    
                    for (const seat of seats.data) {
                      try {
                        const seatCitizens = await axios.get(`${API_BASE_URL}/citizens/seat/${seat.ID}`);
                        const seatCount = seatCitizens.data.length;
                        
                        seatData.push({
                          name: seat.SeatDescption || `Seat ${seat.ID}`,
                          count: seatCount,
                          parent: `${district.DistrictName}, ${territory.TerritoryName}`
                        });
                      } catch (seatError) {
                        console.error('Error loading seat citizens:', seatError);
                      }
                    }
                  } catch (seatsError) {
                    console.error('Error loading seats:', seatsError);
                  }
                } catch (districtError) {
                  console.error('Error loading district citizens:', districtError);
                }
              }
            } catch (districtsError) {
              console.error('Error loading districts:', districtsError);
            }
            
            countryTotal += territoryTotal;
            
            territoryData.push({
              name: territory.TerritoryName,
              count: territoryTotal,
              parent: country.CountryName
            });
          }
        } catch (territoriesError) {
          console.error('Error loading territories:', territoriesError);
        }
        
        countryData.push({
          name: country.CountryName,
          count: countryTotal,
          parent: 'Root'
        });
      }

      setData({
        countries: countryData,
        territories: territoryData,
        districts: districtData,
        seats: seatData
      });
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load analytics data. Please try again.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading Analytics...</h2>
        <p>Please wait while we load all data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button 
          onClick={loadAllData}
          style={{
            padding: '10px 20px',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const getCurrentData = () => {
    switch(activeTab) {
      case 'country': return data.countries;
      case 'territory': return data.territories;
      case 'district': return data.districts;
      case 'seat': return data.seats;
      default: return [];
    }
  };

  const currentData = getCurrentData();
  const totalCitizens = data.countries.reduce((sum, item) => sum + item.count, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Full Citizen Count Analytics
      </h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <button 
          onClick={() => setActiveTab('country')}
          style={{
            padding: '10px 20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'country' ? 'blue' : '#B2BEB5',
            color: activeTab === 'country' ? 'white' : 'black'
          }}
        >
          Countries ({data.countries.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('territory')}
          style={{
            padding: '10px 20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'territory' ? 'blue' : '#B2BEB5',
            color: activeTab === 'territory' ? 'white' : 'black'
          }}
        >
          Territories ({data.territories.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('district')}
          style={{
            padding: '10px 20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'district' ? 'blue' : '#B2BEB5',
            color: activeTab === 'district' ? 'white' : 'black'
          }}
        >
          Districts ({data.districts.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('seat')}
          style={{
            padding: '10px 20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'seat' ? 'blue' : '#B2BEB5',
            color: activeTab === 'seat' ? 'white' : 'black'
          }}
        >
          Seats ({data.seats.length})
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Citizens Chart
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10}/>
            <YAxis />
            <Tooltip formatter={(value) => [value, 'Citizens']} />
            <Bar dataKey="count" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Name
              </th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                Citizens Count
              </th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData
              .sort((a, b) => b.count - a.count)
              .map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {item.count}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {item.parent}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={loadAllData}
          style={{
            padding: '10px 20px',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh All Data
        </button>
      </div>
    </div>
  );
};

export default CitizenAnalytics;