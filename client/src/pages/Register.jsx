import { useState } from "react";
import api from "../api/axios";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Citizen",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (!form.agree) {
      setMessage("You must agree to the terms");
      return;
    }
    try {
      const res = await api.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setMessage(res.data.message || "Registration successful");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-bg">
      <div className="register-card">
        <div className="register-logo-title">
          <span className="register-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#2ecc40" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C10 10 2 12 2 12s2 8 10 10c8-2 10-10 10-10s-8-2-10-10z"/>
            </svg>
          </span>
          <span className="register-title">EcoMap</span>
        </div>
        <div className="register-subtitle">Create your account</div>
        <form className="register-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input type="text" name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email Address
            <input type="email" name="email" placeholder="Enter your email address" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            User Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="Citizen">Citizen</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Official">Official</option>
            </select>
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
          </label>
          <label>
            Confirm Password
            <input type="password" name="confirmPassword" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} required />
          </label>
          <label className="register-checkbox">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            <span>
              I have read and agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </span>
          </label>
          <button type="submit" className="register-btn-main">Create Account</button>
          {message && <div className="register-message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default Register;