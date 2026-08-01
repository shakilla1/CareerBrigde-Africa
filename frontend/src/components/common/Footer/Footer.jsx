import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer__container">

        <div className="footer__brand">

          <h2>CareerBridge Africa</h2>

          <p>
            Connecting students, graduates, and employers through opportunities,
            mentorship, and career development across Africa.
          </p>

        </div>

        <div className="footer__links">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

        </div>

        <div className="footer__links">

          <h3>Resources</h3>

          <Link to="/login">Mentorship</Link>
          <Link to="/register">Register</Link>

        </div>

        <div className="footer__contact">

          <h3>Contact</h3>

          <p>cyberhubtech2@gmail.com</p>
          <p>Kigali, Rwanda</p>

        </div>

      </div>

      <div className="footer__bottom">

        <p>
          © {new Date().getFullYear()} CareerBridge Africa. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;