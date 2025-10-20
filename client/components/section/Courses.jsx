import React, { useEffect, useState } from "react";
import Folder from "../ui/folder";
import api from "../../src/api";

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

  // Fetch logged-in profile
  useEffect(() => {
    api
      .get("/profile", { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setUser(res.data);
          setIsCoach(res.data.is_coach);
        }
      })
      .catch(() => setIsCoach(false));
  }, []);

  // Fetch courses once profile is loaded
  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const url = isCoach ? "/courses" : "/courses/purchased";
        const res = await api.get(url, { withCredentials: true });
        setCourses(res.data);
      } catch (err) {
        console.error("Fetch courses error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, isCoach]);

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

  const resetModal = () => {
    setShowModal(false);
    setNewCourse({ title: "", description: "", price: 0, oldPrice: 0 });
    setEditCourseId(null);
  };

  const handleSaveCourse = () => {
    if (editCourseId) {
      api
        .put(`/courses/${editCourseId}`, newCourse, { withCredentials: true })
        .then((res) => {
          setCourses((prev) =>
            prev.map((c) =>
              c.id === editCourseId ? { ...c, ...res.data.course } : c
            )
          );
          resetModal();
        })
        .catch((err) =>
          alert(
            "Failed to update course: " +
              (err.response?.data?.message || err.message)
          )
        );
    } else {
      api
        .post("/courses", newCourse, { withCredentials: true })
        .then((res) => {
          setCourses((prev) => [...prev, res.data.course]);
          resetModal();
        })
        .catch((err) =>
          alert(
            "Failed to create course: " +
              (err.response?.data?.message || err.message)
          )
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

  if (loading)
    return <p className="p-8 text-center text-gray-500">Loading courses...</p>;

  return (
    <div className="p-4 min-h-[85vh] bg-gray-50">
      {/* Create Course Button */}
      {isCoach && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Course
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200">
            <div className="flex justify-center mb-4">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-16 h-16 object-contain drop-shadow-md"
              />
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
                onClick={resetModal}
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

      {/* Courses Grid */}
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
            {isCoach && course.coachId === user.id && (
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
