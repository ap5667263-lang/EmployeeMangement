import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { registerUser } from "../../services/auth.service";
import Input from "../../Input/Input";
import Button from "../../Button/Button";

const ROLES = [
  { value: "user",    label: "User" },
  { value: "manager", label: "Manager" },
  { value: "admin",   label: "Admin" },
];

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username:        "",
    email:           "",
    password:        "",
    confirmPassword: "",
    role:            "user",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview,      setPreview]      = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { setError("Only JPEG, PNG, or WEBP images allowed."); return; }
    if (file.size > 5 * 1024 * 1024)  { setError("Image must be under 5MB."); return; }
    setError("");
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email",    formData.email);
    data.append("password", formData.password);
    data.append("role",     formData.role);
    if (profileImage) data.append("profileImage", profileImage);

    try {
      setLoading(true);
      await registerUser(data);
      setSuccess("Registered! Redirecting to login...");
      setFormData({ username: "", email: "", password: "", confirmPassword: "", role: "user" });
      setProfileImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.details?.join(", ") ||
        err?.message ||
        "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__card">

        <h1 className="register__title">Employee Management</h1>
        <p className="register__subtitle">Create your account</p>

        {error   && <div className="register__alert register__alert--error">{error}</div>}
        {success && <div className="register__alert register__alert--success">{success}</div>}

        <form className="register__form" onSubmit={handleSubmit}>

          {/* Profile Image */}
          <div className="register__avatar">
            <div
              className="register__avatar-preview"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload photo"
            >
              {preview
                ? <img src={preview} alt="Preview" />
                : <div className="register__avatar-placeholder"><span>📷</span><p>Upload Photo</p></div>
              }
            </div>
            {preview && (
              <button type="button" className="register__avatar-remove" onClick={handleRemoveImage}>
                ✕ Remove
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          <Input label="Username"        type="text"     name="username"        value={formData.username}        onChange={handleChange} placeholder="Enter username"       required />
          <Input label="Email"           type="email"    name="email"           value={formData.email}           onChange={handleChange} placeholder="Enter email"          required />
          <Input label="Password"        type="password" name="password"        value={formData.password}        onChange={handleChange} placeholder="Enter password"       required />
          <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password"    required />

          {/* Role */}
          <div className="register__role">
            <label className="register__role-label">Role</label>
            <div className="register__role-options">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`register__role-option ${formData.role === r.value ? "register__role-option--active" : ""}`}
                >
                  <input type="radio" name="role" value={r.value} checked={formData.role === r.value} onChange={handleChange} />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>

        </form>

        <div className="register__footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
