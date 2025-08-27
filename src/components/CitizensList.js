import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

function CitizensList({ districtID, seatID }) {
    const [citizens, setCitizens] = useState([]);
    const [currentView, setCurrentView] = useState(""); 
    const printRef = useRef();

    useEffect(() => {
        if (seatID) {
            axios.get(`http://localhost:5000/citizens/seat/${seatID}`)
                .then(res => {
                    setCitizens(res.data);
                    setCurrentView("seat");
                })
                .catch(err => console.error(err));
        } else if (districtID) {
            axios.get(`http://localhost:5000/citizens/district/${districtID}`)
                .then(res => {
                    setCitizens(res.data);
                    setCurrentView("district");
                })
                .catch(err => console.error(err));
        } else {
            setCitizens([]);
            setCurrentView("");
        }
    }, [districtID, seatID]);

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    if (!districtID && !seatID) {
        return <center><p>Please select a district or seat to view citizens.</p></center>;
    }
    
    if (citizens.length === 0) {
        return (
            <center><p>{currentView === "district" ? "No citizens found in this district."  : "No citizens found in this seat."}</p></center>
        );
    }
    
    return (
        <center> 
            <h3>{currentView === "district"  ? "District Citizens List" : "Seat Citizens List"}</h3>
            
            <div style={{ marginBottom: "20px" }}>
                <button  onClick={handlePrint}>Print {currentView === "district" ? "District" : "Seat"} Citizens List</button>
            </div>

            <div ref={printRef}>
                <table border="1" >
                    <thead>
                        <tr>
                            <th>Citizen Name</th>
                            <th>NIC</th>
                            <th>DOB</th>
                            <th>City</th>
                            <th>Job</th>
                            <th>Salary</th>
                            <th>Marital Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citizens.map(c => (
                            <tr key={c.ID}>
                                <td>{c.CitizenName}</td>
                                <td>{c.NIC}</td>
                                <td>{new Date(c.DOB).toLocaleDateString()}</td>
                                <td>{c.City}</td>
                                <td>{c.Job}</td>
                                <td>{c.Salary}</td>
                                <td>{c.MaritalStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </center> 
    );
}

export default CitizensList;