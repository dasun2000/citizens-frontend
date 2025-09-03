import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';

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
      const countriesResponse = await axios.get(`${API_BASE_URL}/countries`);
      const countries = countriesResponse.data;
      
      const countryData = [];
      const territoryData = [];
      const districtData = [];
      const seatData = [];

      for (const country of countries) {
        let countryTotal = 0;
        const territories = await axios.get(`${API_BASE_URL}/territories/${country.ID}`);
        
        for (const territory of territories.data) {
          let territoryTotal = 0;
          const districts = await axios.get(`${API_BASE_URL}/districts/${territory.ID}`);
          
          for (const district of districts.data) {
            const citizens = await axios.get(`${API_BASE_URL}/citizens/district/${district.ID}`);
            const districtCount = citizens.data.length;
            territoryTotal += districtCount;
            
            districtData.push({
              name: district.DistrictName,
              count: districtCount,
              parent: `${territory.TerritoryName}, ${country.CountryName}`
            });
            
            const seats = await axios.get(`${API_BASE_URL}/seats/${district.ID}`);
            
            for (const seat of seats.data) {
              const seatCitizens = await axios.get(`${API_BASE_URL}/citizens/seat/${seat.ID}`);
              const seatCount = seatCitizens.data.length;
              
              seatData.push({
                name: seat.SeatDescption || `Seat ${seat.ID}`,
                count: seatCount,
                parent: `${district.DistrictName}, ${territory.TerritoryName}`
              });
            }
          }
          
          countryTotal += territoryTotal;
          
          territoryData.push({
            name: territory.TerritoryName,
            count: territoryTotal,
            parent: country.CountryName
          });
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
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '50vh',
        textAlign: 'center' 
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Loading Analytics...</h2>
        <p style={{ margin: 0, color: '#666' }}>Counting citizens at all levels...</p>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          color: '#2c3e50',
          fontSize: '28px'
        }}>Citizen Analytics Dashboard</h1>
        <p style={{ 
          margin: 0, 
          color: '#7f8c8d',
          fontSize: '16px'
        }}>Comprehensive overview of citizen distribution</p>
      </div>
      
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #e74c3c'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#7f8c8d' }}>Total Citizens</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{totalCitizens.toLocaleString()}</div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #3498db'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#7f8c8d' }}>Countries</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{data.countries.length}</div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #2ecc71'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#7f8c8d' }}>Territories</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{data.territories.length}</div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #f39c12'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#7f8c8d' }}>Districts</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{data.districts.length}</div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #9b59b6'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#7f8c8d' }}>Seats</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{data.seats.length}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '0', 
        marginBottom: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={() => setActiveTab('country')}
          style={{
            padding: '12px 20px',
            backgroundColor: activeTab === 'country' ? '#3498db' : 'white',
            color: activeTab === 'country' ? 'white' : '#333',
            border: 'none',
            flex: '1',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}>
          Countries ({data.countries.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('territory')}
          style={{
            padding: '12px 20px',
            backgroundColor: activeTab === 'territory' ? '#3498db' : 'white',
            color: activeTab === 'territory' ? 'white' : '#333',
            border: 'none',
            flex: '1',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}>
          Territories ({data.territories.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('district')}
          style={{
            padding: '12px 20px',
            backgroundColor: activeTab === 'district' ? '#3498db' : 'white',
            color: activeTab === 'district' ? 'white' : '#333',
            border: 'none',
            flex: '1',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}>
          Districts ({data.districts.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('seat')}
          style={{
            padding: '12px 20px',
            backgroundColor: activeTab === 'seat' ? '#3498db' : 'white',
            color: activeTab === 'seat' ? 'white' : '#333',
            border: 'none',
            flex: '1',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}>
          Seats ({data.seats.length})
        </button>
      </div>

      {/* Chart Section */}
      <div style={{ 
        marginBottom: '30px', 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '20px', 
          color: '#2c3e50',
          fontSize: '20px'
        }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={currentData.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
            <YAxis />
            <Tooltip 
              formatter={(value) => [value, 'Citizens']} 
              contentStyle={{ 
                borderRadius: '6px', 
                border: 'none', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="count" fill="#3498db" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div style={{ 
        marginBottom: '30px', 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '20px', 
          color: '#2c3e50',
          fontSize: '20px'
        }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Details
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  borderBottom: '2px solid #eee'
                }}>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Name
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  borderBottom: '2px solid #eee'
                }}>
                  Citizens Count
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  borderBottom: '2px solid #eee'
                }}>
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData
                .sort((a, b) => b.count - a.count)
                .map((item, index) => (
                <tr key={index} style={{ 
                  borderBottom: '1px solid #eee'
                }}>
                  <td style={{ padding: '12px' }}>
                    {item.name}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    color: '#2c3e50'
                  }}>
                    {item.count.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {item.parent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={loadAllData}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default CitizenAnalytics;