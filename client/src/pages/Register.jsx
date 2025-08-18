import {useState} from "react";
import api from "../api/axios";
import "./Register.css"; 

function Register(){
    const [form,setForm]=useState({name:"",email:"",password:""});
    const [message,setMessage]=useState("");

    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    };

    const handleSubmit= async (e)=>{
          e.preventDefault();
          try{
            const res = await api.post("/register",form);
            setMessage(res.data.message || "Registration successful");
          }catch(err){
            setMessage(err.response.data.message || "Registration failed");
          }
    }
    return (
        <div className="register-section">
        <form className="register-form-container" onSubmit={handleSubmit}>
            <h2>Register Page</h2>
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required/> <br />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required/> <br />  
            <input type="password" name="password" placeholder="Password" value = {form.password} onChange={handleChange} required /> <br />
            <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
        </div>
    );
}
export default Register;