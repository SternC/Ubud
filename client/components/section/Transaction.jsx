import React, { useEffect, useState } from "react";
import api from "../../src/api.jsx";
import useAuth from "../../src/hook/useAuth";

export default function TransactionHistory() {
  const { user, loading: userLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(""); 
  

  const handleDownloadReceipt = (tx) => {
    api
      .get(`/transactions/download-receipt/${tx.id}`, {
        withCredentials: true,
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute(
          "download",
          `receipt-${tx.id}-${tx.courseTitle.replace(/\s/g, "_")}.pdf`
        );
        document.body.appendChild(link);

        link.click();
        link.remove();
        URL.revokeObjectURL(fileURL);
      })
      .catch((err) => {
        console.error("Error downloading receipt:", err);
        alert(
          "Gagal mengunduh bukti pembelian. Pastikan server berjalan dan API endpoint sudah benar."
        );
      });
  };

  const handleDownloadAll = () => {
    if (transactions.length === 0)
      return alert("No receipts available to download.");

    api
      .get(`/transactions/download-all-receipts/${user.id}`, {
        withCredentials: true,
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", "all-receipts.pdf");
        document.body.appendChild(link);

        link.click();
        link.remove();
        URL.revokeObjectURL(fileURL);
      })
      .catch((err) => {
        console.error("Error downloading merged PDF:", err);
        alert("Failed to download combined receipts.");
      });
  };

  const filteredTransactions = transactions.filter((tx) => {
  const matchesSearch = tx.courseTitle
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesDate = filterDate ? tx.date === filterDate : true;
  

  return matchesSearch && matchesDate;
});


  useEffect(() => {
    if (!user) return;

    const url = user.is_coach
      ? `/transactions/coach/${user.id}`
      : `/transactions/${user.id}`;

    api
      .get(url, { withCredentials: true })
      .then((res) => {
        setTransactions(res.data);

        if (user.is_coach) {
          const total = res.data.reduce((sum, tx) => sum + Number(tx.price), 0);
          setTotalIncome(total);
        }
      })
      .catch((err) => console.error("Error fetching transactions:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading || userLoading)
    return <p className="p-8">Loading transactions...</p>;
  if (!user)
    return (
      <p className="p-8 text-red-600">Please log in to view transactions.</p>
    );
  if (transactions.length === 0)
    return <p className="p-8">No transactions yet.</p>;

  return (
    <main className="min-h-[85vh] bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
        <button
          onClick={handleDownloadAll}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Download All Receipts
        </button>
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

        <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
  <p className="p-4 text-gray-500">No transactions match your search/filter.</p>
) : (
  filteredTransactions.map((tx) => (
    <div
      key={tx.id}
      className="p-4 border rounded-md bg-white shadow-sm flex justify-between items-center"
    >
      <div>
        <h2 className="font-semibold">{tx.courseTitle}</h2>
        <p className="text-gray-600">Price: ${Number(tx.price).toFixed(2)}</p>
        <p className="text-sm text-gray-500">Date: {tx.date}</p>
      </div>

      <button
        onClick={() => handleDownloadReceipt(tx)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150"
      >
        Download Receipt
      </button>
    </div>
  ))
)}

        </div>
      </div>
    </main>
  );
}
