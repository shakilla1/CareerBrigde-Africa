import { useEffect, useState } from "react";
import {
  getMentorshipResources,
  createMentorshipResource,
  deleteMentorshipResource,
} from "../../../services/mentorshipService";
import "../../../styles/admin.css";

function Mentorship() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    resource_type: "video",
    link: "",
  });

  const loadResources = async () => {
    try {
      const data = await getMentorshipResources();
      setResources(data);
    } catch (error) {
      setMessage("Could not load mentorship resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!formData.title) {
      setMessage("A title is required.");
      return;
    }

    setSaving(true);

    try {
      await createMentorshipResource(formData);
      setFormData({ title: "", category: "", resource_type: "video", link: "" });
      setShowForm(false);
      await loadResources();
      setMessage("Resource added.");
    } catch (error) {
      setMessage(error.response?.data?.error || "Could not add this resource.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    setMessage("");

    try {
      await deleteMentorshipResource(id);
      setResources((previous) => previous.filter((item) => item.id !== id));
      setMessage("Resource deleted.");
    } catch (error) {
      setMessage("Could not delete this resource.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="admin-mentorship">

      <div className="page-header">
        <h1>Mentorship Resources</h1>
        <p>Manage career guidance videos and articles.</p>
      </div>

      {message && <p className="form-success">{message}</p>}

      <button
        className="primary-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Resource"}
      </button>

      {showForm && (
        <form className="profile-form" onSubmit={handleCreate}>

          <input
            type="text"
            name="title"
            placeholder="Resource title"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Category, for example Interview Tips"
            value={formData.category}
            onChange={handleChange}
          />

          <select
            name="resource_type"
            value={formData.resource_type}
            onChange={handleChange}
          >
            <option value="video">Video</option>
            <option value="article">Article</option>
          </select>

          <input
            type="url"
            name="link"
            placeholder="Link to the video or article"
            value={formData.link}
            onChange={handleChange}
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Resource"}
          </button>

        </form>
      )}

      <div className="resource-grid">

        {loading ? (
          <p>Loading resources...</p>
        ) : resources.length === 0 ? (
          <p>No mentorship resources yet.</p>
        ) : (
          resources.map((resource) => (

            <div
              key={resource.id}
              className="resource-card"
            >

              <h3>{resource.title}</h3>

              <p>
                {resource.category} • {resource.resource_type}
              </p>

              <div className="resource-actions">
                {resource.link && (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                )}

                <button
                  onClick={() => handleDelete(resource.id)}
                  disabled={busyId === resource.id}
                >
                  Delete
                </button>
              </div>

            </div>

          ))
        )}

      </div>

    </section>
  );
}

export default Mentorship;
