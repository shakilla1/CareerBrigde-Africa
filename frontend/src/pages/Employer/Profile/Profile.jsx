import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../../services/profileService";
import "./Profile.css";

function Profile() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    industry: "",
    location: "",
    about: "",
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
          companyName: data.profile?.company_name || "",
          industry: data.profile?.industry || "",
          location: data.profile?.location || "",
          about: data.profile?.about || "",
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
        company_name: formData.companyName,
        industry: formData.industry,
        location: formData.location,
        about: formData.about,
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Could not save changes.");
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
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={formData.industry}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />

        <textarea
          name="about"
          placeholder="Professional Summary"
          value={formData.about}
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
