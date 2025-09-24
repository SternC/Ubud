import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form values in one object
  const [value, setValue] = useState({
    userName: "",
    userEmail: ""
  });

  // single handleChange (like your Login)
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  // Check authentication first
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

  // load user data
  useEffect(() => {
    if (auth) {
      axios
        .get(`http://localhost:5000/edit/${id}`)
        .then((res) => {
          setValue({
            userName: res.data.name,
            userEmail: res.data.email
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load user");
          setLoading(false);
        });
    }
  }, [auth, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/edit/${id}`, {
        name: value.userName,
        email: value.userEmail,
      })
      .then((res) => {
        if (res.status === 200) {
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to update user");
      });
  };

  if (!auth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">Unauthorized</h1>
          <p className="text-gray-600">{message}</p>
          <Link
            to="/login"
            className="inline-block mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center">Loading…</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Edit User #{id} — Logged in as {name}
        </h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="userName"
              value={value.userName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="userEmail"
              value={value.userEmail}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            Return to Dashboard
          </Link>
        </form>
      </div>
    </div>
  );
}
