import "./JobCard.css";
import { FiMapPin, FiClock } from "react-icons/fi";

function JobCard({ job }) {
  return (
    <div className="job-card">

      <div className="job-card__header">
        <h3>{job.title}</h3>

        <span className="job-card__badge">
          {job.type}
        </span>
      </div>

      <h4>{job.company}</h4>

      <div className="job-card__details">

        <div className="job-card__detail">
          <FiMapPin />
          <span>{job.location}</span>
        </div>

        <div className="job-card__detail">
          <FiClock />
          <span>{job.mode}</span>
        </div>

      </div>

      <button className="job-card__button">
        Apply Now
      </button>

    </div>
  );
}

export default JobCard;