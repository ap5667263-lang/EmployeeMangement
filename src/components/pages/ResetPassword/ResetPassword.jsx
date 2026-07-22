import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./ResetPassword.scss";
import Button from "../../Button/Button";

const OTP_EXPIRY_SECONDS = 10 * 60;

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email    = location.state?.email || "";

  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);

  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const isExpired = timeLeft <= 0;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isExpired) { setError("OTP expired. Request again."); return; }
    const otpString = otp.join("");
    if (otpString.length !== 6) { setError("Please enter all 6 digits."); return; }
    if (!email) { setError("Email not found. Please go back."); return; }

    // OTP verified locally — new password page pe jao
    navigate("/new-password", { state: { email, otp: otpString } });
  };

  return (
    <div className="reset-password">
      <div className="reset-password__card">

        <h1 className="reset-password__title">Enter OTP</h1>
        <p className="reset-password__subtitle">
          OTP sent to <strong>{email || "your email"}</strong>
        </p>

        {/* Timer */}
        <div className={`reset-password__timer ${isExpired ? "reset-password__timer--expired" : timeLeft <= 60 ? "reset-password__timer--warning" : ""}`}>
          {isExpired ? "⏰ OTP expired" : `⏱ ${formatTime(timeLeft)}`}
        </div>

        {error && <div className="reset-password__alert reset-password__alert--error">{error}</div>}

        <form className="reset-password__form" onSubmit={handleSubmit}>
          <div className="reset-password__boxes">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className={`reset-password__box ${digit ? "reset-password__box--filled" : ""}`}
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
            Next →
          </Button>
        </form>

        <div className="reset-password__footer">
          {isExpired
            ? <Link to="/forgot-password">← Request new OTP</Link>
            : <><Link to="/forgot-password">← Resend OTP</Link>{" | "}<Link to="/login">Login</Link></>
          }
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;
