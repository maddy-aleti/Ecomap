import {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { geocodeMultipleLocations } from '../utils/geocoding.js';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on status
const createCustomIcon = (status, severity) => {
  const getColor = () => {
    if (status === 'resolved') return '#10B981'; // green
    if (status === 'in progress') return '#F59E0B'; // orange
    if (severity === 'severe') return '#EF4444'; // red
    return '#6B7280'; // gray
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${getColor()};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
      ">
        ${status === 'resolved' ? '✓' : '!'}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function Map(){
    const [filter,setFilter]=useState("All");
    const [reports, setReports] = useState([]);
    const [geocodedReports, setGeocodedReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [geocoding, setGeocoding] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default to London

    // Fetch reports from backend
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/reports');
                if (!response.ok) {
                    throw new Error('Failed to fetch reports');
                }
                const data = await response.json();
                setReports(data);
                
                // Start geocoding process
                setGeocoding(true);
                const geocoded = await geocodeMultipleLocations(data);
                setGeocodedReports(geocoded);
                
                // Set map center to first report location if available
                if (geocoded.length > 0 && geocoded[0].lat && geocoded[0].lng) {
                  setMapCenter([geocoded[0].lat, geocoded[0].lng]);
                }
                
                setGeocoding(false);
            } catch (err) {
                setError(err.message);
                setGeocoding(false);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const filteredIssues = filter === "All" ?
        reports : reports.filter(report => report.status === filter.toLowerCase());

    const filteredGeocodedReports = filter === "All" ?
        geocodedReports : geocodedReports.filter(report => report.status === filter.toLowerCase());

    const getStatusColor =(status) =>{
      const statusLower = status?.toLowerCase();
      switch(statusLower){
        case 'pending' : return 'text-red-600 bg-red-100';
        case 'in progress' : return 'text-orange-600 bg-orange-100';
        case 'resolved' : return 'text-green-600 bg-green-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    // Format status for display
    const formatStatus = (status) => {
        if (!status) return 'Pending';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading reports...</div>;
    }

    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-600">Error: {error}</div>;
    }

    return(
      <div className="flex h-screen bg-white">
        {/*side bar*/}
        <aside className ="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/*Header*/}
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="inline-block mb-4 px-4 py-2 text-eco-green border border-eco-green rounded-lg hover:bg-eco-green hover:text-white transition-colors">
              Home
            </Link>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Environmental Issues Map</h2>
            {/*Filter Buttons*/}
            <div className="flex flex-wrap gap-2 mb-4">
              {["All", "Pending", "In Progress", "Resolved"].map(s => (
              <button
                key={s}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === s 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
           <div className="text-sm text-gray-500">
             {filteredIssues.length} issues found
             {geocoding && <span className="ml-2 text-blue-600">(Loading map locations...)</span>}
           </div>
        </div>
        {/*Issue List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredIssues.map(report =>(
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 text-sm leading-tight pr-2">{report.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(report.status)}`}>
                  {formatStatus(report.status)}
                </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{report.description}</p>
                
                {/* Add image display */}
                {report.image_url && (
                  <div className="mb-3">
                    <img 
                      src={`http://localhost:5000/uploads/${report.image_url}`}
                      alt="Report"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {report.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  report.severity === 'severe' ? 'bg-red-100 text-red-800' :
                  report.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {report.severity}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 mb-2">
                <span>📍 {report.location}</span>
              </div>
              
              {report.created_at && (
                <div className="text-xs text-gray-400">
                  Created: {formatDate(report.created_at)}
                </div>
              )}
            </div>
          ))}
        </div>
        </aside>
      {/*Map Area */}
      <main className="flex-1 relative">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {/* Render markers for geocoded reports */}
          {filteredGeocodedReports.map(report => (
            report.lat && report.lng && (
              <Marker 
                key={report.id}
                position={[report.lat, report.lng]}
                icon={createCustomIcon(report.status, report.severity)}
              >
                <Popup>
                  <div className="max-w-xs">
                    <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(report.status)}`}>
                        {formatStatus(report.status)}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {report.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        report.severity === 'severe' ? 'bg-red-100 text-red-800' :
                        report.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.severity}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <div>📍 {report.location}</div>
                      {report.created_at && (
                        <div>📅 {formatDate(report.created_at)}</div>
                      )}
                    </div>
                    
                    {report.image_url && (
                      <img 
                        src={`http://localhost:5000/uploads/${report.image_url}`}
                        alt="Report"
                        className="w-full h-20 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
        
        {/* Loading overlay for geocoding */}
        {geocoding && (
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Loading map locations...</span>
            </div>
          </div>
        )}
      </main>
      </div>
    );
}

export default Map;