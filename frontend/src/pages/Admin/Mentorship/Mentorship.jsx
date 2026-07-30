import "../../../styles/admin.css";

import mentorshipResources from "../../../data/mentorshipResources";

function Mentorship() {
  return (
    <section className="admin-mentorship">

      <div className="page-header">
        <h1>Mentorship Resources</h1>
        <p>Manage career guidance videos and articles.</p>
      </div>

      <button className="primary-btn">
        Add Resource
      </button>

      <div className="resource-grid">

        {mentorshipResources.map((resource) => (

          <div
            key={resource.id}
            className="resource-card"
          >

            <h3>{resource.title}</h3>

            <p>{resource.description}</p>

            <div className="resource-actions">
              <button>Edit</button>
              <button>Delete</button>
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Mentorship;