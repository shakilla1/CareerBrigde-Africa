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

          <a href="/register" className="cta__primary">
            Get Started
          </a>

          <a href="/about" className="cta__secondary">
            Learn More
          </a>

        </div>

      </div>
    </section>
  );
}

export default CallToAction;