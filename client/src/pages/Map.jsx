// import { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { Link } from "react-router-dom";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // Custom marker icon
// const createCustomIcon = (status, severity) => {
//   const getColor = () => {
//     if (status === "resolved") return "#10B981"; // green
//     if (status === "in progress") return "#F59E0B"; // orange
//     if (severity === "high") return "#EF4444"; // red
//     if (severity === "moderate") return "#F97316"; // amber
//     return "#6B7280"; // gray
//   };

//   return L.divIcon({
//     className: "custom-marker",
//     html: `
//       <div style="
//         background:${getColor()};
//         width:24px;
//         height:24px;
//         border-radius:50%;
//         border:3px solid white;
//         display:flex;
//         align-items:center;
//         justify-content:center;
//         color:white;
//         font-size:12px;
//         font-weight:bold;">
//         !
//       </div>
//     `,
//     iconSize: [24, 24],
//     iconAnchor: [12, 12],
//   });
// };

// function Map() {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India
//   const [filter, setFilter] = useState("All");
//   const [geocoding, setGeocoding] = useState(false);
//   const [reportVotes, setReportVotes] = useState({});
//   const [reportComments, setReportComments] = useState({});
//   const [showComments, setShowComments] = useState({});

//   // Filter reports based on selected status
//   const filteredIssues = filter === "All" 
//     ? reports 
//     : reports.filter(report => report.status === filter.toLowerCase().replace(" ", "_"));

//   // Filter for geocoded reports (with valid coordinates)
//   const filteredGeocodedReports = filteredIssues.filter(report => report.lat && report.lng);

//   // Helper functions for status display
//   const getStatusColor = (status) => {
//     switch(status?.toLowerCase()) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "in_progress":
//         return "bg-blue-100 text-blue-800";
//       case "resolved":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatStatus = (status) => {
//     if (!status) return "Unknown";
//     return status
//       .toLowerCase()
//       .replace(/_/g, " ")
//       .split(" ")
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   const handleVote = async (reportId, voteType) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/votes`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           report_id: reportId,
//           vote_type: voteType
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setReportVotes(prev => ({
//           ...prev,
//           [reportId]: {
//             upvotes: data.upvotes || 0,
//             downvotes: data.downvotes || 0
//           }
//         }));
//       }
//     } catch (error) {
//       console.error('Error voting:', error);
//     }
//   };

//   // Get user's current location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setMapCenter([latitude, longitude]);
//         },
//         (error) => {
//           console.warn("Geolocation error:", error);
//           // Fall back to default India location if permission denied
//         }
//       );
//     }
//   }, []);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_SERVER_URL}/reports`
//         );

//         if (!res.ok) {
//           throw new Error("Failed to fetch reports");
//         }

//         const data = await res.json();

//         const normalized = data
//           .map((r) => ({
//             ...r,
//             id: r._id || r.id,
//             lat: Number(r.latitude),
//             lng: Number(r.longitude),
//           }))
//           .filter((r) => r.lat && r.lng); // IMPORTANT

//         setReports(normalized);

//         if (normalized.length > 0) {
//           setMapCenter([normalized[0].lat, normalized[0].lng]);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         Loading reports...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen items-center justify-center text-red-600">
//         Error: {error}
//       </div>
//     );
//   }


//     return(
//       <div className="flex h-screen bg-white">
//         {/*side bar*/}
//         <aside className ="w-96 bg-white border-r border-gray-200 flex flex-col">
//           {/*Header*/}
//           <div className="p-6 border-b border-gray-200">
//             <Link to="/" className="inline-block mb-4 px-4 py-2 text-eco-green border border-eco-green rounded-lg hover:bg-eco-green hover:text-white transition-colors">
//               Home
//             </Link>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Environmental Issues Map</h2>
//             {/*Filter Buttons*/}
//             <div className="flex flex-wrap gap-2 mb-4">
//               {["All", "Pending", "In Progress", "Resolved"].map(s => (
//               <button
//                 key={s}
//                 className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
//                   filter === s 
//                     ? 'bg-green-500 text-white' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//                 onClick={() => setFilter(s)}
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//            <div className="text-sm text-gray-500">
//              {filteredIssues.length} issues found
//              {geocoding && <span className="ml-2 text-blue-600">(Loading map locations...)</span>}
//            </div>
//         </div>
//         {/*Issue List */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-3">
//           {filteredIssues.map(report =>(
//             <div
//               key={report.id}
//               className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-start justify-between mb-2">
//                 <h3 className="font-medium text-gray-900 text-sm leading-tight pr-2">{report.title}</h3>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(report.status)}`}>
//                   {formatStatus(report.status)}
//                 </span>
//                 </div>
//                 <p className="text-gray-600 text-sm mb-3 line-clamp-2">{report.description}</p>
                
