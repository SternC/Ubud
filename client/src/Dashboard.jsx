import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  axios.defaults.withCredentials = true;

  const handleDelete = () => {
    axios.get("http://localhost:5000/logout")
        .then (res => {
            if (res.status === 200){
                location.reload(true);
            }
        })
        .catch(err => {
            console.log(err);
        })
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/dashboard")
      .then((res) => {
        if (res.status === 200) {
          setAuth(true);
          setMessage(res.data.message);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage("Please login to view this page");
          setName("");
        }
      })
      .catch((err) => {
        console.error(err);
        setAuth(false);
        setMessage("Please login to view this page");
        setName("");
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        {auth ? (
          <>
            <h1 className="text-2xl font-bold mb-2">Welcome, {name} 👋</h1>
            <p className="text-gray-600">{message}</p>
            <Link
              to="/login"
              className="inline-block mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={handleDelete}
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-2">Unauthorized</h1>
            <p className="text-gray-600">{message}</p>
            <Link
              to="/login"
              className="inline-block mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
