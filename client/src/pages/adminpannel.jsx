import { useState, useEffect } from 'react';

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/reports`);
        if (!response.ok) throw new Error('Failed to fetch reports');
        
        const data = await response.json();
        setReports(data);
        
        // Set first department as selected
        if (data.length > 0) {
          const firstDept = data[0].department || 'Uncategorized';
          setSelectedDept(firstDept);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated]);

  // Get unique departments from reports
  const getDepartmentsList = () => {
    const depts = [...new Set(reports.map(r => r.department || 'Uncategorized'))];
    return depts.map(dept => ({
      key: dept,
      name: dept,
      icon: getDepartmentIcon(dept),
      color: getDepartmentColor(dept),
      issues: reports.filter(r => (r.department || 'Uncategorized') === dept)
    }));
  };

  const getDepartmentIcon = (dept) => {
    const icons = {
      'Road & Infrastructure': '🛣️',
      'Electricity & Power': '⚡',
      'Drainage & Sewage': '💧',
      'Health & Sanitation': '🏥',
      'Transport & Traffic': '🚗'
    };
    return icons[dept] || '📋';
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'Road & Infrastructure': 'from-blue-500 to-blue-600',
      'Electricity & Power': 'from-yellow-500 to-yellow-600',
      'Drainage & Sewage': 'from-cyan-500 to-cyan-600',
      'Health & Sanitation': 'from-red-500 to-red-600',
      'Transport & Traffic': 'from-green-500 to-green-600'
    };
    return colors[dept] || 'from-purple-500 to-purple-600';
  };

  // Hardcoded department data (fallback)
  const departmentsData = {
    road: {
      name: 'Road & Infrastructure',
      icon: '🛣️',
      color: 'from-blue-500 to-blue-600',
      issues: [
        { id: 1, title: 'Pothole on Main Street', severity: 'High', status: 'Pending', date: '2025-12-18', upvotes: 45 },
        { id: 2, title: 'Broken sidewalk near park', severity: 'Medium', status: 'In Progress', date: '2025-12-17', upvotes: 28 },
        { id: 3, title: 'Road markings faded', severity: 'Low', status: 'Resolved', date: '2025-12-15', upvotes: 12 },
        { id: 4, title: 'Street light damaged', severity: 'High', status: 'Pending', date: '2025-12-16', upvotes: 38 },
        { id: 5, title: 'Debris on highway', severity: 'Medium', status: 'In Progress', date: '2025-12-14', upvotes: 22 }
      ]
    },
    electricity: {
      name: 'Electricity & Power',
      icon: '⚡',
      color: 'from-yellow-500 to-yellow-600',
      issues: [
        { id: 1, title: 'Power outage in residential area', severity: 'High', status: 'Pending', date: '2025-12-19', upvotes: 67 },
        { id: 2, title: 'Broken street light', severity: 'Medium', status: 'In Progress', date: '2025-12-18', upvotes: 34 },
        { id: 3, title: 'Voltage fluctuation', severity: 'Medium', status: 'Resolved', date: '2025-12-16', upvotes: 19 },
        { id: 4, title: 'Exposed electrical wire', severity: 'High', status: 'Pending', date: '2025-12-17', upvotes: 52 },
        { id: 5, title: 'Faulty meter reading', severity: 'Low', status: 'Resolved', date: '2025-12-13', upvotes: 8 }
      ]
    },
    drainage: {
      name: 'Drainage & Sewage',
      icon: '💧',
      color: 'from-cyan-500 to-cyan-600',
      issues: [
        { id: 1, title: 'Clogged drain causing flooding', severity: 'High', status: 'Pending', date: '2025-12-19', upvotes: 78 },
        { id: 2, title: 'Sewage pipe leakage', severity: 'High', status: 'In Progress', date: '2025-12-18', upvotes: 61 },
        { id: 3, title: 'Stagnant water in residential area', severity: 'Medium', status: 'Pending', date: '2025-12-17', upvotes: 43 },
        { id: 4, title: 'Drain grate missing', severity: 'High', status: 'Resolved', date: '2025-12-14', upvotes: 35 },
        { id: 5, title: 'Bad smell from drainage', severity: 'Medium', status: 'In Progress', date: '2025-12-16', upvotes: 29 }
      ]
    },
    health: {
      name: 'Health & Sanitation',
      icon: '🏥',
      color: 'from-red-500 to-red-600',
      issues: [
        { id: 1, title: 'Hospital waste disposal issue', severity: 'High', status: 'Pending', date: '2025-12-19', upvotes: 55 },
        { id: 2, title: 'Pest infestation in market', severity: 'High', status: 'In Progress', date: '2025-12-18', upvotes: 42 },
        { id: 3, title: 'Unhygienic food stall conditions', severity: 'Medium', status: 'Pending', date: '2025-12-17', upvotes: 31 },
        { id: 4, title: 'Water contamination issue', severity: 'High', status: 'Resolved', date: '2025-12-15', upvotes: 48 },
        { id: 5, title: 'Missing dustbins in public area', severity: 'Low', status: 'In Progress', date: '2025-12-16', upvotes: 18 }
      ]
    },
    transport: {
      name: 'Transport & Traffic',
      icon: '🚗',
      color: 'from-green-500 to-green-600',
      issues: [
        { id: 1, title: 'Traffic signal malfunction', severity: 'High', status: 'Pending', date: '2025-12-19', upvotes: 63 },
        { id: 2, title: 'Bus stop vandalism', severity: 'Medium', status: 'In Progress', date: '2025-12-18', upvotes: 24 },
        { id: 3, title: 'Illegally parked vehicles blocking road', severity: 'Medium', status: 'Resolved', date: '2025-12-17', upvotes: 39 },
        { id: 4, title: 'Missing road divider', severity: 'High', status: 'Pending', date: '2025-12-16', upvotes: 47 },
        { id: 5, title: 'Bus route not following scheduled time', severity: 'Low', status: 'In Progress', date: '2025-12-14', upvotes: 16 }
      ]
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (localStorage.getItem('role') === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('You do not have admin privileges');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const getSeverityColor = (severityLevel) => {
    switch(severityLevel) {
      case 'Severe': return 'bg-red-50 text-red-700 border border-red-200';
      case 'Moderate': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Minor': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-slate-50 text-slate-700 border border-slate-200';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'resolved': return 'bg-green-50 text-green-700 border border-green-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0em0wIDI4YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0ek0xNiAzNmMtMi4yMSAwLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00LTEuNzktNC00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-full p-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          
          <div className="mt-8 mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-500">Citizen Grievance Management System</p>
          </div>
          
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Access Dashboard
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-600 text-center font-medium">
              🔐 Admin access requires admin role in your account
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentDept = getDepartmentsList().find(d => d.key === selectedDept) || getDepartmentsList()[0];
  const allDepts = getDepartmentsList();
  
  const stats = {
    totalIssues: reports.length,
    pending: reports.filter(i => i.status === 'pending').length,
    inProgress: reports.filter(i => i.status === 'in_progress').length,
    resolved: reports.filter(i => i.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-3 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Citizen Grievance Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white border-2 border-red-200 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all font-semibold shadow-sm hover:shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-xl p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Issues</div>
            <div className="text-4xl font-bold text-gray-900 mt-2">{stats.totalIssues}</div>
            <div className="text-sm text-gray-500 mt-2">Across all departments</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 rounded-xl p-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending</div>
            <div className="text-4xl font-bold text-amber-600 mt-2">{stats.pending}</div>
            <div className="text-sm text-gray-500 mt-2">Awaiting attention</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-xl p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">In Progress</div>
            <div className="text-4xl font-bold text-blue-600 mt-2">{stats.inProgress}</div>
            <div className="text-sm text-gray-500 mt-2">Being addressed</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 rounded-xl p-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Resolved</div>
            <div className="text-4xl font-bold text-emerald-600 mt-2">{stats.resolved}</div>
            <div className="text-sm text-gray-500 mt-2">Successfully completed</div>
          </div>
        </div>

        {/* Department Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Department Selection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {allDepts.map((dept) => (
              <button
                key={dept.key}
                onClick={() => setSelectedDept(dept.key)}
                className={`relative p-6 rounded-2xl font-semibold transition-all transform hover:scale-105 ${
                  selectedDept === dept.key
                    ? `bg-gradient-to-br ${dept.color} text-white shadow-xl`
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 border border-gray-200 shadow-sm'
                }`}
              >
                <div className="text-4xl mb-3">{dept.icon}</div>
                <div className="text-sm font-bold">{dept.name}</div>
                <div className={`text-xs mt-1 ${selectedDept === dept.key ? 'text-white opacity-90' : 'text-gray-500'}`}>
                  {dept.issues.length} issues
                </div>
                {selectedDept === dept.key && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="text-4xl mr-3">{currentDept?.icon}</span>
              <div>
                <div>{currentDept?.name}</div>
                <div className="text-sm font-normal text-gray-500 mt-1">{currentDept?.issues?.length || 0} total issues</div>
              </div>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p>Error loading reports: {error}</p>
            </div>
          ) : currentDept?.issues?.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No issues found in this department</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide">Issue Title</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide">Severity</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide">Status</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide">Date</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide">Location</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDept?.issues?.map((issue, idx) => (
                    <tr key={issue._id} className={`border-t border-gray-200 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900 max-w-xs truncate">{issue.title}</div>
                        <div className="text-xs text-gray-500 mt-1">ID: #{issue._id?.slice(-8)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getSeverityColor(issue.severityLevel)}`}>
                          {issue.severityLevel || 'Minor'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(issue.status)}`}>
                          {formatStatus(issue.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">{formatDate(issue.createdAt)}</td>
                      <td className="py-4 px-6 text-gray-600 text-sm max-w-xs truncate">{issue.location}</td>
                      <td className="py-4 px-6">
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold text-sm hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;