//                 {/* Add image display */}
//                 {report.image_url && (
//                   <div className="mb-3">
//                     <img 
//                       src={`${import.meta.env.VITE_SERVER_URL}/uploads/${report.image_url}`}
//                       alt="Report"
//                       className="w-full h-32 object-cover rounded-lg"
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                       }}
//                     />
//                   </div>
//                 )}
                
//                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
//                 <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
//                   {report.category}
//                 </span>
//                 <span className={`px-2 py-1 rounded text-xs ${
//                   report.severity === 'severe' ? 'bg-red-100 text-red-800' :
//                   report.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
//                   'bg-green-100 text-green-800'
//                 }`}>
//                   {report.severity}
//                 </span>
//               </div>
              
//               <div className="text-xs text-gray-500 mb-2">
//                 <span>📍 {report.location}</span>
//               </div>
              
//               {report.created_at && (
//                 <div className="text-xs text-gray-400 mb-3">
//                   Created: {formatDate(report.created_at)}
//                 </div>
//               )}

//               {/* Voting and Comments Section */}
//               <div className="border-t pt-3 mt-3">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center space-x-4 text-xs">
//                     {/* Voting */}
//                     <div className="flex items-center space-x-2">
//                       <button 
//                         onClick={() => handleVote(report.id, 'upvote')}
//                         className="flex items-center space-x-1 hover:text-green-600 transition-colors"
//                       >
//                         <span>👍</span>
//                         <span>{reportVotes[report.id]?.upvotes || 0}</span>
//                       </button>
//                       <button 
//                         onClick={() => handleVote(report.id, 'downvote')}
//                         className="flex items-center space-x-1 hover:text-red-600 transition-colors"
//                       >
//                         <span>👎</span>
//                         <span>{reportVotes[report.id]?.downvotes || 0}</span>
//                       </button>
//                     </div>
                    
//                     {/* Comments Toggle */}
//                     <button 
//                       onClick={() => setShowComments(prev => ({...prev, [report.id]: !prev[report.id]}))}
//                       className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
//                     >
//                       <span>💬</span>
//                       <span>{reportComments[report.id]?.length || 0}</span>
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Comments Section */}
//                 {showComments[report.id] && (
//                   <div className="mt-2 space-y-2">
//                     {/* Add Comment */}
//                     <div className="flex space-x-2">
//                       <input
//                         type="text"
//                         value={commentInputs[report.id] || ''}
//                         onChange={(e) => setCommentInputs(prev => ({...prev, [report.id]: e.target.value}))}
//                         placeholder="Add a comment..."
//                         className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-eco-green"
//                         onKeyPress={(e) => e.key === 'Enter' && handleAddComment(report.id)}
//                       />
//                       <button
//                         onClick={() => handleAddComment(report.id)}
//                         className="px-2 py-1 bg-eco-green text-white rounded text-xs hover:bg-green-600 transition-colors"
//                       >
//                         Post
//                       </button>
//                     </div>
                    
//                     {/* Comments List */}
//                     <div className="space-y-1 max-h-24 overflow-y-auto">
//                       {reportComments[report.id]?.map((comment, index) => (
//                         <div key={index} className="bg-gray-50 p-2 rounded">
//                           <div className="flex items-center space-x-1 mb-1">
//                             <span className="text-xs font-medium text-gray-700">User {comment.user_id}</span>
//                             <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
//                           </div>
//                           <p className="text-xs text-gray-600">{comment.comment}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//         </aside>
//       {/*Map Area */}
//       <main className="flex-1 relative">
//         <MapContainer 
//           center={mapCenter} 
//           zoom={13} 
//           style={{ height: '100%', width: '100%' }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           />
          
//           {/* Render markers for geocoded reports */}
//           {filteredGeocodedReports.map(report => (
//             report.lat && report.lng && (
//               <Marker 
//                 key={report.id}
//                 position={[report.lat, report.lng]}
//                 icon={createCustomIcon(report.status, report.severity)}
//               >
//                 <Popup>
//                   <div className="max-w-xs">
//                     <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
//                     <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    
//                     <div className="flex flex-wrap gap-1 mb-2">
//                       <span className={`px-2 py-1 rounded text-xs ${getStatusColor(report.status)}`}>
//                         {formatStatus(report.status)}
//                       </span>
//                       <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
//                         {report.category}
//                       </span>
//                       <span className={`px-2 py-1 rounded text-xs ${
//                         report.severity === 'severe' ? 'bg-red-100 text-red-800' :
//                         report.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-green-100 text-green-800'
//                       }`}>
//                         {report.severity}
//                       </span>
//                     </div>
                    
