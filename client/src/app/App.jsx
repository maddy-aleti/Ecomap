import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import Home from "../features/reports/pages/HomePage";
import Login from "../features/auth/pages/LoginPage";
import Register from "../features/auth/pages/RegisterPage";
import AuthCallback from "../features/auth/pages/AuthCallback";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import ReportIssue from "../features/reports/pages/ReportIssuePage";
import InstagramFeedMap from "../features/map/pages/MapPage";
import Dashboard from "../features/dashboard/pages/DashboardPage";
import AdminPanel from "../features/admin/pages/AdminPanelPage";

function App() {
  return (
     <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
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
