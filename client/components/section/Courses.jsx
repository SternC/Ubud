import React, { useEffect, useState } from "react";
import Folder from "../ui/folder";
import api from "../../src/api.jsx";
import SubcoursePopup from "./SubcoursePopup.jsx";
import AppointmentPopup from "./AppointmentPopup.jsx";
import AssignmentPopup from "./AssignmentPopup.jsx";

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isCoach, setIsCoach] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [coaches, setCoaches] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
    oldPrice: 0,
  });

  const [showFolderPopup, setShowFolderPopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [showSubcourseModal, setShowSubcourseModal] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const openFolderPopup = (course) => {
    setSelectedCourse(course);
    setShowFolderPopup(true);
  };

  const handlePaperClick = (paperItem, index) => {
    if (index === 0) {
      setActiveCourse(selectedCourse);
      setShowSubcourseModal(true);
    }

    if (index === 1) {
      setActiveCourse(selectedCourse);
      setShowAssignmentModal(true);
    }

    if (index === 2) {
      setActiveCourse(selectedCourse);
      setShowAppointmentModal(true);
    }
  };

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

  useEffect(() => {
    api
      .get("/coaches", { withCredentials: true })
      .then((res) => {
        if (res.data) setCoaches(res.data);
      })
      .catch(() => setCoaches([]));
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const url = isCoach ? "/courses" : "/courses/purchased";
        const res = await api.get(url, { withCredentials: true });
        setCourses(res.data);
      } catch (error) {
        console.error("error fetch", error);
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
        });
    } else {
      api.post("/courses", newCourse, { withCredentials: true }).then((res) => {
        setCourses((prev) => [...prev, res.data.course]);
        resetModal();
      });
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
      {isCoach && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-md"
          >
            Create Course
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-4">
              {editCourseId ? "Update Course" : "Create New Course"}
            </h2>
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={newCourse.title}
              onChange={handleInputChange}
              className="p-3 border rounded-lg w-full mb-3"
            />
            <textarea
              name="description"
              placeholder="Course Description"
              value={newCourse.description}
              onChange={handleInputChange}
              className="p-3 border rounded-lg w-full mb-3"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newCourse.price}
                onChange={handleInputChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="number"
                name="oldPrice"
                placeholder="Old Price"
                value={newCourse.oldPrice}
                onChange={handleInputChange}
                className="p-3 border rounded-lg w-full"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={resetModal}
                className="px-5 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCourse}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {courses.map((course) => (
          <div key={course.id} className="flex flex-col items-center p-3">
            <div onClick={() => openFolderPopup(course)}>
              <Folder
                size={1}
                color="#4a9fe8"
                items={[
                  { chapter: "Subcourses" },
                  { chapter: "Assignment" },
                  { chapter: "Appointment" },
                ]}
                onPaperSelect={handlePaperClick}
              />
            </div>
            <h3 className="mt-2 font-semibold text-center text-sm">
              {course.title}
            </h3>
            <p className="text-xs text-gray-500 text-center">
              {course.description}
            </p>

            {isCoach && coaches.some((c) => c.id === course.coachId) && (
              <button
                onClick={() => handleEdit(course)}
                className="mt-2 px-3 py-1 bg-blue-900 text-white text-xs rounded-md"
              >
                Update
              </button>
            )}
          </div>
        ))}
      </div>

      {showSubcourseModal && activeCourse && (
        <SubcoursePopup
          course={activeCourse}
          onClose={() => {
            setShowSubcourseModal(false);
            setActiveCourse(null);
          }}
          user={user}
        />
      )}

      {showAssignmentModal && activeCourse && (
        <AssignmentPopup
          course={activeCourse}
          onClose={() => {
            setShowAssignmentModal(false);
            setActiveCourse(null);
          }}
          user={user}
        />
      )}

      {showAppointmentModal && activeCourse && (
        <AppointmentPopup
          course={activeCourse}
          onClose={() => {
            setShowAppointmentModal(false);
            setActiveCourse(null);
          }}
          user={user}
        />
      )}
    </div>
  );
}

export default Courses;
