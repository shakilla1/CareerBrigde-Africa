import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__container">

        <Link to="/" className="navbar__logo">
          CareerBridge Africa
        </Link>

        <nav className="navbar__menu">
          <Link to="/" className="navbar__link active">
            Find Jobs
          </Link>

          <Link to="/mentorship" className="navbar__link">
            Mentorship
          </Link>

          <Link to="/register" className="navbar__link">
            For Employers
          </Link>
        </nav>

        <div className="navbar__actions">
          <Link to="/login" className="signin-btn">
            Sign In
          </Link>

          <Link to="/register" className="signup-btn">
            Sign Up
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;