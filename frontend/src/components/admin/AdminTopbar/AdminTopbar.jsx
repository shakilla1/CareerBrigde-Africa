import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { logoutUser } from "../../../services/authService";
import { getUser } from "../../../utils/authStorage";

import "./AdminTopbar.css";

function AdminTopbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const user = getUser();
  const initial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : "?";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="admin-topbar">

      <h1>Admin Dashboard</h1>

      <div className="admin-topbar__right">

        <button className="admin-topbar__notification">
          <FiBell />
        </button>

        <div className="admin-topbar__profile-menu" ref={menuRef}>
          <div
            className="admin-topbar__profile"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {initial}
          </div>

          {menuOpen && (
            <div className="admin-topbar__dropdown">
              <Link to="/admin/profile" onClick={() => setMenuOpen(false)}>
                My Profile
              </Link>
              <Link to="/admin/settings" onClick={() => setMenuOpen(false)}>
                Settings
              </Link>
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}

export default AdminTopbar;