import React, { useEffect, useState } from "react";
import api from "../../src/api.jsx";
import CoachAssignment from "./CoachAssignment.jsx";

export default function AssignmentPopup({ course, onClose, user }) {
  const [assignments, setAssignments] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [submitAnswerId, setSubmitAnswerId] = useState(null);
  const [answerUrl, setAnswerUrl] = useState("");
  const [openCMS, setOpenCMS] = useState(false);
  const [doneAssignments, setDoneAssignments] = useState([]);

  const isCoach = user?.is_coach;

  useEffect(() => {
    if (!course?.id) return;

    api
      .get(`/courses/${course.id}/assignments`)
      .then((res) => setAssignments(res.data))
      .catch(console.error);

  }, [course?.id]);

  useEffect(() => {
  if (!course?.id) return;

  api
    .get(`/progress/assignment/${course.id}`, { withCredentials: true })
    .then((res) => {
      const completedIds = res.data.map(p => p.assignmentId);
      setDoneAssignments(completedIds);
    })
    .catch(console.error);

}, [course?.id]);


  const markAsDone = async (assignmentId) => {
    try {
      await api.post("/progress/assignment", {
        assignmentId,
        courseId: course.id,
      });

      setDoneAssignments([...doneAssignments, assignmentId]);
    } catch (err) {
      console.error(err);
      alert("Failed to mark as done");
    }
  };

  const submitAnswer = async () => {
    if (!answerUrl.trim()) return alert("Answer URL cannot be empty.");

    await api.post(`/courses/assignments/${submitAnswerId}/answer`, {
      answerUrl,
    });

    alert("Answer submitted!");
    setAnswerUrl("");
    setSubmitAnswerId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="text-lg font-semibold">
            Assignments – {course?.title}
          </div>

          <div className="flex items-center gap-2">
            {isCoach && (
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => setOpenCMS(true)}
              >
                + Add Assignment
              </button>
            )}

            <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[80vh]">
          {assignments.length === 0 ? (
            <div className="text-gray-500">No assignments yet</div>
          ) : (
            <div className="flex flex-col gap-3">
              {assignments.map((a) => (
                <div key={a.id} className="p-3 border rounded bg-gray-50">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-gray-600">{a.description}</div>

                  <div className="mt-2 flex gap-2">
                    {/* View PDF */}
                    {a.pdfUrl && (
                      <button
                        onClick={() => setSelectedPdf(a.pdfUrl)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                      >
                        View PDF
                      </button>
                    )}

                    {/* Student submit */}
                    {!isCoach && (
                      <button
                        onClick={() => setSubmitAnswerId(a.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        Submit Answer
                      </button>
                    )}

                    {/* Mark as Done */}
                    {!isCoach &&
                      (doneAssignments.includes(a.id) ? (
                        <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm">
                          Completed ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => markAsDone(a.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                        >
                          Mark as Done
                        </button>
                      ))}
                  </div>
                  {/* Student answer */}
                  {a.studentAnswerUrl && (
                    <div className="mt-2 text-sm">
                      Student Answer:{" "}
                      <a
                        href={a.studentAnswerUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Open
                      </a>
                    </div>
                  )}

                  {/* Coach review */}
                  {a.coachReviewUrl && (
                    <div className="text-sm">
                      Coach Review:{" "}
                      <a
                        href={a.coachReviewUrl}
                        target="_blank"
                        className="text-purple-600 underline"
                      >
                        Open
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded shadow-lg flex flex-col">
            <div className="flex justify-between p-3 border-b">
              <div className="font-semibold">PDF Viewer</div>
              <button
                onClick={() => setSelectedPdf(null)}
                className="px-2 py-1 bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
            <iframe src={selectedPdf} className="w-full h-full" />
          </div>
        </div>
      )}

      {/* Submit Answer Modal */}
      {submitAnswerId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-4 shadow-lg">
            <div className="text-lg font-semibold mb-3">Submit Your Answer</div>

            <input
              type="text"
              placeholder="Paste Google Drive / File URL"
              value={answerUrl}
              onChange={(e) => setAnswerUrl(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSubmitAnswerId(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={submitAnswer}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ Assignment CMS Modal (COACH ONLY) */}
      {openCMS && (
        <CoachAssignment course={course} onClose={() => setOpenCMS(false)} />
      )}
    </div>
  );
}
