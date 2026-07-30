import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiBell, FiSearch } from "react-icons/fi";
import { logoutUser } from "../../../services/authService";
import { getUser } from "../../../utils/authStorage";
import "./Topbar.css";

function Topbar() {
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
    <header className="topbar">

      <div className="topbar__left">
        <h1>Student Dashboard</h1>
      </div>

      <div className="topbar__right">

        <div className="topbar__search">
          <FiSearch className="topbar__search-icon" />

          <input
            type="text"
            placeholder="Search opportunities..."
          />
        </div>

        <button className="topbar__notification">
          <FiBell />
        </button>

        <div className="topbar__profile-menu" ref={menuRef}>
          <div
            className="topbar__profile"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>{initial}</span>
          </div>

          {menuOpen && (
            <div className="topbar__dropdown">
              <Link to="/student/profile" onClick={() => setMenuOpen(false)}>
                My Profile
              </Link>
              <Link to="/student/settings" onClick={() => setMenuOpen(false)}>
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

export default Topbar;