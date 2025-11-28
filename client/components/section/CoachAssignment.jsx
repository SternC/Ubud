import React, { useEffect, useState } from "react";
import api from "../../src/api.jsx";

export default function CoachAssignment({ course, onClose }) {
  const [assignments, setAssignments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    pdfUrl: ""
  });

  const resetForm = () => {
    setForm({ title: "", description: "", pdfUrl: "" });
    setEditing(null);
  };

  // Load assignments
  const fetchAssignments = () => {
    api.get(`/courses/${course.id}/assignments`)
      .then(res => setAssignments(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    if (course?.id) fetchAssignments();
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await api.put(`courses/assignments/${editing}`, form);
      } else {
        await api.post(`/courses/${course.id}/assignments`, form);
      }

      resetForm();
      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert("Failed to save assignment");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this assignment?")) return;

    try {
      await api.delete(`/assignments/${id}`);
      fetchAssignments();
    } catch {
      alert("Error deleting assignment");
    }
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title,
      description: item.description,
      pdfUrl: item.pdfUrl || ""
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="text-xl font-semibold">
            Assignment CMS – {course.title}
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Close
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left: Form */}
          <div>
            <div className="text-lg font-semibold mb-2">
              {editing ? "Edit Assignment" : "Create New Assignment"}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Assignment Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border p-2 rounded"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="border p-2 rounded h-24"
              />

              <input
                type="text"
                placeholder="PDF URL (Google Drive, etc.)"
                value={form.pdfUrl}
                onChange={(e) =>
                  setForm({ ...form, pdfUrl: e.target.value })
                }
                className="border p-2 rounded"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editing ? "Save Changes" : "Add Assignment"}
                </button>

                {editing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right: Assignments List */}
          <div>
            <div className="text-lg font-semibold mb-2">Existing Assignments</div>

            {assignments.length === 0 ? (
              <div className="text-gray-600">No assignments yet.</div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
                {assignments.map((a) => (
                  <div key={a.id} className="border p-3 rounded bg-gray-50">
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-sm text-gray-600">{a.description}</div>

                    {/* PDF Link */}
                    {a.pdfUrl && (
                      <a
                        href={a.pdfUrl}
                        target="_blank"
                        className="text-blue-600 underline block text-sm mt-1"
                      >
                        View PDF
                      </a>
                    )}

                    <div className="flex gap-2 mt-3">
                      {/* Edit button */}
                      <button
                        onClick={() => handleEdit(a)}
                        className="px-3 py-1 bg-yellow-400 rounded text-sm"
                      >
                        Edit
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
