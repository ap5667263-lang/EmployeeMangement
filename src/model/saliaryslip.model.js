const mongoose = require("mongoose");

const salarySlipSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        payroll: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payroll",
            required: true,
            unique: true,
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

        pdfUrl: {
            type: String,
            default: "",
        },

        emailSent: {
            type: Boolean,
            default: false,
        },

        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// One salary slip per payroll — unique: true in field handles this

const salarySlipModel = mongoose.model(
    "SalarySlip",
    salarySlipSchema
);

module.exports = salarySlipModel;