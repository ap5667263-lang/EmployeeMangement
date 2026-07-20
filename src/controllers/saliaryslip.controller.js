const mongoose = require("mongoose");
const salarySlipModel = require("../model/saliaryslip.model");
const payrollModel = require("../model/payroll.model");
const generateSalarySlipPdf = require("../utils/saliaryslipgenreator");

const generateSalarySlip = async (req, res) => {
    try {
        const { payrollId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(payrollId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Payroll Id",
            });
        }

        const payroll = await payrollModel.findById(payrollId).populate("employee");

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: "Payroll not found",
            });
        }

        const existingSlip = await salarySlipModel.findOne({ payroll: payrollId });

        if (existingSlip) {
            return res.status(400).json({
                success: false,
                message: "Salary Slip already generated",
            });
        }

        const salarySlip = await salarySlipModel.create({
            employee: payroll.employee._id,
            payroll: payroll._id,
            month: payroll.month,
            year: payroll.year,
            generatedBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Salary Slip Generated Successfully",
            salarySlip,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getSalarySlip = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Employee Id",
            });
        }

        const salarySlips = await salarySlipModel
            .find({ employee: employeeId })
            .populate("employee", "employeeId fullName email department designation")
            .populate("payroll")
            .populate("generatedBy", "username email")
            .sort({ year: -1, month: -1 });

        if (!salarySlips.length) {
            return res.status(404).json({
                success: false,
                message: "Salary Slip not found",
            });
        }

        return res.status(200).json({
            success: true,
            salarySlips,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const monthlySalarySlip = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: "Month and Year are required",
            });
        }

        const salarySlips = await salarySlipModel
            .find({ month: Number(month), year: Number(year) })
            .populate("employee", "employeeId fullName department designation")
            .populate("payroll")
            .populate("generatedBy", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: salarySlips.length,
            salarySlips,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const downloadSalarySlip = async (req, res) => {
    try {
        const { id } = req.params;

        const salarySlip = await salarySlipModel
            .findById(id)
            .populate("employee")
            .populate("payroll");

        if (!salarySlip) {
            return res.status(404).json({
                success: false,
                message: "Salary Slip not found",
            });
        }

        const pdfBuffer = await generateSalarySlipPdf(salarySlip);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=SalarySlip-${salarySlip.employee.employeeId}.pdf`
        );

        return res.send(pdfBuffer);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const sendEmail = async (req, res) => {
    try {
        const { payroll, email } = req.body;

        const salarySlip = await salarySlipModel
            .findOne({ payroll })
            .populate("employee")
            .populate("payroll");

        if (!salarySlip) {
            return res.status(404).json({
                success: false,
                message: "Salary Slip not found",
            });
        }

        const pdfBuffer = await generateSalarySlipPdf(salarySlip);

        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL, pass: process.env.Email_PASSWORD },
        });

        await transporter.sendMail({
            from: `"Employee Management" <${process.env.EMAIL}>`,
            to: email,
            subject: `Salary Slip - ${salarySlip.month}/${salarySlip.year}`,
            text: "Please find your salary slip attached.",
            attachments: [{
                filename: `SalarySlip-${salarySlip.employee.employeeId}.pdf`,
                content: pdfBuffer,
            }],
        });

        salarySlip.emailSent = true;
        await salarySlip.save();

        return res.status(200).json({
            success: true,
            message: "Salary Slip sent successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    generateSalarySlip,
    getSalarySlip,
    monthlySalarySlip,
    downloadSalarySlip,
    sendEmail,
};
