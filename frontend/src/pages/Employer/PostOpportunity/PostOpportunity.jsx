import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOpportunity } from "../../../services/opportunityService";
import "./PostOpportunity.css";

function PostOpportunity() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    employment_type: "",
    description: "",
    required_skills: "",
    salary_min: "",
    salary_max: "",
    deadline: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description) {
      setError("Job title and description are required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        location: formData.location,
        employment_type: formData.employment_type,
        description: formData.description,
        required_skills: formData.required_skills,
        salary_min: formData.salary_min ? Number(formData.salary_min) : null,
        salary_max: formData.salary_max ? Number(formData.salary_max) : null,
        deadline: formData.deadline || null,
      };

      await createOpportunity(payload);
      navigate("/employer/manage-opportunities");
    } catch (err) {
      setError(err.response?.data?.error || "Could not post this opportunity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="post-opportunity">

      <div className="page-header">
        <h1>Post Opportunity</h1>
        <p>Create a new job or internship opportunity.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <form className="opportunity-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />

        <select
          name="employment_type"
          value={formData.employment_type}
          onChange={handleChange}
        >
          <option value="">Employment Type</option>
          <option value="full_time">Full-Time</option>
          <option value="part_time">Part-Time</option>
          <option value="internship">Internship</option>
        </select>

        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <input
          type="text"
          name="required_skills"
          placeholder="Required Skills (comma separated)"
          value={formData.required_skills}
          onChange={handleChange}
        />

        <div className="opportunity-form__row">
          <input
            type="number"
            name="salary_min"
            placeholder="Minimum Salary"
            value={formData.salary_min}
            onChange={handleChange}
          />

          <input
            type="number"
            name="salary_max"
            placeholder="Maximum Salary"
            value={formData.salary_max}
            onChange={handleChange}
          />
        </div>

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Opportunity"}
        </button>

      </form>

    </section>
  );
}

export default PostOpportunity;