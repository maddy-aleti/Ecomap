import {useState} from "react";

const issueData=[
  {
    id: 1,
    title: "Overflowing Trash Bin in Park",
    status: "Pending",
    description: "The trash bin at the east gate of Central Park has overflowed, affecting environmental hygiene",
    votes: 23,
    date: "2024-01-15",
    author: "John Smith"
  },
  {
    id: 2,
    title: "Severe River Water Pollution",
    status: "In Progress",
    description: "The river near the residential area has developed an odor and water quality has significantly...",
    votes: 45,
    date: "2024-01-12",
    author: "Sarah Johnson"
  },
   {
    id: 3,
    title: "Street Noise Pollution",
    status: "Resolved",
    description: "Construction noise is severe, affecting residents' normal life",
    votes: 18,
    date: "2024-01-10",
    author: "Mike Davis"
  }
];

function Map(){
    const [filter,setFilter]=useState("All");
    const filteredIssues = filter=== "All" ?
    issueData : issueData.filter(issue => issue.status === filter);

    const getStatusColor =(status) =>{
      switch(status){
        case 'Pending' : return 'text-red-600 bg-red-100';
        case 'In Progress' : return 'text-orange-600 bg-orange-100';
        case 'Resolved' : return 'text-green-600 bg-green-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };
    return(
      <div className="flex h-screen bg-white">
        {/*side bar*/}
        <aside className ="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/*Header*/}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Environmental Issues Map</h2>
            {/*Filter Buttons*/}
            <div className="flex flex-wrap gap-2 mb-4">
              {["All", "Pending", "In Progress", "Resolved"].map(s => (
              <button
                key={s}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
          {filteredIssues.map(issue =>(
            <div
              key={issue.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 text-sm leading-tight pr-2">{issue.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span>👍</span>
                  <span>{issue.votes}</span>
                </span>
                <span>{issue.date}</span>
                <span>by {issue.author}</span>
              </div>
            </div>
          ))}
        </div>
        </aside>
       {/*Map Area */}
       <main className="flex-1 bg-green-50 relative">
        {/*  Map Placeholder with pin */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* Green location pin */}
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-green-500"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Environmental Map</h3>
            <p className="text-gray-600">Click on issues in the sidebar to view details on the map</p>
          </div>
        </div>
       </main>
      </div>
    );
}

export default Map;