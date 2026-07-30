import "./Hero.css";
import { Link } from "react-router-dom";
import { FiSearch, FiBriefcase } from "react-icons/fi";
import heroImage from "../../../assets/images/hero-image.jpg";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__container">

        <div className="hero__content">

          <span className="hero__tag">
            Empowering Africa's Next Generation
          </span>

          <h1 className="hero__title">
            Your Bridge to a Brighter Career in Africa
          </h1>

          <p className="hero__description">
            Connecting Rwandan youth with verified internships,
            entry-level jobs and world-class mentorship to help
            launch successful careers.
          </p>

          <div className="hero__buttons">

            <Link to="/register" className="primary-btn">
              Find a Job
              <FiSearch />
            </Link>

            <Link to="/login" className="secondary-btn">
              Hire Talent
              <FiBriefcase />
            </Link>

          </div>

        </div>

        <div className="hero__image">

          <img
            src={heroImage}
            alt="CareerBridge Africa"
          />

          <div className="hero__card">

            <span>Verified Roles</span>

            <h2>100%</h2>

            <p>Secure</p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;