//                     {/* Voting in Popup */}
//                     <div className="flex items-center space-x-3 mb-2 text-sm">
//                       <button 
//                         onClick={() => handleVote(report.id, 'upvote')}
//                         className="flex items-center space-x-1 hover:text-green-600"
//                       >
//                         <span>👍</span>
//                         <span>{reportVotes[report.id]?.upvotes || 0}</span>
//                       </button>
//                       <button 
//                         onClick={() => handleVote(report.id, 'downvote')}
//                         className="flex items-center space-x-1 hover:text-red-600"
//                       >
//                         <span>👎</span>
//                         <span>{reportVotes[report.id]?.downvotes || 0}</span>
//                       </button>
//                       <span className="flex items-center space-x-1">
//                         <span>💬</span>
//                         <span>{reportComments[report.id]?.length || 0}</span>
//                       </span>
//                     </div>
                    
//                     <div className="text-xs text-gray-500">
//                       <div>📍 {report.location}</div>
//                       {report.created_at && (
//                         <div>📅 {formatDate(report.created_at)}</div>
//                       )}
//                     </div>
                    
//                     {report.image_url && (
//                       <img 
//                         src={`${import.meta.env.VITE_SERVER_URL}/uploads/${report.image_url}`}
//                         alt="Report"
//                         className="w-full h-20 object-cover rounded mt-2"
//                       />
//                     )}
//                   </div>
//                 </Popup>
//               </Marker>
//             )
//           ))}
//         </MapContainer>
        
//         {/* Loading overlay for geocoding */}
//         {geocoding && (
//           <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
//             <div className="flex items-center space-x-2">
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//               <span className="text-sm text-gray-600">Loading map locations...</span>
//             </div>
//           </div>
//         )}
//       </main>
//       </div>
//     );
// }

