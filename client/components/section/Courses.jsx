import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../src/hook/useAuth";
import Folder from "../ui/folder";

export function Courses() {
  const { user, loading: userLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/purchases/${user.id}`, {
        withCredentials: true,
      })
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.error("Error fetching purchased courses:", err);
        setError("Failed to load your courses.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading || userLoading)
    return <p className="p-8 text-center text-gray-500">Loading your courses...</p>;

  if (!user)
    return (
      <p className="p-8 text-center text-red-600">
        Please log in to view your courses.
      </p>
    );

  if (error)
    return (
      <p className="p-8 text-center text-red-600">
        {error || "Something went wrong."}
      </p>
    );

  if (courses.length === 0)
    return (
      <p className="p-8 text-center text-gray-500">
        You haven’t purchased any courses yet.
      </p>
    );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <Folder size={1.2} color="#4a9fe8" items={[]} />
            <div className="mt-6">
              <h3 className="text-sm md:text-base font-semibold text-foreground leading-tight">
                {course.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
