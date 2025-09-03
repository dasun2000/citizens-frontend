import React,{useState,useEffect} from "react";
import axios from 'axios';
 const CitizenAnalytics =()=>{

    const [data,setData]=useState({countries:[],territories:[],districts:[],seats:[]});
    const [loading,setloading]=useState(true);
    const [activeTab,setActivetab]=useState('country');

    const API_BASE_URL = "https://citizens-backend-production.up.railway.app";

    useEffect(()=>{
        loadAllData();
    },[]);

    const loadAllData=async()=>{
        setloading(true);
        try{
            const countriesresponse=await axios.get(`${API_BASE_URL}/countries`);
            const countries=countriesresponse.data;

            const countryData=[];
            const territoryData=[];
            const districtData=[];
            const seatData=[];

            for (const country of countries){
                let countryTotal=0;
               
                const territories=await axios.get(`${API_BASE_URL}/territories/${country.ID}`);

                for (const territory of territories.data){
                    let territoryTotal=0;

                    const districts =await axios.get(`${API_BASE_URL}/districts/${territory.ID}`);

                    for(const district of districts.data){
                        const citizens=await axios.get(`${API_BASE_URL}/citizens/district/${district.ID}`);
                        const districtCount =citizens.data.length;
                        territoryTotal +=districtCount;

                        districtData.push({
                            name : district.Districtname,
                            count : districtCount,
                            parent : ` ${territory.TerritoryName},${country.CountryName}`
                        });
                        const seats =await axios.get(`${API_BASE_URL}/seats/${district.ID}`);

                        for(const seat of seats.data){
                            const seatCitizens=await axios.get(`${API_BASE_URL}/citizens/seat/${seat.ID}`);
                            const seatCount=seatCitizens.data.length;

                            seatData.push({
                                name:seat.SeatDescription || `Seat ${seat.ID}`,
                                count : seatCount,
                                parent : `${district.Districtname}, ${territory.TerritoryName}`
                            });
                        }
                    }
                    countryTotal += territoryTotal;

                    territoryData.push({
                        name: territory.TerritoryName,
                        count: territoryTotal,
                        parent : country.CountryName
                    });

            }
            countryData.push({
                name:country.CountryName,
                count:countryTotal,
                parent:''
            });
            }
            seatData({
                countries:countryData,
                territories:territoryData,
                districts:districtData,
                seat:seatData
            });
        }
        catch(error){
            console.error('Error loading data:',error);
        }
        setloading(false);
    };
    if(loading){
        return (
            <div style={{padding:"30px",textAlign:"center"}}>
                <h3>Loading Analytics.......</h3>
            </div>
        );
    }
    const getCurrentData=()=>{
        switch(activeTab){
            case 'country':return data.countries;
            case 'territory': return data.territories;
            case 'district': return data.districts;
            case 'seat' : return data.seats;
            default : return [];
        }
    };
    const currentData=getCurrentData();
    const totalCitizens=data.countries.reduce((sum,item)=>sum + item.count,0);

    return (
        <div style={{padding:"20px",maxWidth:"800px"}}>
            <h2 style={{textAlign:"center"}}>Full Citizen Count Analytics</h2>
            <div style={{}}></div>
        </div>
    )
 }
 export default CitizenAnalytics;