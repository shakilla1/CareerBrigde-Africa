import { useEffect, useState } from "react";
import { getMentorshipResources } from "../../../services/mentorshipService";
import "./Mentorship.css";

function Mentorship() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await getMentorshipResources();
        setResources(data);
      } catch (err) {
        setError("Could not load mentorship resources.");
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  return (
    <section className="mentorship">

      <div className="page-header">
        <h1>Mentorship Resources</h1>
        <p>Videos and career resources provided by the administrator.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="resource-grid">

        {loading ? (
          <p>Loading resources...</p>
        ) : resources.length === 0 ? (
          <p>No mentorship resources have been published yet.</p>
        ) : (
          resources.map((resource) => (

            <div
              key={resource.id}
              className="resource-card"
            >

              <h3>{resource.title}</h3>

              <p>{resource.category}</p>

              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resource.resource_type === "video"
                  ? "Watch Video"
                  : "Read Article"}
              </a>

            </div>

          ))
        )}

      </div>

    </section>
  );
}

export default Mentorship;
