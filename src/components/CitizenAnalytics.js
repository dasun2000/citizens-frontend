import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CitizenAnalytics = () => {
  const [data, setData] = useState({
    countries: [],
    territories: [],
    districts: [],
    seats: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('country');

  const API_BASE_URL = "https://citizens-backend-production.up.railway.app";

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Get all countries first
      const countriesResponse = await axios.get(`${API_BASE_URL}/countries`);
      const countries = countriesResponse.data;
      
      const countryData = [];
      const territoryData = [];
      const districtData = [];
      const seatData = [];

      // Loop through each country
      for (const country of countries) {
        let countryTotal = 0;
        
        // Get territories for this country
        const territories = await axios.get(`${API_BASE_URL}/territories/${country.ID}`);
        
        for (const territory of territories.data) {
          let territoryTotal = 0;
          
          // Get districts for this territory
          const districts = await axios.get(`${API_BASE_URL}/districts/${territory.ID}`);
          
          for (const district of districts.data) {
            // Get citizen count for this district
            const citizens = await axios.get(`${API_BASE_URL}/citizens/district/${district.ID}`);
            const districtCount = citizens.data.length;
            territoryTotal += districtCount;
            
            // Add district data
            districtData.push({
              name: district.DistrictName,
              count: districtCount,
              parent: `${territory.TerritoryName}, ${country.CountryName}`
            });
            
            // Get seats for this district
            const seats = await axios.get(`${API_BASE_URL}/seats/${district.ID}`);
            
            for (const seat of seats.data) {
              const seatCitizens = await axios.get(`${API_BASE_URL}/citizens/seat/${seat.ID}`);
              const seatCount = seatCitizens.data.length;
              
              // Add seat data
              seatData.push({
                name: seat.SeatDescption || `Seat ${seat.ID}`,
                count: seatCount,
                parent: `${district.DistrictName}, ${territory.TerritoryName}`
              });
            }
          }
          
          countryTotal += territoryTotal;
          
          // Add territory data
          territoryData.push({
            name: territory.TerritoryName,
            count: territoryTotal,
            parent: country.CountryName
          });
        }
        
        // Add country data
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
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading Analytics...</h2>
        <p>Counting citizens at all levels...</p>
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
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Full Citizen Count Analytics
      </h2>
      
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Total Citizens</h4>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{totalCitizens}</div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f3e5f5', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Countries</h4>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{data.countries.length}</div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Territories</h4>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{data.territories.length}</div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff3e0', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Districts</h4>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{data.districts.length}</div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fce4ec', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Seats</h4>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{data.seats.length}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setActiveTab('country')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'country' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'country' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Countries ({data.countries.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('territory')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'territory' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'territory' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Territories ({data.territories.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('district')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'district' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'district' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Districts ({data.districts.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('seat')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'seat' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'seat' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Seats ({data.seats.length})
        </button>
      </div>

      {/* Charts Section */}
      {currentData.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Charts
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: currentData.length <= 8 ? 'repeat(auto-fit, minmax(400px, 1fr))' : '1fr',
            gap: '30px',
            marginBottom: '20px'
          }}>
            {/* Bar Chart */}
            <div>
              <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Bar Chart</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentData.slice(0, 10)}>
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Citizens']} />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Only show if 8 or fewer items */}
            {currentData.length <= 8 && (
              <div>
                <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Pie Chart</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={currentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.count > 0 ? `${entry.name}: ${entry.count}` : ''}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {currentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Citizens']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Table */}
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Level Data
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            border: '1px solid #ddd'
          }}>
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
                .sort((a, b) => b.count - a.count) // Sort by highest count first
                .map((item, index) => (
                <tr key={index} style={{ 
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' 
                }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {item.name}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: item.count > 0 ? '#28a745' : '#6c757d'
                  }}>
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
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={loadAllData}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh All Data
        </button>
      </div>
    </div>
  );
};

export default CitizenAnalytics;