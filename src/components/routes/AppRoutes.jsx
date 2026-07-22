import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login/Login";
import VerifyOtp from "../pages/verifyotp/verifyotp";
import ForgotPassword from "../pages/ForgetPassword/ForgetPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import NewPassword from "../pages/NewPassword/NewPassword";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"                element={<Register />} />
                <Route path="/register"        element={<Register />} />
                <Route path="/login"           element={<Login />} />
                <Route path="/verify-otp"      element={<VerifyOtp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password"  element={<ResetPassword />} />
                <Route path="/new-password"    element={<NewPassword />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;