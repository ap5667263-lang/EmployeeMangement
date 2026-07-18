const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../model/user.model");
const sessionModel = require("../model/session.model");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            return res.status(401).json({ message: "Access token not found" });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const session = await sessionModel.findOne({
            _id: decoded.sessionId,
            userId: user._id,
            revoked: false,
        });

        if (!session) {
            return res.status(401).json({ message: "Session invalid or revoked" });
        }

        req.user = user;
        req.session = session;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
};

module.exports = protect;
