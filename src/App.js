import React, { useState } from "react";
import CitizenForm from "./components/CitizenForm";
import CitizensList from "./components/CitizensList";
import LoginForm from './components/LoginForm';
import CitizenAnalytics from './components/CitizenAnalytics';

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  

  const handleDistrictChange = (districtID) => {
    setSelectedDistrict(districtID);
    if (districtID !== selectedDistrict) {
      setSelectedSeat("");
    }
  };

  const handleSeatChange = (seatID) => {
    setSelectedSeat(seatID);
  };

  const handleLogin = (loginStatus) => {
    setLoggedIn(loginStatus);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setSelectedDistrict("");
    setSelectedSeat("");
    setShowAnalytics(false);
  }
 

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="app-container">
      <h1><center>Population Management System</center></h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button 
          onClick={() => setShowAnalytics(!showAnalytics)}
          style={{
            padding: "10px 20px",
            backgroundColor: showAnalytics ? "#28a745" : "#007bff", 
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
            fontSize: "14px"
          }}
        >
          {showAnalytics ? "📝 Show Registration Form" : "📊 Show Analytics Dashboard"}
        </button>
        
        <button 
          onClick={handleLogout} 
          style={{
            padding: "10px 20px",
            backgroundColor: "red", 
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
            fontSize: "14px"
          }}
        >
          🚪 Logout
        </button>
      </div>
      
      {showAnalytics ? (
        <CitizenAnalytics />
      ) : (
        <>
          <CitizenForm onDistrictChange={handleDistrictChange} onSeatChange={handleSeatChange} />
          <CitizensList districtID={selectedDistrict} seatID={selectedSeat} />
        </>
      )}
    </div>
  );
}

export default App;