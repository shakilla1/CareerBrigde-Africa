import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../../../services/profileService";
import "./Profile.css";

function Profile() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    careerInterests: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        setFormData({
          fullName: data.full_name || "",
          email: data.email || "",
          phone: "",
          skills: data.profile?.skills || "",
          careerInterests: data.profile?.career_interests || "",
        });
      } catch (err) {
        setError("Could not load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateProfile({
        full_name: formData.fullName,
        skills: formData.skills,
        career_interests: formData.careerInterests,
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="profile">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your personal information.</p>
        </div>
        <p>Loading your profile...</p>
      </section>
    );
  }

  return (
    <section className="profile">

      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information.</p>
      </div>

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      <form className="profile-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          disabled
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <textarea
          name="skills"
          placeholder="Your Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
        ></textarea>

        <textarea
          name="careerInterests"
          placeholder="Career Interests"
          value={formData.careerInterests}
          onChange={handleChange}
        ></textarea>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>

    </section>
  );
}

export default Profile;