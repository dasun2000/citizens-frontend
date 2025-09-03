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
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading Analytics...</div>
        <div style={{ color: '#666' }}>Counting citizens at all levels...</div>
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
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>Citizen Analytics Dashboard</h2>
        <div style={{ 
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '20px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          Total Citizens: {totalCitizens}
        </div>
      </div>
      
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {data.countries.length}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Countries</div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {data.territories.length}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Territories</div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>
            {data.districts.length}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Districts</div>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
            {data.seats.length}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Seats</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '5px', 
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'country', label: 'Countries', count: data.countries.length },
          { key: 'territory', label: 'Territories', count: data.territories.length },
          { key: 'district', label: 'Districts', count: data.districts.length },
          { key: 'seat', label: 'Seats', count: data.seats.length }
        ].map(tab => (
          <button 
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === tab.key ? '#007bff' : 'white',
              color: activeTab === tab.key ? 'white' : '#333',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{ 
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          color: '#333',
          fontSize: '18px'
        }}>
          Citizens by {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h3>
        
        <ResponsiveContainer width="100%" height={280}>
          <BarChart 
            data={currentData.slice(0, 8)} 
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              fontSize={11}
            />
            <YAxis fontSize={12} />
            <Tooltip 
              formatter={(value) => [value, 'Citizens']}
              contentStyle={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <Bar dataKey="count" fill="#007bff" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        
        {currentData.length > 8 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            fontSize: '12px',
            marginTop: '10px'
          }}>
            Showing top 8 results. Full data in table below.
          </div>
        )}
      </div>

      {/* Data Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #ddd',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          padding: '15px',
          margin: '0',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #ddd',
          color: '#333'
        }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Details
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ 
                  padding: '12px 15px', 
                  borderBottom: '1px solid #ddd', 
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Name
                </th>
                <th style={{ 
                  padding: '12px 15px', 
                  borderBottom: '1px solid #ddd', 
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Citizens
                </th>
                <th style={{ 
                  padding: '12px 15px', 
                  borderBottom: '1px solid #ddd', 
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData
                .sort((a, b) => b.count - a.count)
                .map((item, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <td style={{ padding: '12px 15px' }}>
                    {item.name}
                  </td>
                  <td style={{ 
                    padding: '12px 15px', 
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: item.count > 0 ? '#28a745' : '#6c757d'
                  }}>
                    {item.count}
                  </td>
                  <td style={{ 
                    padding: '12px 15px',
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    {item.parent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <button 
          onClick={loadAllData}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default CitizenAnalytics;