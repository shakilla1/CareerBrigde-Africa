import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../../services/authService";
import { setAuthData } from "../../../utils/authStorage";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setNotice("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      setAuthData(data, rememberMe);

      if (data.user.role === "student") {
        navigate("/student/dashboard");
      } else if (data.user.role === "employer") {
        navigate("/employer/dashboard");
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setError("This account has an unrecognised role.");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.error || "Login failed.");
      } else {
        setError(
          "Could not reach the server. It may still be starting up, please wait a moment and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-container">

        <div className="login-header">
          <h1>Welcome Back</h1>

          <p>
            Login to access your CareerBridge Africa account.
          </p>
        </div>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {notice && (
          <p className="login-error">
            {notice}
          </p>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          <div className="login-options">

            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <a
              href="#reset"
              onClick={(event) => {
                event.preventDefault();
                setNotice(
                  "Password reset is not available yet. Please contact an administrator."
                );
              }}
            >
              Forgot password?
            </a>

          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="register-link">

            Don't have an account?

            <Link to="/register">
              Register
            </Link>

          </p>

        </form>

      </div>
    </section>
  );
}

export default Login;