// export default Map;

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon
const createCustomIcon = (status, severityLevel) => {
  const getColor = () => {
    if (status === "resolved") return "#10B981";
    if (status === "in_progress") return "#F59E0B";
    if (severityLevel === "Severe") return "#EF4444";
    if (severityLevel === "Moderate") return "#F97316";
    return "#6B7280";
  };

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background:${getColor()};
        width:24px;
        height:24px;
        border-radius:50%;
        border:3px solid white;
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-size:12px;
        font-weight:bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
        !
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function InstagramFeedMap() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [filter, setFilter] = useState("All");
  const [reportVotes, setReportVotes] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [reportComments, setReportComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const filteredIssues = filter === "All" 
    ? reports 
    : reports.filter(report => report.status === filter.toLowerCase().replace(" ", "_"));

  const filteredGeocodedReports = filteredIssues.filter(report => report.lat && report.lng);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleVote = async (reportId, voteType) => {
    // Prevent voting if user already voted
    if (userVotes[reportId]) {
      console.log('User already voted on this report');
      alert('You have already voted on this report');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Voting:', { reportId, voteType, token });
      
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/reports/${reportId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vote_type: voteType
        })
      });

      console.log('Vote response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Vote response data:', data);
        
        // Fetch updated votes
        await fetchVotesForReport(reportId);
        
        // Mark that user voted
        setUserVotes(prev => ({
          ...prev,
          [reportId]: true
        }));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Vote failed:', response.statusText, errorData);
        
        // Handle already voted error
        if (response.status === 400 && errorData.error?.includes('already voted')) {
          setUserVotes(prev => ({
            ...prev,
            [reportId]: true
          }));
          alert('You have already voted on this report');
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const fetchVotesForReport = async (reportId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/reports/${reportId}/votes`);
      if (response.ok) {
        const data = await response.json();
        console.log('Votes fetched:', { reportId, data });
        // Count the array size as number of votes
        const voteCount = Array.isArray(data) ? data.length : 0;
        setReportVotes(prev => ({
          ...prev,
          [reportId]: { upvotes: voteCount }
        }));
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const handleAddComment = (reportId) => {
    const commentText = commentInputs[reportId]?.trim();
    if (!commentText) return;
    
    setReportComments(prev => ({
      ...prev,
      [reportId]: [
        ...(prev[reportId] || []),
        {
          user_id: "current_user",
          comment: commentText,
          created_at: new Date().toISOString()
        }
      ]
    }));
    
    setCommentInputs(prev => ({...prev, [reportId]: ''}));
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.warn("Geolocation error:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/reports`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data = await res.json();

        const normalized = data
          .map((r) => ({
            ...r,
            id: r._id || r.id,
            lat: Number(r.latitude),
            lng: Number(r.longitude),
          }))
          .filter((r) => r.lat && r.lng);

        setReports(normalized);
        
        // Fetch votes for all reports
        normalized.forEach(report => {
          fetchVotesForReport(report.id);
        });

        if (normalized.length > 0 && filter === "All") {
          setMapCenter([normalized[0].lat, normalized[0].lng]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600 bg-white">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Instagram-Style Feed */}
      <div className="w-[470px] bg-white border-r border-gray-200 flex flex-col">
        {/* Header - Instagram Style */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              EcoWatch
            </h1>
          </div>
          
          {/* Filter Pills */}
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {["All", "Pending", "In Progress", "Resolved"].map(s => (
              <button
                key={s}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  filter === s 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Content */}
        <div className="flex-1 overflow-y-auto">
          {filteredIssues.map(report => (
            <div key={report.id} className="bg-white border-b border-gray-200">
              {/* Post Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                    {report.location.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{report.location}</div>
                    <div className="text-xs text-gray-500">{formatDate(report.createdAt)}</div>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {/* Post Image */}
              <div className="relative w-full bg-gray-100" style={{paddingBottom: '100%'}}>
                {report.imageUrl ? (
                  <img 
                    src={`${import.meta.env.VITE_SERVER_URL}/uploads/${report.imageUrl}`}
                    alt="Report"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">🌍</div>
                      <div className="text-gray-600 font-medium">{report.department || 'Uncategorized'}</div>
                    </div>
                  </div>
                )}
                
                {/* Severity Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                    report.severityLevel === 'Severe' ? 'bg-red-500 text-white' :
                    report.severityLevel === 'Moderate' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {report.severityLevel || 'UNKNOWN'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleVote(report.id, 'upvote')}
                      disabled={userVotes[report.id]}
                      className={`flex items-center space-x-1 transition-opacity ${userVotes[report.id] ? 'cursor-not-allowed opacity-70' : 'hover:opacity-70'}`}
                      title={userVotes[report.id] ? 'You already voted on this report' : 'Vote on this report'}
                    >
                      <svg 
                        className={`w-7 h-7 ${userVotes[report.id] ? 'fill-red-500' : 'fill-none'}`} 
                        stroke={userVotes[report.id] ? 'none' : 'currentColor'} 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">{reportVotes[report.id]?.upvotes || 0}</span>
                    </button>
                    <button 
                      onClick={() => setShowComments(prev => ({...prev, [report.id]: !prev[report.id]}))}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    <button className="hover:opacity-70 transition-opacity">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                  <button className="hover:opacity-70 transition-opacity">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {/* Likes Count */}
                <div className="font-semibold text-sm mb-2">
                  {reportVotes[report.id]?.upvotes || 0} supports
                </div>

                {/* Caption */}
                <div className="text-sm mb-2">
                  <span className="font-semibold">{report.location}</span>
                  <span className="ml-2">{report.title}</span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  {report.description}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {formatStatus(report.status)}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {report.department || 'Uncategorized'}
                  </span>
                </div>

                {/* Comments Section */}
                {showComments[report.id] && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="space-y-3 mb-3 max-h-40 overflow-y-auto">
                      {reportComments[report.id]?.map((comment, index) => (
                        <div key={index} className="flex space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-semibold">User {comment.user_id}</span>
                              <span className="ml-2 text-gray-700">{comment.comment}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(comment.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add Comment Input */}
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                      <input
                        type="text"
                        value={commentInputs[report.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({...prev, [report.id]: e.target.value}))}
                        placeholder="Add a comment..."
                        className="flex-1 text-sm focus:outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(report.id)}
                      />
                      {commentInputs[report.id] && (
                        <button
                          onClick={() => handleAddComment(report.id)}
                          className="text-green-600 font-semibold text-sm hover:text-green-700"
                        >
                          Post
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredIssues.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="text-6xl mb-4">🌱</div>
              <div className="text-lg font-medium">No issues found</div>
              <div className="text-sm">Try adjusting your filters</div>
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
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
          
          {filteredGeocodedReports.map(report => (
            report.lat && report.lng && (
              <Marker 
                key={report.id}
                position={[report.lat, report.lng]}
                icon={createCustomIcon(report.status, report.severityLevel)}
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
                        {report.department || 'Uncategorized'}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <div>📍 {report.location}</div>
                      {report.createdAt && (
                        <div>📅 {formatDate(report.createdAt)}</div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </main>
    </div>
  );
}

export default InstagramFeedMap;