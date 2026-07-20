const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        basicSalary: {
            type: Number,
            required: true,
            min: 0,
        },

        workingDays: {
            type: Number,
            required: true,
            min: 0,
        },

        presentDays: {
            type: Number,
            required: true,
            min: 0,
        },

        leaveDays: {
            type: Number,
            default: 0,
            min: 0,
        },

        overtimeHours: {
            type: Number,
            default: 0,
            min: 0,
        },

        bonus: {
            type: Number,
            default: 0,
            min: 0,
        },

        deduction: {
            type: Number,
            default: 0,
            min: 0,
        },

        netSalary: {
            type: Number,
            required: true,
            min: 0,
        },

        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },

        year: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Paid", "Cancelled"],
            default: "Pending",
        },

        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// One payroll per employee per month
payrollSchema.index(
    {
        employee: 1,
        month: 1,
        year: 1,
    },
    {
        unique: true,
    }
);

const payrollModel = mongoose.model("Payroll", payrollSchema);

module.exports = payrollModel;