const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../model/user.model");
const sessionModel = require("../model/session.model");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        const cookieToken = req.cookies?.accessToken || req.cookies?.token || req.cookies?.authToken || null;
        const queryToken = req.query?.token || null;
        const token = headerToken || cookieToken || queryToken;

        if (!token) {
            return res.status(401).json({ message: "Access token not found in header, cookie, or query" });
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
