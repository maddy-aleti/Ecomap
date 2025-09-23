import { Link } from "react-router-dom";

function Dashboard() {
  // Mock user data - replace with actual user data from context/state
  const user = {
    name: "John Smith",
    location: "Downtown Area",
    memberSince: "2024"
  };

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
            <span className="text-sm font-medium">{user.name}</span>
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
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-green-100">{user.location} • Member since {user.memberSince}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Changed to always display horizontally */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">8</p>
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
                <p className="text-2xl font-bold text-gray-800">3</p>
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
                <p className="text-2xl font-bold text-gray-800">12</p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </div>
          {/* This fourth card will only show on larger screens */}
          <div className="bg-white rounded-lg p-4 shadow-sm hidden lg:block">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">23</p>
                <p className="text-sm text-gray-600">Total Reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex space-x-4 mb-6">
          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium">All Issues (4)</button>
          <button className="px-4 py-2 text-gray-600 rounded-lg text-sm">Pending (2)</button>
          <button className="px-4 py-2 text-gray-600 rounded-lg text-sm">In Progress (1)</button>
          <button className="px-4 py-2 text-gray-600 rounded-lg text-sm">Resolved (1)</button>
        </div>

        {/* Issue Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium">Sarah Chen</span>
                <span className="text-sm text-gray-500">2 hours ago</span>
                <span className="text-sm text-gray-500">📍 0.3 km</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Overflowing Trash Bin at Central Park</h3>
              <p className="text-gray-600 text-sm mb-4">
                The main trash can near the playground has been overflowing for 2 days. Kids are playing around scattered garbage.
              </p>
              <div className="flex space-x-2 mb-4">
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">Pending</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">🚮 Waste</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded">⚠️ Medium</span>
              </div>
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>👍 23</span>
                  <span>💬 8</span>
                  <span>📤 Share</span>
                </div>
                <button className="px-4 py-2 bg-eco-green text-white rounded-lg text-sm font-medium">View Details →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;