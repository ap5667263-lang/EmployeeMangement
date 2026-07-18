const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateToken = (userId, sessionId) => {
    const accessToken = jwt.sign(
        { id: userId, sessionId },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: userId, sessionId },
        config.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
};

module.exports = generateToken;
