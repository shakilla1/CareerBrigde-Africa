import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiBell, FiSearch } from "react-icons/fi";
import { logoutUser } from "../../../services/authService";
import { getUser } from "../../../utils/authStorage";

import "./EmployerTopbar.css";

function EmployerTopbar() {
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
    <header className="employer-topbar">

      <h1>Employer Dashboard</h1>

      <div className="employer-topbar__right">

        <div className="employer-topbar__search">

          <FiSearch />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

        <button className="employer-topbar__notification">
          <FiBell />
        </button>

        <div className="employer-topbar__profile-menu" ref={menuRef}>
          <div
            className="employer-topbar__profile"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {initial}
          </div>

          {menuOpen && (
            <div className="employer-topbar__dropdown">
              <Link to="/employer/profile" onClick={() => setMenuOpen(false)}>
                My Profile
              </Link>
              <Link to="/employer/settings" onClick={() => setMenuOpen(false)}>
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

export default EmployerTopbar;