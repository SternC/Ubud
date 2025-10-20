import React, { useEffect, useState } from "react";
import api from "../../src/api";

export default function CoachTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/courses/coach/transactions", {
          withCredentials: true,
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching coach transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Course Purchases</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No one has purchased your courses yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{t.studentName}</td>
                  <td className="px-4 py-2">{t.studentEmail}</td>
                  <td className="px-4 py-2">{t.courseTitle}</td>
                  <td className="px-4 py-2 text-right">${t.price}</td>
                  <td className="px-4 py-2 text-right">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
