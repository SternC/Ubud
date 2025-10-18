import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../src/hook/useAuth";

export default function TransactionHistory() {
  const { user, loading: userLoading } = useAuth(); 
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (!user) return;

    const url = user.is_coach
      ? `http://localhost:5000/transactions/coach/${user.id}`
      : `http://localhost:5000/transactions/${user.id}`;

    axios
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

  if (loading || userLoading) return <p className="p-8">Loading transactions...</p>;
  if (!user) return <p className="p-8 text-red-600">Please log in to view transactions.</p>;
  if (transactions.length === 0) return <p className="p-8">No transactions yet.</p>;

  if (user.is_coach) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Student Payments</h1>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Student</th>
                <th className="p-2 border">Course</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="bg-white border-b">
                  <td className="p-2 border">{tx.username}</td>
                  <td className="p-2 border">{tx.courseTitle}</td>
                  <td className="p-2 border">${Number(tx.price).toFixed(2)}</td>
                  <td className="p-2 border">{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-right font-semibold text-lg">
            Total Income: ${totalIncome.toFixed(2)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[85vh] bg-gray-50 p-6">
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
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
