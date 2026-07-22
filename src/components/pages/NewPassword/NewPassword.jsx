import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./NewPassword.scss";
import { verifyForgotOtp } from "../../services/auth.service";
import Input from "../../Input/Input";
import Button from "../../Button/Button";

function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // email + otp ResetPassword page se aata hai
  const email = location.state?.email || "";
  const otp   = location.state?.otp   || "";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !otp) {
      setError("Session expired. Please start again.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await verifyForgotOtp({
        email,
        otp,
        newPassword: formData.newPassword,
      });

      setSuccess("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-password">
      <div className="new-password__card">

        <h1 className="new-password__title">New Password</h1>
        <p className="new-password__subtitle">
          Set a new password for <strong>{email || "your account"}</strong>
        </p>

        {error && (
          <div className="new-password__alert new-password__alert--error">{error}</div>
        )}
        {success && (
          <div className="new-password__alert new-password__alert--success">{success}</div>
        )}

        <form className="new-password__form" onSubmit={handleSubmit}>

          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Min 6 characters"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>

        </form>

        <div className="new-password__footer">
          <Link to="/login">Back to Login</Link>
        </div>

      </div>
    </div>
  );
}

export default NewPassword;
