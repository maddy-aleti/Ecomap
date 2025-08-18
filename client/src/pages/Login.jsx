import {useState } from "react";
import api from "../api/axios";
import "./Login.css"; 

function Login(){
    const [form,setForm]= useState({ email :"", password: ""});
    const [message,setMessage]= useState("");

    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    };

    const handleSubmit= async (e)=>{
          e.preventDefault();
          try{
            const res = await api.post("/login",form);
            setMessage(res.data.message || "Login successful");
            // Save the token for future use
            localStorage.setItem("token", res.data.token);
          }catch(err){
            setMessage(err.response.data.message || "Login failed");
          }
    }
    return (
        <div className="login-section">
        <form className="login-form-container" onSubmit={handleSubmit}>
            <h2>Login Page</h2>
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required/> <br />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required /> <br />
            <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
        </div>
    );
}
export default Login;