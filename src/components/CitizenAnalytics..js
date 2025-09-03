import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CitizenAnalytics = () => {
  const [counts, setCounts] = useState({
    totalCitizens: 0,
    countries: 0,
    territories: 0,
    districts: 0,
    seats: 0
  });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://citizens-backend-production.up.railway.app";

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    setLoading(true);
    try {
      // Get countries
      const countriesResponse = await axios.get(`${API_BASE_URL}/countries`);
      const countries = countriesResponse.data;
      
      let totalCitizens = 0;
      let territoryCount = 0;
      let districtCount = 0;
      let seatCount = 0;

      // Count everything
      for (const country of countries) {
        const territories = await axios.get(`${API_BASE_URL}/territories/${country.ID}`);
        territoryCount += territories.data.length;
        
        for (const territory of territories.data) {
          const districts = await axios.get(`${API_BASE_URL}/districts/${territory.ID}`);
          districtCount += districts.data.length;
          
          for (const district of districts.data) {
            const citizens = await axios.get(`${API_BASE_URL}/citizens/district/${district.ID}`);
            totalCitizens += citizens.data.length;
            
            const seats = await axios.get(`${API_BASE_URL}/seats/${district.ID}`);
            seatCount += seats.data.length;
          }
        }
      }

      setCounts({
        totalCitizens,
        countries: countries.length,
        territories: territoryCount,
        districts: districtCount,
        seats: seatCount
      });
      
    } catch (error) {
      console.error('Error loading counts:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Population Summary
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          border: '2px solid #007bff',
          borderRadius: '10px', 
          textAlign: 'center' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Total Citizens</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
            {counts.totalCitizens}
          </div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '10px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Countries</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {counts.countries}
          </div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '10px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Territories</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {counts.territories}
          </div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '10px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Districts</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {counts.districts}
          </div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '10px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Seats</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {counts.seats}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button 
          onClick={loadCounts}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default CitizenAnalytics;