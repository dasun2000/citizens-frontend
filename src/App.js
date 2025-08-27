
import React, { useState } from "react";
import CitizenForm from "./components/CitizenForm";
import CitizensList from "./components/CitizensList";



function App() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSeat,setSelectedSeat]=useState("");

  const handleDistrictChange=(districtID)=>{
    setSelectedDistrict(districtID);
    if(districtID!==selectedDistrict)
    {
      setSelectedSeat("");
    }
  };
  const handleSeatChange=(seatID)=>{
    setSelectedSeat(seatID);
  }

  return (
    <div className="app-container">
      <h1><center>Population Management System</center></h1>
      
      <CitizenForm onDistrictChange={handleDistrictChange} onSeatChange={handleSeatChange}/>

      <CitizensList districtID={selectedDistrict} seatID={selectedSeat}/>
    </div>
  );
}

export default App;