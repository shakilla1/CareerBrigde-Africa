import "./About.css";

function About() {
  return (
    <section className="about">

      <div className="about__hero">

        <h1>About CareerBridge Africa</h1>

        <p>
          Empowering students, graduates, and employers by connecting talent
          with meaningful career opportunities across Africa.
        </p>

      </div>

      <div className="about__container">

        <section className="about__section">

          <h2>Our Mission</h2>

          <p>
            CareerBridge Africa aims to reduce unemployment by connecting
            students and graduates with internships, jobs, mentorship resources,
            and trusted employers through one easy-to-use platform.
          </p>

        </section>

        <section className="about__section">

          <h2>Our Vision</h2>

          <p>
            To become Africa's trusted career platform that empowers young
            professionals to build successful careers while helping employers
            discover skilled talent.
          </p>

        </section>

        <section className="about__section">

          <h2>What We Offer</h2>

          <div className="about__cards">

            <div className="about__card">
              <h3>Job Opportunities</h3>
              <p>
                Browse verified jobs and internships from trusted employers.
              </p>
            </div>

            <div className="about__card">
              <h3>Mentorship Resources</h3>
              <p>
                Learn through career guidance articles, videos, and practical
                advice.
              </p>
            </div>

            <div className="about__card">
              <h3>Employer Connections</h3>
              <p>
                Connect talented graduates with organisations looking for
                skilled professionals.
              </p>
            </div>

          </div>

        </section>

        <section className="about__section">

          <h2>Our Values</h2>

          <div className="about__values">

            <div className="value-card">
              <h3>Integrity</h3>
              <p>We promote transparency and trustworthy opportunities.</p>
            </div>

            <div className="value-card">
              <h3>Innovation</h3>
              <p>Using technology to solve employment challenges.</p>
            </div>

            <div className="value-card">
              <h3>Inclusivity</h3>
              <p>Creating opportunities for every young African.</p>
            </div>

            <div className="value-card">
              <h3>Growth</h3>
              <p>Supporting lifelong learning and professional development.</p>
            </div>

          </div>

        </section>

        <section className="about__cta">

          <h2>Start Your Career Journey Today</h2>

          <p>
            Whether you are searching for your first opportunity or looking for
            talented candidates, CareerBridge Africa is here to help.
          </p>

          <a
            href="/register"
            className="about__button"
          >
            Join CareerBridge Africa
          </a>

        </section>

      </div>

    </section>
  );
}

export default About;