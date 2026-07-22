import api from "./api";

// Register — multipart/form-data (image upload)
export const registerUser = async (formData) => {
    const response = await api.post("/auth/register", formData);
    return response.data;
};

// Login — returns email after OTP is sent
export const loginUser = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

// Verify login OTP
export const verifyOtp = async (data) => {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
};

// Forgot password — sends OTP to email
export const forgotPassword = async (data) => {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
};

// Verify forgot OTP + set new password
export const verifyForgotOtp = async (data) => {
    const response = await api.post("/auth/verify-forgot-otp", data);
    return response.data;
};

// Get current user
export const getMe = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

// Logout
export const logoutUser = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
};
