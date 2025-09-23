import { Link } from "react-router-dom";

function ReportIssue() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <Link to="/" className="inline-block mb-6 px-4 py-2 text-eco-green border border-eco-green rounded-lg hover:bg-eco-green hover:text-white transition-colors">
          Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Report Environmental Issue</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Provide detailed information about the environmental issue you discovered to help relevant authorities respond quickly
        </p>
        <form className="space-y-6">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Issue Title *</span>
            <input 
              type="text" 
              placeholder="Brief description of the issue, e.g., 'Overflowing trash bin in park'" 
              maxLength={100}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green focus:border-transparent"
            />
            <span className="text-xs text-gray-400 mt-1 block">0/100</span>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Issue Category *</span>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green focus:border-transparent bg-white">
              <option>Waste Management</option>
              <option>Water Pollution</option>
              <option>Air Quality</option>
              <option>Other</option>
            </select>
          </label>

          <div className="block">
            <span className="block text-sm font-medium text-gray-700 mb-4">Severity Level *</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="border-2 border-yellow-200 bg-yellow-50 p-4 rounded-lg cursor-pointer hover:border-yellow-300 transition-colors">
                <input type="radio" name="severity" value="Minor" className="sr-only" />
                <div>
                  <div className="font-semibold text-yellow-700">Minor</div>
                  <div className="text-sm text-yellow-600">Low impact</div>
                </div>
              </label>
              <label className="border-2 border-orange-200 bg-orange-50 p-4 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
                <input type="radio" name="severity" value="Moderate" className="sr-only" />
                <div>
                  <div className="font-semibold text-orange-700">Moderate</div>
                  <div className="text-sm text-orange-600">Needs attention</div>
                </div>
              </label>
              <label className="border-2 border-red-200 bg-red-50 p-4 rounded-lg cursor-pointer hover:border-red-300 transition-colors">
                <input type="radio" name="severity" value="Severe" className="sr-only" />
                <div>
                  <div className="font-semibold text-red-700">Severe</div>
                  <div className="text-sm text-red-600">Urgent action needed</div>
                </div>
              </label>
            </div>
          </div>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</span>
            <textarea 
              placeholder="Please provide detailed information about the issue, including specific conditions, time of occurrence, impact area, etc..." 
              maxLength={500}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green focus:border-transparent resize-vertical"
            />
            <span className="text-xs text-gray-400 mt-1 block">0/500</span>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Location Information *</span>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter specific address or click on map to select location"
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" fill="#2ecc40" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </span>
            </div>
            <span className="text-xs text-gray-500 mt-1 block">GPS positioning is recommended for precise location</span>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Related Photos</span>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <svg width="32" height="32" fill="#b2b2b2" viewBox="0 0 24 24" className="mx-auto mb-4">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-3l2.5-3.01L17 17H7l3-4z"/>
              </svg>
              <div className="font-semibold text-gray-700 mb-1">Upload Issue Photos</div>
              <div className="text-gray-600 mb-1">Drag photos here or click to select files</div>
              <div className="text-xs text-gray-500">Supports JPG, PNG formats, maximum 5 photos</div>
            </div>
          </label>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-eco-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Submit Report
            </button>
            <button 
              type="button" 
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;