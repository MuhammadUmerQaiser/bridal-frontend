import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Bridal Dashboard</h2>
      <ul>
        <li>
          <Link to="/admin">Dashboard</Link>
        </li>
        <li>
          <Link to="/appointments">Appointments</Link>
        </li>{" "}
        {/* Appointment link */}
        <li>
          <Link to="/admin">Logout</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
