import { useState } from 'react'
/*import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
import './App.css'
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import { Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
     <div>
      <h1>EcoMap</h1>
      <Router>
        <nav>
          <Link to="/">Home</Link> | {" "}
          <Link to="/login">Login</Link> | {" "}
          <Link to="/register">Register</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
      <p>Welcome to your community eco-reporting platform</p>
     </div>
  );
}

export default App
