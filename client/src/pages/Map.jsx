import {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Map(){
    const [filter,setFilter]=useState("All");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const filteredIssues = filter === "All" ?
        reports : reports.filter(report => report.status === filter.toLowerCase());

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
           <div className="text-sm text-gray-500">{filteredIssues.length} issues found</div>
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
                <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {report.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  report.severity === 'high' ? 'bg-red-100 text-red-800' :
                  report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {report.severity}
                </span>
                <span>{report.location}</span>
              </div>
            </div>
          ))}
        </div>
        </aside>
      {/*Map Area */}
      <main className="flex-1 relative">
        <MapContainer 
          center={[51.505, -0.09]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
        </MapContainer>
      </main>
      </div>
    );
}

export default Map;