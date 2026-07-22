import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./verifyotp.scss";
import { verifyOtp } from "../../services/auth.service";
import Button from "../../Button/Button";

const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes

function VerifyOtp() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || "";

  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);

  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const isExpired = timeLeft <= 0;

  // OTP box handlers
  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isExpired) {
      setError("OTP has expired. Please login again.");
      return;
    }

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    if (!email) {
      setError("Email not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtp({ email, otp: otpString });

      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid OTP. Please try again.";
      setError(msg);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-otp">
      <div className="verify-otp__card">

        <h1 className="verify-otp__title">OTP Verification</h1>
        <p className="verify-otp__subtitle">
          OTP sent to <strong>{email || "your email"}</strong>
        </p>

        {/* Timer */}
        <div className={`verify-otp__timer ${isExpired ? "verify-otp__timer--expired" : timeLeft <= 60 ? "verify-otp__timer--warning" : ""}`}>
          {isExpired ? "⏰ OTP expired" : `⏱ ${formatTime(timeLeft)}`}
        </div>

        {error   && <div className="verify-otp__alert verify-otp__alert--error">{error}</div>}
        {success && <div className="verify-otp__alert verify-otp__alert--success">{success}</div>}

        <form className="verify-otp__form" onSubmit={handleSubmit}>
          <div className="verify-otp__boxes">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className={`verify-otp__box ${digit ? "verify-otp__box--filled" : ""}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoFocus={index === 0}
                disabled={isExpired}
              />
            ))}
          </div>

          <Button type="submit" disabled={loading || otp.join("").length !== 6 || isExpired}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

        <div className="verify-otp__footer">
          {isExpired
            ? <Link to="/login">← Login again</Link>
            : <><span>Didn't receive OTP? </span><Link to="/login">Back to Login</Link></>
          }
        </div>

      </div>
    </div>
  );
}

export default VerifyOtp;
