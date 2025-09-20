import React, { useState, useEffect } from "react";

function App(){

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <p className="text-blue-500">{data.message}</p>
    </div>
  )
}

export default App;