import React, { useEffect, useState, useRef } from "react";
import api from "../../src/api.jsx";

export default function SubcoursePopup({ course, onClose, user }) {
  const [subcourses, setSubcourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeSub, setActiveSub] = useState(null);

  const [newSubTitle, setNewSubTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploadQueue, setUploadQueue] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [editing, setEditing] = useState({});
  const [comments, setComments] = useState({});
  const fileInputRef = useRef();
  const dragIndexRef = useRef(null);

  const isCoach = user?.is_coach;

  useEffect(() => {
    if (!course?.id) return;
    api
      .get(`/courses/${course.id}/subcourses`)
      .then((res) => setSubcourses(res.data))
      .catch(console.error);
  }, [course?.id]);

  const markAsDone = async () => {
    if (!activeSub || !course?.id) return;

    try {
      await api.post("/progress/subcourse", {
        subcourseId: activeSub,
        courseId: course.id,
      });

      alert("Marked as done!");
    } catch (err) {
      console.error(err);
      alert("Failed to mark as done");
    }
  };

  const loadMaterials = (subId) => {
    setActiveSub(subId);
    api
      .get(`/subcourses/${subId}/materials`)
      .then((res) => setMaterials(res.data))
      .catch(console.error);
    setComments({});
  };

  const addSubcourse = async () => {
    if (!newSubTitle.trim()) return alert("Title required");
    try {
      const res = await api.post(`/courses/${course.id}/subcourses`, {
        title: newSubTitle,
      });
      setSubcourses((prev) => [...prev, res.data]);
      setNewSubTitle("");
    } catch (err) {
      console.error(err);
      alert("Failed to create subcourse");
    }
  };

  const uploadFile = async (file) => {
    if (!file || !activeSub) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "notes");

    const qItem = {
      id: Math.random().toString(36).slice(2),
      file,
      progress: 0,
      status: "uploading",
    };
    setUploadQueue((prev) => [...prev, qItem]);

    try {
      const res = await api.post(
        `/subcourses/${activeSub}/materials`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadQueue((prev) =>
              prev.map((p) =>
                p.id === qItem.id ? { ...p, progress: percent } : p
              )
            );
          },
        }
      );
      setMaterials((prev) => [...prev, res.data]);
      setUploadQueue((prev) =>
        prev.map((p) =>
          p.id === qItem.id ? { ...p, status: "done", progress: 100 } : p
        )
      );
    } catch (err) {
      console.error(err);
      setUploadQueue((prev) =>
        prev.map((p) => (p.id === qItem.id ? { ...p, status: "error" } : p))
      );
      alert("Upload failed");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach((f) => uploadFile(f));
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);

  const handleChooseFile = () => fileInputRef.current?.click();
  const handleFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) uploadFile(f);
    e.target.value = "";
  };

  const addYouTube = async () => {
    if (!youtubeUrl.trim() || !activeSub) return alert("Enter URL");
    try {
      const res = await api.post(`/subcourses/${activeSub}/youtube`, {
        url: youtubeUrl,
        title: "YouTube Video",
      });
      setMaterials((prev) => [...prev, res.data]);
      setYoutubeUrl("");
    } catch (err) {
      console.error(err);
      alert("YT add failed");
    }
  };

  const deleteMaterial = async (id) => {
    if (!confirm("Delete material?")) return;
    try {
      await api.delete(`/materials/${id}`);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const saveRename = async (id, newName) => {
    try {
      const res = await api.put(`/materials/${id}`, { name: newName });
      setMaterials((prev) => prev.map((m) => (m.id === id ? res.data : m)));
      setEditing((prev) => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error(err);
      alert("Rename failed");
    }
  };

  const onDragStart = (e, idx) => {
    dragIndexRef.current = idx;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDropItem = (e, idx) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === idx) return;
    const arr = [...materials];
    const [moved] = arr.splice(from, 1);
    arr.splice(idx, 0, moved);
    setMaterials(arr);
    api
      .put(`/subcourses/${activeSub}/materials/reorder`, {
        order: arr.map((a) => a.id),
      })
      .catch(console.error);
    dragIndexRef.current = null;
  };

  const fetchComments = (mid) => {
    api
      .get(`/materials/${mid}/comments`)
      .then((res) => setComments((prev) => ({ ...prev, [mid]: res.data })))
      .catch(console.error);
  };
  const postComment = async (mid, content) => {
    if (!content) return;
    try {
      const res = await api.post(`/materials/${mid}/comments`, { content });
      setComments((prev) => ({
        ...prev,
        [mid]: [...(prev[mid] || []), res.data],
      }));
    } catch (err) {
      console.error(err);
      alert("Comment failed");
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = null;

    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        videoId = u.searchParams.get("v");
      } else if (u.hostname.includes("youtu.be")) {
        videoId = u.pathname.slice(1);
      }
    } catch (e) {
      console.error("Invalid YouTube URL", url);
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };
  const renderPreview = (m) => {
    const lower = (m.originalName || "").toLowerCase();

    // YouTube embed
    if (m.type === "youtube") {
      let embedUrl = "";
      if (m.youtubeUrl) {
        if (m.youtubeUrl.includes("watch?v=")) {
          embedUrl = m.youtubeUrl.replace("watch?v=", "embed/");
        } else if (m.youtubeUrl.includes("youtu.be/")) {
          const id = m.youtubeUrl.split("/").pop();
          embedUrl = `https://www.youtube.com/embed/${id}`;
        } else {
          embedUrl = m.youtubeUrl; // fallback
        }
      }
      return (
        <iframe
          className="w-full h-48 rounded"
          src={embedUrl}
          allowFullScreen
          title={m.originalName || "YouTube Video"}
        />
      );
    }

    // Images
    if (lower.match(/\.(png|jpe?g|gif)$/)) {
      return (
        <img
          src={`http://localhost:5000${m.fileUrl}`}
          alt={m.originalName}
          className="max-h-48 rounded"
        />
      );
    }

    // Videos
    if (lower.match(/\.(mp4|webm|ogg)$/)) {
      return (
        <video controls className="w-full max-h-48 rounded">
          <source src={`http://localhost:5000${m.fileUrl}`} />
        </video>
      );
    }

    // PDFs
    if (lower.endsWith(".pdf")) {
      return (
        <iframe
          src={`http://localhost:5000${m.fileUrl}`}
          width="100%"
          height="480px"
          title={m.originalName}
        />
      );
    }

    // Other docs
    if (lower.match(/\.(docx|pptx)$/)) {
      return (
        <a
          href={`http://localhost:5000${m.fileUrl}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          {m.originalName || "Download file"}
        </a>
      );
    }

    // Default fallback
    return (
      <a
        href={`http://localhost:5000${m.fileUrl}`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        {m.originalName || "Download file"}
      </a>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4 overflow-auto">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b gap-2 sm:gap-0">
          <div className="text-lg font-semibold">
            Subcourses - {course?.title}
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 rounded w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col sm:flex-row overflow-hidden">
          {/* Left Panel */}
          <div className="w-full sm:w-1/3 border-r p-4 overflow-y-auto max-h-[90vh]">
            {isCoach && (
              <div className="mb-3 flex gap-2 flex-wrap">
                <input
                  className="border px-2 py-1 rounded flex-1 min-w-[120px]"
                  value={newSubTitle}
                  onChange={(e) => setNewSubTitle(e.target.value)}
                  placeholder="New subcourse title"
                />
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded flex-shrink-0"
                  onClick={addSubcourse}
                >
                  Add
                </button>
              </div>
            )}
            <div className="flex flex-col gap-2">
              {subcourses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadMaterials(s.id)}
                  className={`text-left p-2 rounded ${
                    activeSub === s.id ? "bg-blue-50" : "bg-gray-100"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full sm:w-2/3 p-4 overflow-y-auto max-h-[90vh]">
            {!activeSub ? (
              <div className="text-gray-500">Select a subcourse</div>
            ) : (
              <>
                {!isCoach && activeSub && (
                  <button
                    onClick={markAsDone}
                    className="mb-3 px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Mark as Done ✔
                  </button>
                )}

                {isCoach && (
                  <div className="mb-3">
                    {/* Drag & Drop */}
                    <div
                      className={`border-dashed border-2 p-3 rounded ${
                        dragOver ? "bg-blue-50 border-blue-400" : "bg-white"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div className="text-sm">
                          Drag & drop files here (or)
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                            Choose File
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              onChange={handleFileInput}
                            />
                          </label>
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded"
                            onClick={addYouTube}
                          >
                            Add YouTube
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row gap-2">
                        <input
                          className="flex-1 border px-2 py-1 rounded min-w-[150px]"
                          placeholder="YouTube URL"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                        />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Accepted: pdf, pptx, docx, mp4, png, jpg
                      </div>
                    </div>

                    {/* Upload Queue */}
                    <div className="mt-2 flex flex-col gap-2">
                      {uploadQueue.map((q) => (
                        <div
                          key={q.id}
                          className="flex flex-col sm:flex-row items-center gap-2"
                        >
                          <div className="flex-1 text-sm break-words">
                            {q.file.name}
                          </div>
                          <div className="w-full sm:w-40 bg-gray-200 rounded h-2 overflow-hidden">
                            <div
                              style={{ width: `${q.progress}%` }}
                              className="bg-blue-600 h-full"
                            ></div>
                          </div>
                          <div className="text-xs">{q.progress}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                <div className="flex flex-col gap-3">
                  {materials.map((m, idx) => (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDropItem(e, idx)}
                      className="p-3 border rounded bg-gray-50 flex flex-col gap-2"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-semibold">
                              {m.originalName || m.youtubeUrl || "File/Video"}
                            </div>
                            <div className="text-xs text-gray-500">
                              ({m.type})
                            </div>
                          </div>
                          <div className="mt-2">{renderPreview(m)}</div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2 mt-2 sm:mt-0">
                          {isCoach && (
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() =>
                                  setEditing((prev) => ({
                                    ...prev,
                                    [m.id]: true,
                                  }))
                                }
                                className="px-2 py-1 bg-yellow-300 rounded text-sm"
                              >
                                Rename
                              </button>
                              <button
                                onClick={() => deleteMaterial(m.id)}
                                className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                          <div className="text-xs text-gray-400">
                            pos: {m.position}
                          </div>
                        </div>
                      </div>

                      {editing[m.id] && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                          <input
                            defaultValue={m.originalName}
                            className="border px-2 py-1 rounded flex-1 min-w-[120px]"
                            id={`rename-${m.id}`}
                          />
                          <button
                            onClick={() =>
                              saveRename(
                                m.id,
                                document.getElementById(`rename-${m.id}`).value
                              )
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() =>
                              setEditing((prev) => ({ ...prev, [m.id]: false }))
                            }
                            className="px-3 py-1 bg-gray-200 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {/* Comments */}
                      <div>
                        <div className="font-semibold text-sm mb-1">
                          Comments
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="max-h-36 overflow-y-auto border rounded p-2 bg-white">
                            {(comments[m.id] || []).map((c) => (
                              <div
                                key={c.id}
                                className="text-xs border-b last:border-0 pb-1"
                              >
                                <div className="text-gray-700 break-words">
                                  {c.content}
                                </div>
                                <div className="text-gray-400 text-[10px]">
                                  {new Date(c.createdAt).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            <input
                              placeholder="Add comment..."
                              className="flex-1 border px-2 py-1 rounded min-w-[120px]"
                              id={`comment-${m.id}`}
                            />
                            <button
                              onClick={() => {
                                postComment(
                                  m.id,
                                  document.getElementById(`comment-${m.id}`)
                                    .value
                                );
                                document.getElementById(
                                  `comment-${m.id}`
                                ).value = "";
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                              Post
                            </button>
                            <button
                              onClick={() => fetchComments(m.id)}
                              className="px-3 py-1 bg-gray-200 rounded"
                            >
                              Refresh
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
