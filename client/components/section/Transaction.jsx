import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../src/hook/useAuth";

export default function TransactionHistory() {
  const { user, loading: userLoading } = useAuth(); 
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; 

    axios
      .get(`http://localhost:5000/api/transactions/${user.id}`, {
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
        <div key={tx.id} className="p-4 border rounded-md bg-white shadow-sm">
          <h2 className="font-semibold">{tx.courseTitle}</h2>
         <p className="text-gray-600">Price: ${Number(tx.price).toFixed(2)}</p>
          <p className="text-sm text-gray-500">Date: {tx.date}</p>
        </div>
      ))}
    </div>
  </div>
</main>

  );
}
