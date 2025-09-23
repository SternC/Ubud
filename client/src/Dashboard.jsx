import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios.get("http://localhost:5000/logout").then(() => {
      window.location.reload();
    });
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  const handleDeleteUser = (id) => {
    axios
      .get(`http://localhost:5000/delete/${id}`)
      .then((res) => {
        if (res.status === 200) {
          fetchUsers();
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/authentication")
      .then((res) => {
        if (res.status === 200) {
          setAuth(true);
          setMessage(res.data.message);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage("Please login to view this page");
        }
      })
      .catch((err) => {
        console.error(err);
        setAuth(false);
        setMessage("Please login to view this page");
      });
  }, []);

  useEffect(() => {
    if (auth) {
      fetchUsers();
    }
  }, [auth]);

  return (
    <div className="bg-gradient-to-b from-[#FFFBDE] via-[#FFF0C4] to-[#FFF9AF] flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl text-center">
        {auth ? (
          <>
            <h1 className="text-2xl font-bold mb-2">Welcome, {name} 👋</h1>
            <p className="text-gray-600 mb-4">{message}</p>

            <div className="overflow-x-auto">
              <table className="min-w-full border text-left text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{user.name}</td>
                      <td className="px-4 py-2 border">{user.email}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                        <Link
                          to={`/edit/${user.id}`}
                          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleLogout}
              className="inline-block mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
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
