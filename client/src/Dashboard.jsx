import React, { useEffect, useState } from "react";
import api from "./api";
import {
  Menu,
  X,
  Edit,
  Trash2,
  UserPlus,
  ShoppingCart,
  Database,
  User,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [adminName, setAdminName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  // Users
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    is_admin: false,
  });
  const [userEditing, setUserEditing] = useState(false);

  // Courses
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
    oldPrice: "",
  });
  const [courseEditing, setCourseEditing] = useState(false);

  // Purchases
  const [purchases, setPurchases] = useState([]);

  const handleDownloadReport = () => {
  api
    .get(`/purchases/download-report?t=${Date.now()}`, {
      withCredentials: true,
      responseType: "blob",
    })
    .then((res) => {
      const file = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "purchase-report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    })
    .catch((err) => console.error("Error downloading report:", err));
};



  // Profiles
  const [profiles, setProfiles] = useState([]);

  // Coaches
  const [coaches, setCoaches] = useState([]);

  // Auth check
  useEffect(() => {
    api
      .get("/authentication", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setAuth(true);
          setAdminName(res.data.name || "");
          setAuthMessage(res.data.message || "");
        }
      })
      .catch(() => {
        setAuth(false);
        setAuthMessage("Please login to view this page");
      });
  }, []);

  // Fetch data
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users", {
        withCredentials: true,
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses", {
        withCredentials: true,
      });
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await api.get("/purchases", {
        withCredentials: true,
      });
      setPurchases(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfiles = async () => {
    try {
      const res = await api.get("/profiles", {
        withCredentials: true,
      });
      setProfiles(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [allCoaches, setAllCoaches] = useState([]);

  const fetchCoaches = async () => {
    try {
      const res = await api.get("/coaches", {
        withCredentials: true,
      });
      setCoaches(res.data || []);
   
      setAllCoaches(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    if (search === "") {
      setAllUsers(users);
    }
  }, [users, search]);

  useEffect(() => {
    if (search === "") {
      setAllProfiles(profiles);
    }
  }, [profiles, search]);

  useEffect(() => {
    if (search === "") {
      setAllCoaches(coaches);
    }
  }, [coaches, search]);

  useEffect(() => {
    setSearch("");
  
    setUsers(allUsers);
    setProfiles(allProfiles);
    setCoaches(allCoaches);
  }, [activeTab]); 


  const handleSearchChange = (value) => {
    const q = (value || "").trim().toLowerCase();
    setSearch(value);

    if (q === "") {
  
      setUsers(allUsers);
      setProfiles(allProfiles);
      setCoaches(allCoaches);
      return;
    }

    if (activeTab === "users") {
      setUsers(
        (allUsers || []).filter(
          (u) =>
            (u?.name || "").toLowerCase().includes(q) ||
            (u?.email || "").toLowerCase().includes(q)
        )
      );
    } else if (activeTab === "profiles") {
      setProfiles(
        (allProfiles || []).filter(
          (p) =>
            (p?.name || "").toLowerCase().includes(q) ||
            (p?.email || "").toLowerCase().includes(q) ||
            (String(p?.age || "") || "").toLowerCase().includes(q) ||
            (p?.skill || "").toLowerCase().includes(q) ||
            (p?.interest || "").toLowerCase().includes(q) ||
            (p?.city || "").toLowerCase().includes(q)
        )
      );
    } else if (activeTab === "coaches") {
      setCoaches(
        (allCoaches || []).filter(
          (c) =>
            (c?.Profile?.name || "").toLowerCase().includes(q) ||
            (c?.Profile?.email || "").toLowerCase().includes(q) ||
            (c?.teachingField || "").toLowerCase().includes(q) ||
            (c?.status || "").toLowerCase().includes(q)
        )
      );
    }
  };

  useEffect(() => {
    if (auth) {
      fetchUsers();
      fetchCourses();
      fetchPurchases();
      fetchProfiles();
      fetchCoaches();
    }
  }, [auth]);

  const handleLogout = async () => {
    await api.get("/logout", { withCredentials: true });
    navigate("/login");
  };

  // USERS CRUD
  const startEditUser = (u) => {
    setUserForm({
      id: u.id,
      name: u.name,
      email: u.email,
      password: "",
      is_admin: !!u.is_admin,
    });
    setUserEditing(true);
  };

  const cancelUserEdit = () => {
    setUserEditing(false);
    setUserForm({
      id: null,
      name: "",
      email: "",
      password: "",
      is_admin: false,
    });
  };

  const submitUser = async (e) => {
    e.preventDefault();
    try {
      if (userEditing) {
        // Update user
        await api.put(
          `/edit/${userForm.id}`,
          {
            name: userForm.name,
            email: userForm.email,
            password: userForm.password,
            is_admin: userForm.is_admin,
          },
          { withCredentials: true }
        );
      } else {
        await api.post(
          "/users",
          {
            name: userForm.name,
            email: userForm.email,
            password: userForm.password,
            is_admin: userForm.is_admin,
          },
          { withCredentials: true }
        );
      }

      cancelUserEdit();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(
        "User operation failed: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`, {
      withCredentials: true,
    });
    fetchUsers();
  };

  // COURSES CRUD
  const startEditCourse = (c) => {
    setCourseForm(c);
    setCourseEditing(true);
  };

  const cancelCourseEdit = () => {
    setCourseEditing(false);
    setCourseForm({
      id: "",
      title: "",
      description: "",
      price: "",
      oldPrice: "",
    });
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    try {
      if (courseEditing) {
        await api.put(`/courses/${courseForm.id}`, courseForm, {
          withCredentials: true,
        });
        const data = {
          id: courseForm.id,
          title: courseForm.title,
          description: courseForm.description,
          price: parseFloat(courseForm.price) || 0,
          oldPrice: parseFloat(courseForm.oldPrice) || 0,
        };

        if (courseEditing) {
          await api.put(`/courses/${courseForm.id}`, data, {
            withCredentials: true,
          });
        } else {
          await api.post("/courses", data, {
            withCredentials: true,
          });
        }
      } else {
        await api.post("/courses", courseForm, {
          withCredentials: true,
        });
      }
      cancelCourseEdit();
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCourse = async (id) => {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/courses/${id}`, {
      withCredentials: true,
    });
    fetchCourses();
  };

  // PURCHASES
  const deletePurchase = async (id) => {
    if (!confirm("Delete this purchase record?")) return;
    await api.delete(`/purchases/${id}`, {
      withCredentials: true,
    });
    fetchPurchases();
  };

  const formatDate = (s) => {
    if (!s) return "N/A";
    return new Date(s).toLocaleString();
  };

  if (!auth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFBE6] text-gray-800">
        <h1 className="text-2xl font-semibold mb-2">Unauthorized</h1>
        <p className="text-gray-600">{authMessage}</p>
        <Link
          to="/login"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
   <div className="min-h-screen flex bg-[#f8fafc] relative">
      {/* Sidebar */}
      <aside
          className={`fixed lg:relative top-0 left-0 h-screen bg-gradient-to-b from-[#0b2a45] to-[#1f4c7b] 
          text-white w-64 p-6 flex flex-col transition-transform duration-300 z-20 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >


        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left py-2 px-3 rounded ${
              activeTab === "users" ? "bg-[#154d71]" : "hover:bg-[#133d5c]"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`w-full text-left py-2 px-3 rounded ${
              activeTab === "courses" ? "bg-[#154d71]" : "hover:bg-[#133d5c]"
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab("purchases")}
            className={`w-full text-left py-2 px-3 rounded ${
              activeTab === "purchases" ? "bg-[#154d71]" : "hover:bg-[#133d5c]"
            }`}
          >
            Purchases
          </button>
          <button
            onClick={() => setActiveTab("profiles")}
            className={`w-full text-left py-2 px-3 rounded ${
              activeTab === "profiles" ? "bg-[#154d71]" : "hover:bg-[#133d5c]"
            }`}
          >
            Profiles
          </button>
          <button
            onClick={() => setActiveTab("coaches")}
            className={`w-full text-left py-2 px-3 rounded ${
              activeTab === "coaches" ? "bg-[#154d71]" : "hover:bg-[#133d5c]"
            }`}
          >
            Coaches
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 py-2 px-3 rounded-md transition"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
     <div className="flex-1 p-6 lg:ml-6 transition-all duration-300">

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden mb-4 p-2 border rounded"
        >
          <Menu />
        </button>
        <h1 className="text-3xl font-bold text-[#0b2a45] mb-6">
          Welcome, {adminName} 👋
        </h1>

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <div className="bg-white p-5 rounded shadow mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <UserPlus /> {userEditing ? "Edit User" : "Add User"}
              </h2>
              <form
                onSubmit={submitUser}
                className="grid grid-cols-1 md:grid-cols-4 gap-3"
              >
                <input
                  className="border p-2 rounded"
                  placeholder="Name"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  required
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  required
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  required={!userEditing}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      userForm.is_admin === 1 || userForm.is_admin === true
                    }
                    onChange={(e) =>
                      setUserForm({ ...userForm, is_admin: e.target.checked })
                    }
                  />
                  <span>Admin?</span>
                </label>
                <div className="md:col-span-4 text-right">
                  <button
                    type="submit"
                    className="bg-[#0b2a45] text-white px-4 py-2 rounded mr-2"
                  >
                    {userEditing ? "Update" : "Create"}
                  </button>
                  {userEditing && (
                    <button
                      type="button"
                      onClick={cancelUserEdit}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white p-5 rounded shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-3">
                <h3 className="font-semibold mb-0">Users</h3>
                <div className="w-full md:w-1/3 relative">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="border p-2 pl-8 rounded w-full"
                  />
                  <svg
                    className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>
              </div>
              <table className="min-w-full text-left text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Admin</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{u.name}</td>
                        <td className="border px-4 py-2">{u.email}</td>
                        <td className="border px-4 py-2">
                          {u.is_admin ? "Yes" : "No"}
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={() => startEditUser(u)}
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500"
                      >
                        No matching users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* COURSES */}
        {activeTab === "courses" && (
          <>
            <div className="bg-white p-5 rounded shadow mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Database /> Edit Course
              </h2>
              <form
                onSubmit={submitCourse}
                className="grid grid-cols-1 md:grid-cols-4 gap-3"
              >
                <input
                  className="border p-2 rounded bg-gray-100 cursor-not-allowed"
                  placeholder="Course ID"
                  value={courseForm.id}
                  onChange={(e) =>
                    !courseEditing &&
                    setCourseForm({ ...courseForm, id: e.target.value })
                  }
                  required={!courseEditing}
                  disabled={courseEditing}
                />

                <input
                  className="border p-2 rounded"
                  placeholder="Title"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  required
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Price"
                  type="number"
                  value={courseForm.price}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, price: e.target.value })
                  }
                  required
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Old Price"
                  type="number"
                  value={courseForm.oldPrice}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, oldPrice: e.target.value })
                  }
                />
                <textarea
                  className="border p-2 rounded col-span-1 md:col-span-4"
                  placeholder="Description"
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                />
                <div className="md:col-span-4 text-right">
                  <button
                    type="submit"
                    className="bg-[#0b2a45] text-white px-4 py-2 rounded mr-2"
                  >
                    Update
                  </button>
                  {courseEditing && (
                    <button
                      type="button"
                      onClick={cancelCourseEdit}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white p-5 rounded shadow">
              <h3 className="font-semibold mb-3">Courses</h3>
              <table className="min-w-full text-left text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Title</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Old Price</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{c.id}</td>
                      <td className="border px-4 py-2">{c.title}</td>
                      <td className="border px-4 py-2">{c.oldPrice}</td>
                      <td className="border px-4 py-2">{c.price}</td>
                      <td className="border px-4 py-2">{c.description}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => startEditCourse(c)}
                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteCourse(c.id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* PURCHASES */}
        {activeTab === "purchases" && (
          <div className="bg-white p-5 rounded shadow">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <ShoppingCart /> Purchases
            </h2>
            <div className="flex justify-end mb-4">
            <button
              onClick={handleDownloadReport}
              className="bg-[#0b2a45] text-white px-4 py-2 rounded hover:bg-[#0a1f30]"
            >
            Download Report
            </button>
          </div>
            <table className="min-w-full text-left text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">User</th>
                  <th className="border px-4 py-2">Course</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{p.userId}</td>
                    <td className="border px-4 py-2">{p.courseId}</td>
                    <td className="border px-4 py-2">{p.price}</td>
                    <td className="border px-4 py-2">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => deletePurchase(p.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PROFILES (read-only) */}
        {activeTab === "profiles" && (
          <div className="bg-white p-5 rounded shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-3">
              <h2 className="text-lg font-semibold mb-0">User Profiles</h2>
              <div className="w-full md:w-1/3 relative">
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="border p-2 pl-8 rounded w-full"
                />
                <svg
                  className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>
            </div>

            <table className="min-w-full text-left text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">User ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Age</th>
                  <th className="border px-4 py-2">Skill</th>
                  <th className="border px-4 py-2">Interest</th>
                  <th className="border px-4 py-2">City</th>
                </tr>
              </thead>
              <tbody>
                {profiles.length > 0 ? (
                  profiles.map((p) => (
                    <tr key={p.userId} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{p.userId}</td>
                      <td className="border px-4 py-2">{p.name}</td>
                      <td className="border px-4 py-2">{p.email}</td>
                      <td className="border px-4 py-2">{p.age}</td>
                      <td className="border px-4 py-2">{p.skill}</td>
                      <td className="border px-4 py-2">{p.interest}</td>
                      <td className="border px-4 py-2">{p.city}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No matching profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* COACHES */}
        {activeTab === "coaches" && (
          <div className="bg-white p-5 rounded shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-3">
              <h2 className="text-lg font-semibold mb-0">Coach Application</h2>
              <div className="w-full md:w-1/3 relative">
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="border p-2 pl-8 rounded w-full"
                />
                <svg
                  className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>
            </div>
            <table className="min-w-full text-left text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Drive Link</th>
                  <th className="border px-4 py-2">Field</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coaches.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{c.Profile?.name}</td>
                    <td className="border px-4 py-2">{c.Profile?.email}</td>
                    <td className="border px-4 py-2">
                      <a
                        href={c.driveLink}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        CV/Portfolio
                      </a>
                    </td>
                    <td className="border px-4 py-2">{c.teachingField}</td>
                    <td className="border px-4 py-2">{c.status}</td>
                    <td className="border px-4 py-2 space-x-2">
                      {c.status === "pending" && (
                        <>
                          <button
                            onClick={async () => {
                              await api.put(`coaches/approve/${c.id}`, {});
                              fetchCoaches();
                            }}
                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              await api.put(`coaches/reject/${c.id}`, {});
                              fetchCoaches();
                            }}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}