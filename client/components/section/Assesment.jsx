import React, { useState, useEffect } from "react";
import api from "../../src/api";
import { Edit, Trash2 } from "lucide-react";

export default function Assessment({ isCoach }) {
  const [assessments, setAssessments] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    dueDate: "",
  });
  const [editing, setEditing] = useState(false);

  // Fetch all assessments
  const fetchAssessments = async () => {
    try {
      const res = await api.get("/assessments", { withCredentials: true });
      setAssessments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // Coach CRUD
  const startEdit = (a) => {
    setForm({
      id: a.id,
      title: a.title,
      description: a.description,
      dueDate: a.dueDate?.slice(0, 16) || "",
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm({ id: null, title: "", description: "", dueDate: "" });
    setEditing(false);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editing && form.id) {
        await api.put(`/assessments/${form.id}`, form, { withCredentials: true });
      } else {
        await api.post("/assessments", form, { withCredentials: true });
      }
      cancelEdit();
      fetchAssessments();
    } catch (err) {
      console.error(err);
      alert("Failed to save assessment");
    }
  };

  const deleteAssessment = async (id) => {
    if (!confirm("Delete this assessment?")) return;
    try {
      await api.delete(`/assessments/${id}`, { withCredentials: true });
      fetchAssessments();
    } catch (err) {
      console.error(err);
      alert("Failed to delete assessment");
    }
  };

  // Student submission
  const addSubmission = async (assessmentId) => {
    const submission = prompt("Enter your submission (link or text)");
    if (!submission) return;
    try {
      await api.post(`/submissions`, { assessmentId, submission }, { withCredentials: true });
      alert("Submission added!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit");
    }
  };

  return (
    <div className="p-6">
      {/* Button Create hanya untuk coach */}
      {isCoach && !editing && (
        <div className="mb-4 text-right">
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-900 transition"
          >
            Create Assessment
          </button>
        </div>
      )}

      {/* Form Create/Edit */}
      {isCoach && editing && (
        <div className="bg-white p-5 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">
            {form.id ? "Edit Assessment" : "Create Assessment"}
          </h2>
          <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="datetime-local"
              placeholder="Due Date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 rounded col-span-1 md:col-span-4"
              required
            />
            <div className="md:col-span-4 text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700 transition"
              >
                {form.id ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Assessments */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border border-gray-200">
            <thead className="bg-blue-900 text-white">
            <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {assessments.length ? (
                assessments.map((a) => (
                <tr key={a.id} className="hover:bg-blue-900">
                    <td className="border px-4 py-2">{a.title}</td>
                    <td className="border px-4 py-2">{new Date(a.dueDate).toLocaleString()}</td>
                    <td className="border px-4 py-2">{a.description}</td>
                    <td className="border px-4 py-2 space-x-2">
                    {isCoach ? (
                        <>
                        <button
                            onClick={() => startEdit(a)}
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => deleteAssessment(a.id)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            <Trash2 size={16} />
                        </button>
                        </>
                    ) : (
                        <button
                        onClick={() => addSubmission(a.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                        >
                        Submit
                        </button>
                    )}
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                    No assessments available
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    </div>
  );
}
