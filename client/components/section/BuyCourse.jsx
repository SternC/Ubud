import React, { useEffect, useState } from "react";
import api from "../../src/api.jsx";
import useAuth from "../../src/hook/useAuth";

export default function BuyCourse() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useAuth();

  useEffect(() => {
    api
      .get("/courses", { withCredentials: true })
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
    console.log("🛒 Buying:", { userId: user.id, courseId });

    const res = await axios.post(
      "http://localhost:5000/api/purchase",
      { userId: user.id, courseId },
      { withCredentials: true }
    );

    setMessage(res.data.message);

    const purchased = JSON.parse(localStorage.getItem("purchasedCourses")) || [];
    if (!purchased.includes(courseId)) {
      purchased.push(courseId);
      localStorage.setItem("purchasedCourses", JSON.stringify(purchased));
      window.dispatchEvent(new Event("storage")); 

    }
  } catch (err) {
    setMessage(err.response?.data?.message || "Purchase failed");
  }
};


  if (loading || userLoading) return <p className="p-8">Loading...</p>;

return (
  <div className="bg-gray-50 p-6 rounded-lg min-h-[880px]">
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl sm:text-3xl text-[#004179] font-bold mb-6">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
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
  </div>
);
}
