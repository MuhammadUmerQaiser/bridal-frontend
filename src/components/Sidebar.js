import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2>Naqshzari</h2>
      <ul>
        <li>
          <Link to="/admin">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/appointments">Appointments</Link>
        </li>
        <li>
          <Link to="/admin/categories">Categories</Link>
        </li>
        <li>
          <Link to="/admin/catalogs">Catalog</Link>
        </li>
        <li>
          <Link to="/admin/blogs">Blogs</Link>
        </li>
        <li>
          <button className="btn btn-link" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
