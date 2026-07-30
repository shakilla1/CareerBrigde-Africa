import "./Mentorship.css";
import { Link } from "react-router-dom";
import mentorshipResources from "../../../data/mentorshipResources";

function Mentorship() {
  return (
    <section className="mentorship">

      <div className="mentorship__container">

        <div className="mentorship__header">

          <h2>Mentorship Resources</h2>

          <p>
            Access career guidance, interview preparation, and professional
            development resources prepared by CareerBridge Africa.
          </p>

        </div>

        <div className="mentorship__grid">

          {mentorshipResources.map((resource) => (

            <div
              key={resource.id}
              className="mentorship__card"
            >

              <span className="mentorship__category">
                {resource.category}
              </span>

              <h3>{resource.title}</h3>

              <p>{resource.description}</p>

              <Link
                to="/login"
                className="mentorship__button"
              >
                Explore Resource
              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Mentorship;