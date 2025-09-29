import React, { useState } from "react";
import { Courses } from "../components/section/Courses";
import { Menu, X } from "lucide-react";
import { Coachdeck } from "../components/section/Coachdeck";
import ProfileCard from "../components/section/Card";

export default function Module() {
const [activePage, setActivePage] = useState("Dashboard");
const [sidebarOpen, setSidebarOpen] = useState(false);

const renderContent = () => {
switch (activePage) {
case "Dashboard":
return ( <div className="border border-dashed border-gray-300 rounded-lg h-160 flex items-center justify-center text-gray-400">
Konten dashboard di sini </div>
);
case "Courses":
return <Courses />;
case "Coach":
return <Coachdeck />;
default:
return null;
}
};

return ( <div className="min-h-screen flex flex-col lg:flex-row bg-[#ffffe8]">

<div className="lg:hidden flex items-center justify-between bg-[#0b2a45] text-white p-4"> <div className="flex items-center space-x-2"> <img src="/logo.png" alt="Ubud Logo" className="w-10 h-8" /> <span className="font-bold text-lg">Ubud</span> </div>
<button onClick={() => setSidebarOpen(!sidebarOpen)}>
{sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />} </button> </div>



  <aside
    className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#0b2a45] text-white flex flex-col p-4 transform transition-transform duration-300 z-40 ${
      sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    }`}
  >
    <div className="text-2xl font-bold mb-6 hidden lg:block">
      <img src="/logo.png" alt="Ubud Logo" className="w-14 h-12 mb-2" />
    </div>
    <nav className="flex flex-col gap-4 flex-1">
      <ProfileCard />
      {[
        "Dashboard",
        "Courses",
        "Forum",
        "Assessment",
        "Schedule",
        "Coach",
        "Transaction",
      ].map((page) => (
        <button
          key={page}
          className={`text-left p-2 rounded-md hover:bg-[#133d5c] ${
            activePage === page ? "bg-[#154d71]" : ""
          }`}
          onClick={() => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
        >
          {page}
        </button>
      ))}
    </nav>
  </aside>


  <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0 mt-16 lg:mt-0">
    <div className="bg-white shadow-lg rounded-xl p-6 h-full">
      <h1 className="text-2xl font-bold mb-4 text-[#004179]">{activePage}</h1>
      {renderContent()}
    </div>
  </main>
</div>


);
}