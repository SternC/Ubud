import React, { useEffect, useState, useMemo } from "react";
import api from "../../src/api";

export default function CoachTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [downloading, setDownloading] = useState(false);

  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get(
          "/courses/coach/transactions",
          { withCredentials: true }
        );
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

  
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.studentName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = filterDate
        ? t.date.startsWith(filterDate)
        : true;

      return matchesSearch && matchesDate;
    });
  }, [transactions, searchTerm, filterDate]);

 
  const downloadPDF = async () => {
    try {
      setDownloading(true);

      const res = await api.get(
        "/courses/coach/transactions/pdf",
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "coach-course-report.pdf";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download PDF report.");
    } finally {
      setDownloading(false);
    }
  };

  
  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Course Purchases
      </h2>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by course or student..."
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
          onClick={downloadPDF}
          disabled={downloading}
          className={`px-4 py-2 text-white rounded ${
            downloading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0b2a45] hover:bg-[#0a1f30]"
          }`}
        >
          {downloading ? "Generating..." : "Download PDF Report"}
        </button>
      </div>

      {/* TABLE */}
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
              {filteredTransactions.map((t, idx) => (
                <tr
                  key={t.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{t.studentName}</td>
                  <td className="px-4 py-2">{t.studentEmail}</td>
                  <td className="px-4 py-2">{t.courseTitle}</td>
                  <td className="px-4 py-2 text-right">
                    ${t.price}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {t.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
