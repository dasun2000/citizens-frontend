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
      // Your existing data loading logic here
      // ... (same as your original code)
      
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
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Citizen Analytics
      </h2>
      
      {/* Summary Cards */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px', 
        marginBottom: '20px', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '8px', 
          textAlign: 'center',
          flex: '1',
          minWidth: '150px'
        }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Total Citizens</h4>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{totalCitizens}</div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '8px', 
          textAlign: 'center',
          flex: '1',
          minWidth: '150px'
        }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Countries</h4>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.countries.length}</div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '8px', 
          textAlign: 'center',
          flex: '1',
          minWidth: '150px'
        }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Territories</h4>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.territories.length}</div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '8px', 
          textAlign: 'center',
          flex: '1',
          minWidth: '150px'
        }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Districts</h4>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.districts.length}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '5px',
        marginBottom: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setActiveTab('country')}
          style={{
            padding: '8px 15px',
            backgroundColor: activeTab === 'country' ? '#4a7aff' : '#e0e0e0',
            color: activeTab === 'country' ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Countries
        </button>
        
        <button 
          onClick={() => setActiveTab('territory')}
          style={{
            padding: '8px 15px',
            backgroundColor: activeTab === 'territory' ? '#4a7aff' : '#e0e0e0',
            color: activeTab === 'territory' ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Territories
        </button>
        
        <button 
          onClick={() => setActiveTab('district')}
          style={{
            padding: '8px 15px',
            backgroundColor: activeTab === 'district' ? '#4a7aff' : '#e0e0e0',
            color: activeTab === 'district' ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Districts
        </button>
        
        <button 
          onClick={() => setActiveTab('seat')}
          style={{
            padding: '8px 15px',
            backgroundColor: activeTab === 'seat' ? '#4a7aff' : '#e0e0e0',
            color: activeTab === 'seat' ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Seats
        </button>
      </div>

      {/* Chart */}
      <div style={{ marginBottom: '30px', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={currentData.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10}/>
            <YAxis />
            <Tooltip formatter={(value) => [value, 'Citizens']} />
            <Bar dataKey="count" fill="#4a7aff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Data Table */}
      <div style={{ marginBottom: '30px', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Details
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Name
                </th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  Citizens
                </th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData
                .sort((a, b) => b.count - a.count)
                .map((item, index) => (
                <tr key={index} style={{ 
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' 
                }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', fontWeight: 'bold' }}>
                    {item.count}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
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
            padding: '10px 20px',
            backgroundColor: '#4a7aff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default CitizenAnalytics;