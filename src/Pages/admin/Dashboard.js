import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } 
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <header className="content-header">
          <h3>Welcome Back!</h3>
          <p>Here’s your dashboard overview.</p>
        </header>
      </main>
    </div>
  );
};

export default Dashboard;
