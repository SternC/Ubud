import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Module() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#ffffe8] flex items-center justify-center">
      <aside className="w-64 h-screen bg-[#0b2a45] text-white flex flex-col p-4">
        <div className="text-2xl font-bold mb-6">
            <img src="/logo.png" alt="Ubud Logo" className="w-14 h-12 mb-2" />
        </div>
        <nav className="flex flex-col gap-4 flex-1">
          <button className="text-left hover:bg-[#133d5c] p-2 rounded-md">Dashboard</button>
          <button className="text-left hover:bg-[#133d5c] p-2 rounded-md">Courses</button>
          <button className="text-left hover:bg-[#133d5c] p-2 rounded-md">Forum</button>
          <button className="text-left hover:bg-[#133d5c] p-2 rounded-md">Assessment</button>
          <button className="text-left hover:bg-[#133d5c] p-2 rounded-md">Schedule</button>
          <button className="text-left hover:bg-[#133d5c] p-2 rounded-md">Coach</button>
          <button className="text-left hover:bg-[#133d5c] p-2 rounded-md">Transaction</button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <div className="bg-white shadow-lg rounded-xl p-6 h-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4" style={{ color: "#154D71", fontFamily: "Dream Road" }}>Dashboard</h1>
          <div className="border border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center text-gray-400">
            Konten dashboard di sini
          </div>
        </div>
      </main>
    </div>
  );
}

