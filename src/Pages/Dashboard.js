import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <h3>Welcome Back!</h3>
          <p>Here’s your dashboard overview.</p>
        </header>

        <section className="content-area">
          <div className="card">
            <h4>Catalogs</h4>
            <p>0</p>
          </div>
          <div className="card">
            <h4>Appointments</h4>
            <p>0</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
