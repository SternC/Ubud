import React, { useEffect, useState } from "react";
import api from "../../src/api.jsx";
import Folder from "../ui/folder";

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: name === "price" || name === "oldPrice" ? parseFloat(value) || 0 : value }));
  };

  const handleSaveCourse = () => {
    api
      .post("/courses", newCourse, { withCredentials: true })
      .then((res) => {
        setCourses((prev) => [...prev, res.data.course]);
        setShowModal(false);
        setNewCourse({ title: "", description: "", price: 0, oldPrice: 0 });
      })
      .catch((err) => {
        alert("Failed to create course: " + (err.response?.data?.message || err.message));
      });
  };

  if (loading) return <p className="p-8 text-center text-gray-500">Loading courses...</p>;

  return (
    <div className="p-4 min-h-[85vh] bg-gray-50">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Course
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newCourse.title}
              onChange={handleInputChange}
              className="p-2 border rounded-md w-full mb-2"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newCourse.description}
              onChange={handleInputChange}
              className="p-2 border rounded-md w-full mb-2 resize-none"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newCourse.price}
              onChange={handleInputChange}
              className="p-2 border rounded-md w-full mb-2"
            />
            <input
              type="number"
              name="oldPrice"
              placeholder="Old Price"
              value={newCourse.oldPrice}
              onChange={handleInputChange}
              className="p-2 border rounded-md w-full mb-2"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCourse}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
          </div>
        ))}
      </div>
    </div>
  );
}
