import "./FeaturedJobs.css";
import JobCard from "../JobCard/JobCard";
import featuredJobs from "../../../data/featuredJobs";

function FeaturedJobs() {
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
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedJobs;