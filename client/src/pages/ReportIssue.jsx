import { Link } from "react-router-dom";
import { useState } from "react";

function ReportIssue() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Waste Management",
    severity: "",
    description: "",
    location: ""
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [titleCount, setTitleCount] = useState(0);
  const [descriptionCount, setDescriptionCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update character counts
    if (name === 'title') {
      setTitleCount(value.length);
    } else if (name === 'description') {
      setDescriptionCount(value.length);
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('Maximum 5 photos allowed');
      return;
    }
    setPhotos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.severity || !formData.description || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        alert('Please login to report an issue');
        return;
      }

      // Decode JWT token to get user_id
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user_id = payload.id || payload.userId; // Adjust based on your JWT structure

      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description); // Send only the actual description
      submitData.append('category', formData.category); // Send category separately
      submitData.append('severity', formData.severity); // Send severity separately
      submitData.append('location', formData.location);
      submitData.append('user_id', user_id);
      
      // Add photos if any
      if (photos.length > 0) {
        submitData.append('image', photos[0]); // Backend expects single image
      }

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
         headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData
      });

      if (response.ok) {
        const result = await response.json();
        alert('Report submitted successfully!');
        // Reset form
        setFormData({
          title: "",
          category: "Waste Management",
          severity: "",
          description: "",
          location: ""
        });
        setPhotos([]);
        setTitleCount(0);
        setDescriptionCount(0);
      } else {
        const error = await response.json();
        if (response.status === 403) {
        alert('Authentication failed. Please login again.');
        // Optionally redirect to login page
        // window.location.href = '/login';
      } else {
        alert(`Error: ${error.error || 'Failed to submit report'}`);
      }
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      category: "Waste Management",
      severity: "",
      description: "",
      location: ""
    });
    setPhotos([]);
    setTitleCount(0);
    setDescriptionCount(0);
  };

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Issue Title *</span>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief description of the issue, e.g., 'Overflowing trash bin in park'" 
              maxLength={100}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green focus:border-transparent"
              required
            />
            <span className="text-xs text-gray-400 mt-1 block">{titleCount}/100</span>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Issue Category *</span>
            <select 
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green focus:border-transparent bg-white"
            >
              <option value="Waste Management">Waste Management</option>
              <option value="Water Pollution">Water Pollution</option>
              <option value="Air Quality">Air Quality</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <div className="block">
            <span className="block text-sm font-medium text-gray-700 mb-4">Severity Level *</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className={`border-2 p-4 rounded-lg cursor-pointer transition-colors ${formData.severity === 'Minor' ? 'border-yellow-400 bg-yellow-100' : 'border-yellow-200 bg-yellow-50 hover:border-yellow-300'}`}>
                <input 
                  type="radio" 
                  name="severity" 
                  value="Minor" 
                  checked={formData.severity === 'Minor'}
                  onChange={handleInputChange}
                  className="sr-only" 
                />
                <div>
                  <div className="font-semibold text-yellow-700">Minor</div>
                  <div className="text-sm text-yellow-600">Low impact</div>
                </div>
              </label>
              <label className={`border-2 p-4 rounded-lg cursor-pointer transition-colors ${formData.severity === 'Moderate' ? 'border-orange-400 bg-orange-100' : 'border-orange-200 bg-orange-50 hover:border-orange-300'}`}>
                <input 
                  type="radio" 
                  name="severity" 
                  value="Moderate" 
                  checked={formData.severity === 'Moderate'}
                  onChange={handleInputChange}
                  className="sr-only" 
                />
                <div>
                  <div className="font-semibold text-orange-700">Moderate</div>
                  <div className="text-sm text-orange-600">Needs attention</div>
                </div>
              </label>
              <label className={`border-2 p-4 rounded-lg cursor-pointer transition-colors ${formData.severity === 'Severe' ? 'border-red-400 bg-red-100' : 'border-red-200 bg-red-50 hover:border-red-300'}`}>
                <input 
                  type="radio" 
                  name="severity" 
                  value="Severe" 
                  checked={formData.severity === 'Severe'}
                  onChange={handleInputChange}
                  className="sr-only" 
                />
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
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please provide detailed information about the issue, including specific conditions, time of occurrence, impact area, etc..." 
              maxLength={500}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green focus:border-transparent resize-vertical"
              required
            />
            <span className="text-xs text-gray-400 mt-1 block">{descriptionCount}/500</span>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Location Information *</span>
            <div className="relative">
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter specific address or click on map to select location"
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green focus:border-transparent"
                required
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
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <svg width="32" height="32" fill="#b2b2b2" viewBox="0 0 24 24" className="mx-auto mb-4">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-3l2.5-3.01L17 17H7l3-4z"/>
                </svg>
                <div className="font-semibold text-gray-700 mb-1">Upload Issue Photos</div>
                <div className="text-gray-600 mb-1">Drag photos here or click to select files</div>
                <div className="text-xs text-gray-500">Supports JPG, PNG formats, maximum 5 photos</div>
              </label>
            </div>
            {photos.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {photos.length} photo(s) selected
              </div>
            )}
          </label>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                loading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-eco-green text-white hover:bg-green-600'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
            <button 
              type="button"
              onClick={handleCancel}
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