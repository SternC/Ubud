import React, { useEffect, useState } from "react";
import Folder from "../ui/folder";
import api from "../../src/api";
import axios from "axios";

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isCoach, setIsCoach] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
    oldPrice: 0,
  });

  useEffect(() => {
    api
      .get("/courses", { withCredentials: true })
      .then((res) => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api
      .get("/profile", { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.isAdmin === 1) setIsAdmin(true);
        if (res.data && res.data.is_coach) setIsCoach(true);
      })
      .catch(() => {
        setIsCoach(false);
      });
  }, []);

  useEffect(() => {
  const updateCourses = () => {
    axios.get("http://localhost:5000/courses", { withCredentials: true })
      .then((res) => {
        const purchased = JSON.parse(localStorage.getItem("purchasedCourses")) || [];
        const filtered = res.data.filter((c) => purchased.includes(c.id));
        setCourses(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  updateCourses();
  window.addEventListener("storage", updateCourses);
  return () => window.removeEventListener("storage", updateCourses);
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "oldPrice"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSaveCourse = () => {
    if (editCourseId) {
      axios
        .put(`http://localhost:5000/courses/${editCourseId}`, newCourse, {
          withCredentials: true,
        })
        .then((res) => {
          setCourses((prev) =>
            prev.map((c) =>
              c.id === editCourseId ? { ...c, ...res.data.course } : c
            )
          );
          setShowModal(false);
          setNewCourse({ title: "", description: "", price: 0, oldPrice: 0 });
          setEditCourseId(null);
        })
        .catch((err) =>
          alert("Failed to update course: " + (err.response?.data?.message || err.message))
        );
    } else {
      axios
        .post("http://localhost:5000/courses", newCourse, {
          withCredentials: true,
        })
        .then((res) => {
          setCourses((prev) => [...prev, res.data.course]);
          setShowModal(false);
          setNewCourse({ title: "", description: "", price: 0, oldPrice: 0 });
        })
        .catch((err) =>
          alert("Failed to create course: " + (err.response?.data?.message || err.message))
        );
    }
  };

  const handleEdit = (course) => {
    setNewCourse({
      title: course.title,
      description: course.description,
      price: course.price,
      oldPrice: course.oldPrice,
    });
    setEditCourseId(course.id);
    setShowModal(true);
  };

  if (loading) return <p className="p-8 text-center text-gray-500">Loading courses...</p>;

  return (
    <div className="p-4 min-h-[85vh] bg-gray-50">
      <div className="flex justify-end mb-4">
        {isCoach && (
          <button
            onClick={() => setShowModal(true)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Course
          </button>
        )}
      </div>

    {showModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-[fadeIn_0.3s_ease-out]">
        <div className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain drop-shadow-md" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            {editCourseId ? "Update Course" : "Create New Course"}
          </h2>
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={newCourse.title}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <textarea
            name="description"
            placeholder="Course Description"
            value={newCourse.description}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg w-full mb-3 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newCourse.price}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="number"
              name="oldPrice"
              placeholder="Old Price"
              value={newCourse.oldPrice}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCourse}
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col items-center p-3 rounded-lg cursor-pointer transition-shadow"
          >
            <Folder size={1} color="#4a9fe8" items={[]} />
            <h3 className="mt-2 font-semibold text-center text-xs sm:text-sm md:text-base">
              {course.title}
            </h3>
            <p className="text-[0.7rem] sm:text-xs text-gray-500 text-center line-clamp-2">
              {course.description}
            </p>
            {isCoach && (
              <button
                onClick={() => handleEdit(course)}
                className="mt-2 px-3 py-1 bg-blue-900 font-semibold text-white text-xs rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
