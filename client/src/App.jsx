import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import { Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportIssue from "./pages/ReportIssue";
import InstagramFeedMap from "./pages/Map";
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/adminpannel';

function App() {
  return (
     <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/map" element={<InstagramFeedMap />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
     </div>
  );
}

export default App
