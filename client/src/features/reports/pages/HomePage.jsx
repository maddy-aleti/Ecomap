import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-600">🌍 EcoMap</h1>
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Fix your city, <span className="text-emerald-600">one report</span> at a time.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of citizens making neighborhoods safer, cleaner, and more sustainable through transparent civic action.
          </p>
          <div className="flex gap-4">
            <Link to="/register" className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
              Get Started
            </Link>

          </div>
        </div>
        <div className="bg-emerald-100 h-96 rounded-lg flex items-center justify-center">
          <span className="text-6xl">🗺️</span>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-emerald-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why EcoMap?</h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">📍</div>
              <h4 className="font-bold mb-2">Real-Time Tracking</h4>
              <p className="text-gray-600">Report issues as they happen and track resolution progress in real time.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">✅</div>
              <h4 className="font-bold mb-2">Verified Officials</h4>
              <p className="text-gray-600">Connect directly with verified city officials and get accountability.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="font-bold mb-2">Community Power</h4>
              <p className="text-gray-600">Vote and comment on issues to amplify community concerns.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-emerald-600">5,420+</h3>
            <p className="text-gray-600">Issues Resolved</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-emerald-600">12,340+</h3>
            <p className="text-gray-600">Active Citizens</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-emerald-600">48</h3>
            <p className="text-gray-600">Cities Connected</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-600 text-white py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to make a difference?</h3>
        <p className="text-lg mb-8">Start reporting environmental issues in your neighborhood today.</p>
        <Link to="/register" className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 inline-block">
          Sign Up Now
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 EcoMap. Making cities better, together.</p>
        </div>
      </footer>

    </div>
  );
}

export default HomePage;