import React, { useState, useEffect } from "react";
import axios from "axios";;

function CitizenForm({ onDistrictChange ,onSeatChange,onAllSelected,onSelection}) {
  const [countries, setCountries] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [seats, setSeats] = useState([]);
  const [form, setForm] = useState({
    CountryID: "",
    TerritoryID: "",
    DistrictID: "",
    SeatID: "",
    CitizenName: "",
    NIC: "",
    City: "",
    Address1: "",
    Address2: "",
    DOB: "",
    Job: "",
    Salary: "",
    MaritalStatus: "",
    Auser: "admin",
    Muser: "admin",
    Terminal: "web"
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalForm, setModalForm] = useState({});
  
 
  const API_BASE_URL = "https://citizens-backend-production.up.railway.app";
  
  useEffect(() => {
    loadCountries();
  }, []);
 
  const loadCountries = () => {
    axios.get(`${API_BASE_URL}/countries`)
      .then(res => setCountries(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (form.CountryID) {
      axios.get(`${API_BASE_URL}/territories/${form.CountryID}`)
        .then(res => setTerritories(res.data))
        .catch(err => console.log(err));
    } else {
      setTerritories([]);
      setDistricts([]);
      setSeats([]);
      setForm(prev => ({...prev, TerritoryID: "", DistrictID: "", SeatID: ""}));
    }
  }, [form.CountryID]);

  useEffect(() => {
    if (form.TerritoryID) {
      axios.get(`${API_BASE_URL}/districts/${form.TerritoryID}`)
        .then(res => setDistricts(res.data))
        .catch(err => console.log(err));
    } else {
      setDistricts([]);
      setSeats([]);
      setForm(prev => ({...prev, DistrictID: "", SeatID: ""}));
    }
  }, [form.TerritoryID]);

  useEffect(() => {
    if (form.DistrictID) {
      axios.get(`${API_BASE_URL}/seats/${form.DistrictID}`)
        .then(res => setSeats(res.data))
        .catch(err => console.log(err));

      if (onDistrictChange) onDistrictChange(form.DistrictID);
    } else {
      setSeats([]);
      setForm(prev => ({...prev, SeatID: ""}));
      if (onDistrictChange) onDistrictChange("");
    }
  }, [form.DistrictID, onDistrictChange]);

  useEffect(()=>{
    if(form.SeatID && onSeatChange){
      onSeatChange(form.SeatID);
    }
    else if(onSeatChange){
      onSeatChange("");
    }
  },[form.SeatID,onSeatChange]);

  useEffect(()=>{
    if(form.CountryID && form.TerritoryID && form.DistrictID && form.SeatID){
      if(onAllSelected)onAllSelected(true);
      if(onSelection)onSelection({
        countryId:form.CountryID,
        territoryId:form.TerritoryID,
        districtId:form.DistrictID,
        seatId:form.SeatID
      });
    }
    else{
      if(onAllSelected)onAllSelected(false);
    }
  },[form.CountryID,form.TerritoryID,form.DistrictID,form.SeatID,onAllSelected,onSelection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE_URL}/citizens`, form)
      .then(res => {
        alert(res.data.message);
        setForm({
          CountryID: "",
          TerritoryID: "",
          DistrictID: "",
          SeatID: "",
          CitizenName: "",
          NIC: "",
          City: "",
          Address1: "",
          Address2: "",
          DOB: "",
          Job: "",
          Salary: "",
          MaritalStatus: "",
          Auser: "admin",
          Muser: "admin",
          Terminal: "web"
        });
        setSeats([]);
        if (onDistrictChange) onDistrictChange("");
        if(onSeatChange)onSeatChange("");
        if(onAllSelected)onAllSelected(false);
      })
      .catch(err => {
        console.log(err);
        alert("Error adding citizen.");
      });
  };

  const openModal = (type) => {
    setModalType(type);
    
    setModalForm({
      CountryID: form.CountryID || "",
      TerritoryID: form.TerritoryID || "",
      DistricID: form.DistrictID || "",
      Auser: "admin",
      Muser: "admin",
      Terminal: "web"
    });
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalForm({});
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalForm({ ...modalForm, [name]: value });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();

    let url = "";
    if (modalType === "country") {
      url = `${API_BASE_URL}/countries`;
    } else if (modalType === "territory") {
      url = `${API_BASE_URL}/territories`;
    } else if (modalType === "district") {
      url = `${API_BASE_URL}/districts`;
    } else if (modalType === "seat") {
      url = `${API_BASE_URL}/seats`;
    }
    
    if (url) {
      axios.post(url, modalForm)
        .then(res => {
          alert(res.data.message);
          closeModal();
        
          if (modalType === "country") {
            loadCountries();
          } else if (modalType === "territory" && form.CountryID === modalForm.CountryID) {
            axios.get(`${API_BASE_URL}/territories/${form.CountryID}`)
              .then(res => setTerritories(res.data))
              .catch(err => console.log(err));
          } else if (modalType === "district" && form.TerritoryID === modalForm.TerritoryID) {
            axios.get(`${API_BASE_URL}/districts/${form.TerritoryID}`)
              .then(res => setDistricts(res.data))
              .catch(err => console.log(err));
          } else if (modalType === "seat" && form.DistrictID === modalForm.DistrictID) {
            axios.get(`${API_BASE_URL}/seats/${form.DistrictID}`)
              .then(res => setSeats(res.data))
              .catch(err => console.log(err));
          }
        })
        .catch(err => {
          console.log(err);
          alert("Error");
        });
    }
  };

  const renderModal = () => {
    if (!showModal) {
      return null;
    }
    
     let title = `Add new ${modalType}`;
    let fields = [];
    
    if (modalType === "country") {
      fields = [
        {name: "CountryID", label: "Country ID", type: "number", required: true},
        {name: "CountryName", label: "Country Name", type: "text", required: true}
      ];
    } else if (modalType === "territory") {
      fields = [
        {name: "CountryID", label: "Country ID", type: "number", required: true, value: form.CountryID},
        {name: "TerritoryName", label: "Territory Name", type: "text", required: true},
        {name: "TerritoryShortName", label: "Short Name", type: "text", required: true}
      ];
    } else if (modalType === "district") {
      fields = [
        {name: "CountryID", label: "Country ID", type: "number", required: true, value: form.CountryID},
        {name: "TerritoryID", label: "Territory ID", type: "number", required: true, value: form.TerritoryID},
        {name: "DistrictName", label: "District Name", type: "text", required: true}
      ];
    } else if (modalType === "seat") {
      fields = [
        {name: "CountryID", label: "Country ID", type: "number", required: true, value: form.CountryID},
        {name: "TerritoryID", label: "Territory ID", type: "number", required: true, value: form.TerritoryID},
        {name: "DistricID", label: "District ID", type: "number", required: true, value: form.DistrictID},
        {name: "SeatDescption", label: "Seat Description", type: "text", required: true}
      ];
    }
    
    return (
      <div style={{position: "fixed",top: 0,left: 0,right: 0,bottom: 0,display: "flex",justifyContent: "right",alignItems: "center"}}>
        <div style={{backgroundColor: "white",padding: "20px",borderRadius: "5px"}}>
          <h3>{title}</h3>
          <form onSubmit={handleModalSubmit}>
            {fields.map(field => (
              <div key={field.name} style={{marginBottom: "10px"}}>
                <label>{field.label}: </label>
                <input type={field.type} name={field.name} value={modalForm[field.name] || (field.value || "")} onChange={handleModalChange} required={field.required} disabled={field.value !== undefined}style={{width: "100%", padding: "5px"}}/>
              </div>
            ))}
          </form>
          <div >
            <button onClick={handleModalSubmit}>{title}</button><button onClick={closeModal}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{padding: "20px"}}>
      <form onSubmit={handleSubmit} style={{margin: "30px auto", border: "1px solid #000000", borderRadius: "10px", maxWidth: "500px", padding: "20px"}}>
        <h3 style={{textAlign: "center"}}>Citizen Registration</h3>
        
        <div style={{marginBottom: "10px", display: "flex", alignItems: "center"}}>
          <div style={{flex: 1}}>
            <label>Country: </label>
            <select name="CountryID" onChange={handleChange} value={form.CountryID} required style={{padding: "8px", width: "100%"}}>
              <option value="">Select Country</option>
              {countries.map(c => <option key={c.ID} value={c.ID}>{c.CountryName}</option>)}
            </select>
          </div>
          <button type="button"onClick={() => openModal("country")}style={{marginLeft: "10px", padding: "8px"}}>Add Countries</button>
        </div>

        <div style={{marginBottom: "10px", display: "flex", alignItems: "center"}}>
          <div style={{flex: 1}}>
            <label>Territory: </label>
            <select name="TerritoryID" onChange={handleChange} value={form.TerritoryID} required style={{padding: "8px", width: "100%"}}>
              <option value="">Select Territory</option>
              {territories.map(t => <option key={t.ID} value={t.ID}>{t.TerritoryName}</option>)}
            </select>
          </div>
          <button type="button" onClick={() => openModal("territory")}  disabled={!form.CountryID}style={{marginLeft: "10px", padding: "8px"}}>Add Territories</button>
        </div>

        <div style={{marginBottom: "10px", display: "flex", alignItems: "center"}}>
          <div style={{flex: 1}}>
            <label>District: </label>
            <select name="DistrictID" onChange={handleChange} value={form.DistrictID} required style={{padding: "8px", width: "100%"}}>
              <option value="">Select District</option>
              {districts.map(d => <option key={d.ID} value={d.ID}>{d.DistrictName}</option>)}
            </select>
          </div>
          <button 
            type="button" onClick={() => openModal("district")} disabled={!form.TerritoryID}style={{marginLeft: "10px", padding: "8px"}}>Add District</button>
        </div>

        <div style={{marginBottom: "10px", display: "flex", alignItems: "center"}}>
          <div style={{flex: 1}}>
            <label>Seat: </label>
            <select name="SeatID" onChange={handleChange} value={form.SeatID} required style={{padding: "8px", width: "100%"}}>
              <option value="">Select Seat</option>
              {seats.map(s => <option key={s.ID} value={s.ID}>{s.SeatDescption}</option>)}
            </select>
          </div>
          <button type="button" onClick={() => openModal("seat")} disabled={!form.DistrictID}style={{marginLeft: "10px", padding: "8px"}}>Add Seats</button>
        </div>

        <div style={{marginBottom: "10px"}}>
          <input type="text" name="CitizenName"placeholder="Citizen Name" onChange={handleChange} value={form.CitizenName}required style={{ padding: "8px"}}/>
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <input type="text" name="NIC" placeholder="NIC" onChange={handleChange}value={form.NIC}required style={{ padding: "8px"}}/>
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <input type="text" name="City" placeholder="City"  onChange={handleChange}value={form.City}style={{padding: "8px"}}/>
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <input type="text" name="Address1" placeholder="Address Line 1"  onChange={handleChange}value={form.Address1} required style={{ padding: "8px"}}/>
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <input type="text" name="Address2" placeholder="Address Line 2"  onChange={handleChange}value={form.Address2} required style={{ padding: "8px"}}/>
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <input type="date" name="DOB" onChange={handleChange}value={form.DOB}required style={{padding: "8px"}}/>
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <input type="text" name="Job" placeholder="Job"  onChange={handleChange}value={form.Job}style={{ padding: "8px"}}/>
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <input type="number" name="Salary" placeholder="Salary"   onChange={handleChange}value={form.Salary}style={{padding: "8px"}} />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <input  type="text"  name="MaritalStatus"  placeholder="Marital Status"   onChange={handleChange}value={form.MaritalStatus}style={{padding: "8px"}}
          />
        </div>

        <button type="submit"  >Submit</button></form>
      
      {renderModal()}
    </div>
  );
}

export default CitizenForm;