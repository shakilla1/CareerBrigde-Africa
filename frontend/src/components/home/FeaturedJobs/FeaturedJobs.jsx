import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturedJobs.css";
import JobCard from "../JobCard/JobCard";
import { getOpportunities } from "../../../services/opportunityService";
import { getToken, getUser } from "../../../utils/authStorage";

function FeaturedJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getOpportunities({ perPage: 6 });
        const list = data.opportunities || data || [];

        setJobs(
          list.map((opportunity) => ({
            id: opportunity.id,
            title: opportunity.title,
            company: opportunity.company_name,
            location: opportunity.location,
            type: opportunity.employment_type,
            mode:
              opportunity.location &&
              opportunity.location.toLowerCase().includes("remote")
                ? "Remote"
                : "On-site",
          }))
        );
      } catch (error) {
        console.error("Failed to load featured opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleApply = (job) => {
    const user = getUser();

    if (getToken() && user?.role === "student") {
      navigate(`/student/opportunities/${job.id}`);
      return;
    }

    navigate("/login");
  };

  return (
    <section className="featured-jobs">
      <div className="featured-jobs__container">
        <div className="featured-jobs__header">
          <h2>Featured Opportunities</h2>

          <p>
            Discover verified jobs and internships from trusted employers.
          </p>
        </div>

        <div className="featured-jobs__grid">
          {loading ? (
            <p>Loading opportunities...</p>
          ) : jobs.length === 0 ? (
            <p>No opportunities have been posted yet.</p>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={() => handleApply(job)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedJobs;
