import React, { useState } from "react";
import axios from "axios";

function LoginForm({onLogin}){
    const [form,setForm]=useState({
        username:"",
        password:""
    });
    const [error,setError]=useState("");
    
const API_BASE_URL = "https://citizens-backend-production.up.railway.app";

const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("");

    try{
        const response = await axios.post(`${API_BASE_URL}/login`,{
            username:form.username,
            password:form.password
        });
        if(response.data.success){
            onLogin(true,response.data.user);
        }
    }
    catch(error){
        if(error.response && error.response.data){
            setError(error.response.data.message||"login failed");
        }
        else
            setError("please try again");
    }
};
const handleChange=(e)=>{
    const {name,value}=e.target;
    setForm ({ ...form,[name]:value});
    setError ("");
}

    return(
        <div>
        <form onSubmit={handleSubmit} style={{padding:"40px",borderRadius:"10px",maxWidth:"400px", border:"1px solid #ddd", margin:"50px auto"}}>
            <h1>Population Managment System</h1>
            <h3>Login</h3>
            <div style={{marginBottom:"15px"}}>
                <label>Username:</label>
                <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Enter Username"required style={{padding:"8px"}}/>
            </div>
            <div  style={{marginBottom:"15px"}}>
                <label>Password:</label>
                <input type="password" name="password" value={form.password} onChange={handleChange}  placeholder="Enter Password"required style={{padding:"8px"}}/>
            </div>
                <button type="submit" style={{padding:"10px",backgroundColor:"blue",color:"white",width:"100%"}}>Login</button>

            
            {
                error && (<div>{error}</div>
           ) }
        </form>
        </div>
    )
}
export default LoginForm;