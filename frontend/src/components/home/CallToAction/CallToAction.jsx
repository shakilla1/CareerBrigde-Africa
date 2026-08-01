import { Link } from "react-router-dom";
import "./CallToAction.css";

function CallToAction() {
  return (
    <section className="cta">
      <div className="cta__container">
        <h2>
          Start Building Your Career Today
        </h2>
        <p>
          Join CareerBridge Africa to discover opportunities, gain career
          guidance and connect with employers across Africa.
        </p>
        <div className="cta__buttons">
          <Link to="/register" className="cta__primary">
            Get Started
          </Link>
          <Link to="/about" className="cta__secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
export default CallToAction;