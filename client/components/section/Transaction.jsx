// file: Transaction.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../src/hook/useAuth";

export default function TransactionHistory() {
  const { user, loading: userLoading } = useAuth(); 
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleDownloadReceipt = (tx) => {

    axios
      .get(`http://localhost:5000/transactions/download-receipt/${tx.id}`, {
        withCredentials: true,
     
        responseType: 'blob', 
      })
      .then((response) => {
       
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

       
        const link = document.createElement('a');
        link.href = fileURL;
       
        link.setAttribute('download', `receipt-${tx.id}-${tx.courseTitle.replace(/\s/g, '_')}.pdf`);
        document.body.appendChild(link);
     
        link.click();
        link.remove();
        URL.revokeObjectURL(fileURL); 
      })
      .catch((err) => {
        console.error("Error downloading receipt:", err);
        alert("Gagal mengunduh bukti pembelian. Pastikan server berjalan dan API endpoint sudah benar.");
      });
  };


  useEffect(() => {
    if (!user) return; 

    axios
      .get(`http://localhost:5000/transactions/${user.id}`, {
        withCredentials: true,
      })
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error("Error fetching transactions:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading || userLoading) return <p className="p-8">Loading transactions...</p>;
  if (!user) return <p className="p-8 text-red-600">Please log in to view your transactions.</p>;
  if (transactions.length === 0) return <p className="p-8">No transactions yet.</p>;

  return (
   <main className="min-h-screen bg-gray-50 p-6">
  <div className="mx-auto max-w-4xl">
    <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
    <div className="space-y-4">
      {transactions.map((tx) => (
     
        <div key={tx.id} className="p-4 border rounded-md bg-white shadow-sm flex justify-between items-center">
          <div>
            <h2 className="font-semibold">{tx.courseTitle}</h2>
            <p className="text-gray-600">Price: ${Number(tx.price).toFixed(2)}</p>
            <p className="text-sm text-gray-500">Date: {new Date(tx.date).toLocaleDateString('id-ID')}</p>
          </div>
          
      
          <button 
            onClick={() => handleDownloadReceipt(tx)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150"
          >
            Download Receipt
          </button>
        </div>
      ))}
    </div>
  </div>
</main>

  );
}