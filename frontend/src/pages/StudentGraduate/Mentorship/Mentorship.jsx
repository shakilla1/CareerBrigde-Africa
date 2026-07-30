import "./Mentorship.css";

import mentorshipResources from "../../../data/mentorshipResources";

function Mentorship() {
  return (
    <section className="mentorship">

      <div className="page-header">
        <h1>Mentorship Resources</h1>
        <p>Videos and career resources provided by the administrator.</p>
      </div>

      <div className="resource-grid">

        {mentorshipResources.map((resource) => (

          <div
            key={resource.id}
            className="resource-card"
          >

            <h3>{resource.title}</h3>

            <p>{resource.description}</p>

            <a
              href={resource.youtubeLink || resource.articleLink}
              target="_blank"
              rel="noopener noreferrer"
            >
             {resource.type === "Video"
              ? "Watch Video"
              : "Read Article"}

            </a>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Mentorship;