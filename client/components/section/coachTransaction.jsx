import React, { useEffect, useState, useMemo } from "react";
import api from "../../src/api";

export default function CoachTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/courses/coach/transactions", {
          withCredentials: true,
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching coach transactions:", err);
        alert("You must be logged in to view this page.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Filter transactions based on search and date
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.courseTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesDate = filterDate
        ? transaction.date.startsWith(filterDate)
        : true;
      return matchesSearch && matchesDate;
    });
  }, [transactions, searchTerm, filterDate]);

  if (loading)
    return <div className="p-6 text-gray-500">Loading transactions...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Course Purchases</h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1 rounded flex-1"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterDate("");
          }}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <p className="text-gray-500">
          No transactions match your search/filter.
        </p>
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
              {filteredTransactions.map((transaction, idx) => (
                <tr key={transaction.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{transaction.studentName}</td>
                  <td className="px-4 py-2">{transaction.studentEmail}</td>
                  <td className="px-4 py-2">{transaction.courseTitle}</td>
                  <td className="px-4 py-2 text-right">${transaction.price}</td>
                  <td className="px-4 py-2 text-right">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
