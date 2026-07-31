import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../../services/profileService";
import "../../../styles/admin.css";

function Profile() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
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
        });
      } catch (err) {
        setError("Could not load your profile.");
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
      await updateProfile({ full_name: formData.fullName });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-profile">
        <div className="page-header">
          <h1>Profile</h1>
          <p>Manage your administrator account.</p>
        </div>
        <p>Loading your profile...</p>
      </section>
    );
  }

  return (
    <section className="admin-profile">

      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your administrator account.</p>
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

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>

    </section>
  );
}

export default Profile;
