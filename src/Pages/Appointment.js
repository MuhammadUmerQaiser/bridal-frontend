import React from "react";
import Sidebar from "../components/Sidebar";

const Appointment = () => {
  const appointments = [
    { id: 1, name: "John Doe", date: "2024-09-22", time: "10:00 AM", status: "Confirmed" },
    { id: 2, name: "Jane Smith", date: "2024-09-23", time: "11:30 AM", status: "Pending" },
    { id: 3, name: "Alice Johnson", date: "2024-09-24", time: "1:00 PM", status: "Cancelled" },
    // Add more sample data as needed
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <h3>Appointments</h3>
          <p>Manage your appointments here.</p>
        </header>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.name}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Appointment;
