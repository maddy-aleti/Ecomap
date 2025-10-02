import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [stats, setStats] = useState({
    userReports: { total_reports: 0, pending_reports: 0, in_progress_reports: 0, resolved_reports: 0 },
    nearbyIssues: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchUserData();
    fetchUserReports();
    fetchDashboardStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserReports = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const reports = await response.json();
        setUserReports(reports);
      }
    } catch (error) {
      console.error('Error fetching user reports:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const formatUserDate = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-red-100 text-red-600';
      case 'in progress': return 'bg-yellow-100 text-yellow-600';
      case 'resolved': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'severe': return 'bg-red-100 text-red-600';
      case 'moderate': return 'bg-yellow-100 text-yellow-600';
      case 'minor': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredReports = filter === 'All' 
    ? userReports 
    : userReports.filter(report => {
        if (filter === 'Pending') return report.status === 'pending';
        if (filter === 'In Progress') return report.status === 'in progress';
        if (filter === 'Resolved') return report.status === 'resolved';
        return true;
      });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-2xl font-bold text-gray-800">
              <div className="w-8 h-8 bg-eco-green rounded-lg flex items-center justify-center mr-2">
                <span className="text-white text-sm">🌱</span>
              </div>
              EcoMap
            </div>
            <nav className="flex space-x-6 ml-8">
              <Link to="/map" className="px-4 py-2 bg-eco-green text-white rounded-lg text-sm font-medium">Map View</Link>
              <Link to="/report" className="px-4 py-2 bg-eco-green text-white rounded-lg text-sm font-medium">Report Issue</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <span className="text-sm font-medium">{user?.name || 'Loading...'}</span>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-eco-green to-green-600 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
              <p className="text-green-100">
                {user?.role || 'Member'} • Member since {user?.created_at ? formatUserDate(user.created_at) : '2024'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.nearbyIssues}</p>
                <p className="text-sm text-gray-600">Issues Nearby</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.userReports.in_progress_reports}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.userReports.resolved_reports}</p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm hidden lg:block">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.userReports.total_reports}</p>
                <p className="text-sm text-gray-600">Total Reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex space-x-4 mb-6">
          {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
            <button 
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-eco-green text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status} ({
                status === 'All' ? userReports.length :
                status === 'Pending' ? stats.userReports.pending_reports :
                status === 'In Progress' ? stats.userReports.in_progress_reports :
                stats.userReports.resolved_reports
              })
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">No reports found for the selected filter.</p>
              <Link 
                to="/report" 
                className="inline-block mt-4 px-6 py-2 bg-eco-green text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Create Your First Report
              </Link>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-sm text-gray-500">{formatDate(report.created_at)}</span>
                      <span className="text-sm text-gray-500">📍 {report.location}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{report.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                    <div className="flex space-x-2 mb-4">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(report.status)}`}>
                        {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                        {report.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(report.severity)}`}>
                        {report.severity?.charAt(0).toUpperCase() + report.severity?.slice(1)}
                      </span>
                    </div>
                    {report.image_url && (
                      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                        <img 
                          src={`http://localhost:5000/uploads/${report.image_url}`} 
                          alt="Report"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>👍 0</span>
                        <span>💬 0</span>
                        <span>📤 Share</span>
                      </div>
                      <button className="px-4 py-2 bg-eco-green text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;