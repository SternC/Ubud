import React, { useEffect, useState } from "react";
import api from "../../src/api.jsx";

export default function AppointmentPopup({ course, onClose, user }) {
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const isCoach = user?.is_coach;
  const coachId = course?.coachId;

  useEffect(() => {
    if (!coachId) return;
    api
      .get(`/availability/${coachId}`)
      .then((res) => setAvailability(res.data))
      .catch(console.error);
  }, [coachId]);

  const addAvailability = async () => {
    if (!date || !time) return alert("Isi date dan time!");

    try {
      const res = await api.post(
        `/availability`,
        { date, time },
        { withCredentials: true }
      );

      setAvailability((prev) => [...prev, res.data.data]);
      setDate("");
      setTime("");
    } catch (err) {
      console.error(err);
      alert("Failed to add availability");
    }
  };

  const bookAppointment = async (availId) => {
    try {
      await api.post(
        `/appointments`,
        { availabilityId: availId },
        { withCredentials: true }
      );

      alert("Appointment booked!");
      setAvailability((prev) => prev.filter((a) => a.id !== availId));
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4">
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <h2 className="text-xl font-semibold">
            Appointment – {course?.title}
          </h2>
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Close
          </button>
        </div>

        {/* Coach Add Availability */}
        {isCoach && (
          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">Add Availability</h3>
            <div className="flex gap-2 flex-wrap">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border p-2 rounded"
              />
              <button
                onClick={addAvailability}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* List Availability */}
        <div className="max-h-80 overflow-y-auto">
          <h3 className="font-semibold mb-2">Available Slots</h3>
          <div className="flex flex-col gap-2">
            {availability.length === 0 && (
              <p className="text-gray-500 text-sm">No availability yet.</p>
            )}

            {availability.map((slot) => (
              <div
                key={slot.id}
                className="border rounded p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{slot.date}</div>
                  <div className="text-sm text-gray-600">{slot.time}</div>
                </div>

                {!isCoach && (
                  <button
                    onClick={() => bookAppointment(slot.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Book
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
