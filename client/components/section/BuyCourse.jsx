import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../src/hook/useAuth";

export default function BuyCourse() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useAuth();

  useEffect(() => {
    axios
      .get("http://localhost:5000/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleBuy = async (courseId) => {
    if (!user) {
      setMessage("Please log in to purchase a course.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/purchase",
        { userId: user.id, courseId },
        { withCredentials: true }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Purchase failed");
    }
  };

  if (loading || userLoading) return <p className="p-8">Loading...</p>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
              <div className="mt-3">
                <span className="text-lg font-semibold">${course.price}</span>{" "}
                <span className="text-gray-400 line-through">${course.oldPrice}</span>
              </div>
              <button
                onClick={() => handleBuy(course.id)}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

        {message && <p className="mt-6 text-green-600 font-medium">{message}</p>}
      </div>
    </main>
  );
}
