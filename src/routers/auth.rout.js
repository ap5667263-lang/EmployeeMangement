const { Router } = require("express");
const authController = require("../controllers/auth.controller.js");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const upload = require("../middleware/upload.middleware");
const {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} = require("../utils/validators");

const authRouter = Router();

authRouter.post("/register", upload.single("profileImage"), validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.get("/me", protect, authController.getMe);
authRouter.put("/profile", protect, upload.single("image"), validate(updateProfileSchema), authController.updateProfile);
authRouter.post("/change-password", protect, validate(changePasswordSchema), authController.changePassword);
authRouter.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
authRouter.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
authRouter.get("/sessions", protect, authController.listSessions);
authRouter.post("/logout-all", protect, authController.logoutAll);
authRouter.get("/verify-email/:token", authController.verifyEmail);
authRouter.post("/refresh", authController.refreshToken);
authRouter.post("/logout", protect, authController.logout);
authRouter.get("/admin", protect, authorizeRoles("admin"), (req, res) => res.status(200).json({ message: "Admin access granted" }));

module.exports = authRouter;
