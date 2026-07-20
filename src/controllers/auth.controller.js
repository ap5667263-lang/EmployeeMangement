const crypto = require("crypto");
const userModel = require("../model/user.model");
const sessionModel = require("../model/session.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const config = require("../config/config");
const { sendVerificationEmail, sendLoginOtpEmail } = require("../utils/email");
const uploadImage = require("../utils/uploadImage");
const passwordResetTokens = new Map();

async function register(req, res) {
    try {
        const { username, email, password, role } = req.body;

        const isAlreadyRegistered = await userModel.findOne({
            $or: [{ username }, { email }],
        });

        if (isAlreadyRegistered) {
            return res.status(409).json({
                message: "User is Already Registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(20).toString("hex");

        // Image upload — file ho toh upload, warna default
        const { url: profileImage } = await uploadImage(req.file);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            profileImage,
            role: role || "user",
            verificationToken,
        });

        await sendVerificationEmail(email, verificationToken);

        // Session create
        const session = await sessionModel.create({
            userId: user._id,
            refreshTokenHash: "temp",
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        const { accessToken, refreshToken } = generateToken(
            user._id,
            session._id
        );

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        session.refreshTokenHash = refreshTokenHash;
        await session.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "User Registered Successfully",
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                role: user.role,
            },
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid Email or Password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Email or Password",
            });
        }

        // OTP generate karo — 6 digit
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.loginOtp = otp;
        user.loginOtpExpires = otpExpires;
        await user.save();

        // OTP email bhejo
        await sendLoginOtpEmail(email, otp);

        return res.status(200).json({
            message: "OTP sent to your email. Please verify to complete login.",
            email,
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // OTP check karo
        if (!user.loginOtp || user.loginOtp !== otp) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

        // OTP expire check
        if (user.loginOtpExpires < new Date()) {
            return res.status(401).json({ message: "OTP has expired" });
        }

        // OTP clear karo
        user.loginOtp = null;
        user.loginOtpExpires = null;
        await user.save();

        // Session create karo
        const session = await sessionModel.create({
            userId: user._id,
            refreshTokenHash: "temp",
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        const { accessToken, refreshToken } = generateToken(user._id, session._id);

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        session.refreshTokenHash = refreshTokenHash;
        await session.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login Successful",
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
            },
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}
async function getMe(req, res) {
    try {
        const user = req.user;

        res.status(200).json({
            message: "User fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                role: user.role,
            },
        });

    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired access token",
        });
    }
}

async function refreshToken(req, res) {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({
            message: "Refresh Token not found",
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET);

        // Session check karo DB mai
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const session = await sessionModel.findOne({
            _id: decoded.sessionId,
            revoked: false,
            refreshTokenHash: tokenHash,
        });

        if (!session) {
            return res.status(403).json({
                message: "Session not found or already used",
            });
        }

        // Naya token generate karo same sessionId ke saath
        const accessToken = jwt.sign(
            { id: decoded.id, sessionId: session._id },
            config.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { id: decoded.id, sessionId: session._id },
            config.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // Session mai naya hash save karo
        session.refreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
        await session.save();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,          // Production mai true karna (HTTPS)
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
        });

        res.status(200).json({
            message: "Token refreshed",
            accessToken,
        });

    } catch (err) {
        return res.status(403).json({
            message: "Invalid or Expired Refresh Token",
        });
    }
}

async function logout(req, res) {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(400).json({
                message: "Refresh Token not found",
            });
        }

        const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET);

        const refreshTokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const session = await sessionModel.findOne({
            _id: decoded.sessionId,
            refreshTokenHash,
            revoked: false,
        });

        if (!session) {
            return res.status(400).json({
                message: "Invalid Refresh Token",
            });
        }

        session.revoked = true;
        await session.save();

        res.clearCookie("refreshToken");

        res.status(200).json({
            message: "Logout Successfully",
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

async function updateProfile(req, res) {
    try {
        const user = req.user;
        const { username, email } = req.body;

        if (username) user.username = username;
        if (email) user.email = email;

        if (req.file) {
            try {
                const { url } = await uploadImage(req.file);
                user.profileImage = url;
            } catch (imagekitErr) {
                console.warn("ImageKit upload failed:", imagekitErr.message);
            }
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                role: user.role,
            },
        });

    } catch (err) {
        console.error("Update Profile Error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

async function changePassword(req, res) {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        await sessionModel.updateMany({ userId: user._id }, { revoked: true });

        res.status(200).json({ message: "Password changed successfully. Please login again." });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = crypto.randomBytes(20).toString("hex");
        passwordResetTokens.set(token, user._id.toString());

        res.status(200).json({ message: "Password reset token generated", token });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;
        const userId = passwordResetTokens.get(token);

        if (!userId) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        passwordResetTokens.delete(token);

        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function verifyEmail(req, res) {
    try {
        const { token } = req.params;
        const user = await userModel.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid verification token" });
        }

        user.isEmailVerified = true;
        user.verificationToken = "";
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function listSessions(req, res) {
    try {
        const sessions = await sessionModel.find({ userId: req.user._id }).select("-refreshTokenHash");
        res.status(200).json({ sessions });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function logoutAll(req, res) {
    try {
        await sessionModel.updateMany({ userId: req.user._id }, { revoked: true });
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "All sessions logged out" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

module.exports = {
    register,
    getMe,
    login,
    verifyOtp,
    refreshToken,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    listSessions,
    logoutAll,
};
