const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        leaveType: {
            type: String,
            enum: ["Casual", "Sick", "Annual", "Maternity", "Paternity", "Unpaid"],
            required: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        totalDays: {
            type: Number,
            required: true,
            min: 1,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },

        remarks: {
            type: String,
            trim: true,
            default: "",
            maxlength: 500,
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate leave request for same employee and dates
leaveSchema.index(
    {
        employee: 1,
        startDate: 1,
        endDate: 1,
    },
    {
        unique: true,
    }
);

const leaveModel = mongoose.model("Leave", leaveSchema);

module.exports = leaveModel;