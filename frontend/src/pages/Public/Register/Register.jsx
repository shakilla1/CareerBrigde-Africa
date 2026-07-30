import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/authService";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    accountType: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.accountType || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.accountType === "employer" && !formData.companyName) {
      setError("Company name is required for employer accounts.");
      return;
    }

    const role = formData.accountType === "student_graduate" ? "student" : "employer";

    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: role,
    };

    if (role === "employer") {
      payload.company_name = formData.companyName;
    }

    setLoading(true);

    try {
      await registerUser(payload);
      setRegistered(true);
    } catch (err) {
      const message = err.response?.data?.error || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <section className="register-page">
        <div className="register-container">

          <div className="register-header">
            <h1>Account Created</h1>

            <p>
              Your CareerBridge Africa account has been created successfully.
              You can now log in to continue.
            </p>
          </div>

          <button type="button" className="success-button" onClick={() => navigate("/login")}>
            Go to Login
          </button>

        </div>
      </section>
    );
  }

  return (
    <section className="register-page">
      <div className="register-container">

        <div className="register-header">
          <h1>Create an Account</h1>

          <p>
            Join CareerBridge Africa and start your career journey today.
          </p>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Account Type</label>

            <select name="accountType" value={formData.accountType} onChange={handleChange}>
              <option value="">Select account type</option>
              <option value="student_graduate">
                Student & Graduate
              </option>
              <option value="employer">
                Employer
              </option>
            </select>
          </div>

          {formData.accountType === "employer" && (
            <div className="form-group">
              <label>Company Name</label>

              <input
                type="text"
                name="companyName"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="login-link">
            Already have an account?

            <Link to="/login">
              Login
            </Link>
          </p>

        </form>

      </div>
    </section>
  );
}

export default Register;