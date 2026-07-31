import { useState } from "react";
import { changePassword } from "../../../services/authService";

/**
 * Reused by the student, employer and admin settings pages.
 * It only uses class names that already exist in the stylesheets.
 */
function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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

    if (formData.newPassword !== formData.confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      setSuccess("Password updated successfully.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.error || "Could not update your password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)}>
        {open ? "Cancel" : "Change Password"}
      </button>

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      {open && (
        <form className="profile-form" onSubmit={handleSubmit}>

          <input
            type="password"
            name="currentPassword"
            placeholder="Current password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Password"}
          </button>

        </form>
      )}
    </>
  );
}

export default ChangePasswordForm;
