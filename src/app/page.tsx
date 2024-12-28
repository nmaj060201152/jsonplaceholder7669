'use client'
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("/posts"); // Default route
  const [inputs, setInputs] = useState({});
  const [columns, setColumns] = useState([]);

  // Column headers for each route
  const routeColumns = {
    "/posts": ["User ID", "ID", "Title", "Body"],
    "/comments": ["Post ID", "ID", "Name", "Email", "Body"],
    "/albums": ["User ID", "ID", "Title"],
    "/photos": ["Album ID", "ID", "Title", "URL", "Thumbnail URL"],
    "/todos": ["User ID", "ID", "Title", "Completed"],
    "/users": ["ID", "Name", "Username", "Email", "Phone", "Website", "Company Name"],
  };

  // Map data keys for each route
  const routeKeys = {
    "/posts": ["userId", "id", "title", "body"],
    "/comments": ["postId", "id", "name", "email", "body"],
    "/albums": ["userId", "id", "title"],
    "/photos": ["albumId", "id", "title", "url", "thumbnailUrl"],
    "/todos": ["userId", "id", "title", "completed"],
    "/users": ["id", "name", "username", "email", "phone", "website", "company.name"],
  };

  // Fetch data on route change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com${currentRoute}`);
        const result = await response.json();
        setData(result);
        setColumns(routeColumns[currentRoute] || []); // Set columns dynamically
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [currentRoute]);

  // Filter data (currently no filtering keys provided for complex routes)
  const filterData = () => {
    const filtered = data.filter((item) => {
      return Object.keys(inputs).every((key) => {
        // Match the current key with the API data key
        const dataKey = routeKeys[currentRoute].find(
          (routeKey) => routeKey.toLowerCase() === key.toLowerCase()
        );
  
        // If no data key is found or input is empty, skip this key
        if (!dataKey || !inputs[key]) return true;
  
        // Handle exact match for numeric keys (e.g., id) and substring match for others
        if (typeof item[dataKey] === "number") {
          return item[dataKey] === Number(inputs[key]); // Exact match for numbers
        }
  
        if (typeof item[dataKey] === "string") {
          return item[dataKey]
            .toLowerCase()
            .includes(inputs[key].toLowerCase()); // Substring match for strings
        }
  
        return false; // If data type doesn't match
      });
    });
  
    setFilteredData(filtered); // Update filtered data
    setShowTable(true); // Show the table
  };
  















  // Clear page and reset state
  const clearPage = () => {
    setFilteredData([]);
    setShowTable(false);
    setInputs({});
  };

  // Route Buttons
  const routes = [
    { name: "Posts", path: "/posts" },
    { name: "Comments", path: "/comments" },
    { name: "Albums", path: "/albums" },
    { name: "Photos", path: "/photos" },
    { name: "Todos", path: "/todos" },
    { name: "Users", path: "/users" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-black text-white">Sunday Assignment <br />(Data Fetching through API, Static & Dynamic)</h1>
      <br /><br />

      <div className="flex space-x-4 mb-4">
        {routes.map((route) => (
          <button
            key={route.path}
            onClick={() => {
              setCurrentRoute(route.path);
              setShowTable(false);
            }}
            className={`px-4 py-2 rounded ${
              currentRoute === route.path ? "bg-blue-700 text-white" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {route.name}
          </button>
        ))}
      </div>

      {!showTable ? (
        <div>
          <button
            onClick={() => setShowTable(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Show All Data
          </button>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {columns.slice(0, 4).map((col, index) => (
              <input
                key={index}
                name={col}
                value={inputs[col] || ""}
                onChange={(e) => setInputs({ ...inputs, [col]: e.target.value })}
                placeholder={col}
                className="border px-2 py-1 rounded"
              />
            ))}
            <button
              onClick={filterData}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Show Data
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={clearPage}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
          >
            Clear Page
          </button>
          <div className="overflow-auto max-h-96">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {columns.map((col, index) => (
                    <th key={index} className="border px-4 py-2">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(filteredData.length > 0 ? filteredData : data).map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {routeKeys[currentRoute].map((key, colIndex) => (
                      <td key={colIndex} className="border px-4 py-2">
                        {key.includes(".")
                          ? key.split(".").reduce((acc, part) => acc?.[part], item) || "-"
                          : item[key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
