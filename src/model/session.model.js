const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        refreshTokenHash: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            index: { expires: "7d" },
        },
        revoked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const sessionModel = mongoose.model("Session", sessionSchema);

module.exports = sessionModel;
