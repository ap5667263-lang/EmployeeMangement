import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgetPassword.scss";
import { forgotPassword } from "../../services/auth.service";
import Input from "../../Input/Input";
import Button from "../../Button/Button";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const response = await forgotPassword({ email });
      console.log("Forgot password response:", response);

      setSuccess("OTP sent to your email! Redirecting...");

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 1500);

    } catch (err) {
      console.error("Forgot password error:", err);
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
    <div className="forgot-password">
      <div className="forgot-password__card">

        <h1 className="forgot-password__title">Forgot Password</h1>
        <p className="forgot-password__subtitle">
          Enter your email to receive a reset link
        </p>

        {error && (
          <div className="forgot-password__alert forgot-password__alert--error">
            {error}
          </div>
        )}
        {success && (
          <div className="forgot-password__alert forgot-password__alert--success">
            {success}
          </div>
        )}

        <form className="forgot-password__form" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </form>

        <div className="forgot-password__footer">
          Remember your password?{" "}
          <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
