import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { Courses } from "../components/section/Courses";
import { Coachdeck } from "../components/section/Coachdeck";
import ProfileCard from "../components/section/Card";
import BuyCourse from "../components/section/BuyCourse";
import TransactionHistory from "../components/section/Transaction";
import Dashboard from "../components/section/dashboard";
import Assessment from "../components/section/Assesment";
import api from "./api";

export default function Module() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.get("/logout", { withCredentials: true });
    navigate("/login");
  };

  useEffect(() => {
    api
      .get("/profile", { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.isAdmin === 1) setIsAdmin(true);
        if (res.data && res.data.is_coach) setIsCoach(true);
      })
      .catch(() => {
        setIsAdmin(false);
        setIsCoach(false);
      });
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case "Courses":
        return <Courses />;
      case "Coach":
        return <Coachdeck />;
      case "Buy Course":
        return <BuyCourse />;
      case "Transaction":
        return <TransactionHistory />;
      case "Dashboard":
        return <Dashboard />;
      case "Assessment":
        return <Assessment isCoach={isCoach} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#ffffe8]">
      <div className="lg:hidden flex items-center justify-between bg-gradient-to-tr from-[#0b2a45] to-[#1f4c7b] text-white p-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Ubud Logo" className="w-10 h-8" />
          <span className="font-bold text-lg">Ubud</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-tr from-[#0b2a45] to-[#1f4c7b] text-white flex flex-col justify-between p-4 transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <div className="text-2xl font-bold mb-6 hidden lg:block">
            <img src="/logo.png" alt="Ubud Logo" className="w-14 h-12 mb-2" />
          </div>

          <ProfileCard />

          <nav className="flex flex-col gap-4 mt-4">
            {[
              "Dashboard",
              "Courses",
              "Assessment",
              "Schedule",
              "Coach",
              "Transaction",
              "Buy Course",
            ].map((page) => {
              if ((page === "Coach" || page === "Buy Course") && isCoach)
                return null;
              return (
                <button
                  key={page}
                  className={`text-left p-2 rounded-md hover:bg-[#133d5c] transition ${
                    activePage === page ? "bg-[#154d71]" : ""
                  }`}
                  onClick={() => {
                    setActivePage(page);
                    setSidebarOpen(false);
                  }}
                >
                  {page}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          {isAdmin && (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 bg-[#004179] hover:bg-[#0062b2] text-white py-2 px-3 rounded-md transition duration-300"
              title="Admin Dashboard"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-[#b91c1c] hover:bg-[#dc2626] text-white py-2 px-3 rounded-md transition duration-300"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0 mt-16 lg:mt-0">
        <div className="bg-white shadow-lg rounded-xl p-6 h-full">
          <h1 className="text-2xl font-bold mb-4 text-[#004179]">
            {activePage}
          </h1>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
