const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        date: {
            type: Date,
            required: true,
            default: Date.now,
        },

        checkIn: {
            type: Date,
            default: null,
        },

        checkOut: {
            type: Date,
            default: null,
        },

        workingHours: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["Present", "Absent", "Half-Day", "Leave"],
            default: "Present",
        },

        remarks: {
            type: String,
            trim: true,
            default: "",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// One attendance per employee per day
attendanceSchema.index(
    { employee: 1, date: 1 },
    { unique: true }
);

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = attendanceModel;