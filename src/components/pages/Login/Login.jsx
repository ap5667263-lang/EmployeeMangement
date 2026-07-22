import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { loginUser } from "../../services/auth.service";
import Input from "../../Input/Input";
import Button from "../../Button/Button";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await loginUser(formData);
      console.log("Login response:", response);

      // Backend returns email after sending OTP
      // Navigate to verify-otp page with email in state
      navigate("/verify-otp", {
        state: { email: response.email || formData.email },
      });

    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__card">

        <h1 className="login__title">Employee Management</h1>
        <p className="login__subtitle">Login to your account</p>

        {error && (
          <div className="login__alert login__alert--error">{error}</div>
        )}

        <form className="login__form" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </Button>
        </form>

        <div className="login__links">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <div className="login__footer">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
