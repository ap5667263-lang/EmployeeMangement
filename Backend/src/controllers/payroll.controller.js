const mongoose = require("mongoose");
const payrollModel = require("../model/payroll.model");
const employeeModel = require("../model/employee.model");

const generatePayroll = async (req, res) => {
    try {
        const {
            employee,
            basicSalary,
            workingDays,
            presentDays,
            leaveDays,
            overtimeHours,
            bonus,
            deduction,
            month,
            year,
        } = req.body;

        // Employee Exists?
        const employeeExists = await employeeModel.findById(employee);

        if (!employeeExists) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        // Duplicate Payroll
        const existingPayroll = await payrollModel.findOne({
            employee,
            month,
            year,
        });

        if (existingPayroll) {
            return res.status(400).json({
                success: false,
                message: "Payroll already generated",
            });
        }

        // Salary Calculation
        const perDaySalary = basicSalary / workingDays;

        const overtimeAmount = overtimeHours * 200;

        const netSalary =
            (perDaySalary * presentDays) +
            overtimeAmount +
            bonus -
            deduction;

        // Create Payroll
        const payroll = await payrollModel.create({
            employee,
            basicSalary,
            workingDays,
            presentDays,
            leaveDays,
            overtimeHours,
            bonus,
            deduction,
            netSalary,
            month,
            year,
            generatedBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Payroll generated successfully",
            payroll,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const getAllPayrolls = async (req, res) => {
    try {

        const payrolls = await payrollModel
            .find()
            .populate(
                "employee",
                "employeeId fullName email department designation"
            )
            .populate(
                "generatedBy",
                "username email"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: payrolls.length,
            payrolls,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const getPayrollByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Employee Id",
            });
        }

        const payrolls = await payrollModel
            .find({ employee: employeeId })
            .populate(
                "employee",
                "employeeId fullName email department designation"
            )
            .populate(
                "generatedBy",
                "username email"
            )
            .sort({
                year: -1,
                month: -1,
            });

        if (payrolls.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payroll not found",
            });
        }

        return res.status(200).json({
            success: true,
            count: payrolls.length,
            payrolls,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const updatePayroll = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Payroll Id",
            });
        }

        const payroll = await payrollModel.findById(id);

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: "Payroll not found",
            });
        }

        const {
            basicSalary,
            workingDays,
            presentDays,
            leaveDays,
            overtimeHours,
            bonus,
            deduction,
            month,
            year,
            status,
        } = req.body;

        payroll.basicSalary = basicSalary ?? payroll.basicSalary;
        payroll.workingDays = workingDays ?? payroll.workingDays;
        payroll.presentDays = presentDays ?? payroll.presentDays;
        payroll.leaveDays = leaveDays ?? payroll.leaveDays;
        payroll.overtimeHours = overtimeHours ?? payroll.overtimeHours;
        payroll.bonus = bonus ?? payroll.bonus;
        payroll.deduction = deduction ?? payroll.deduction;
        payroll.month = month ?? payroll.month;
        payroll.year = year ?? payroll.year;
        payroll.status = status ?? payroll.status;

        // Recalculate Net Salary
        const perDaySalary =
            payroll.basicSalary / payroll.workingDays;

        const overtimeAmount =
            payroll.overtimeHours * 200;

        payroll.netSalary =
            (perDaySalary * payroll.presentDays) +
            overtimeAmount +
            payroll.bonus -
            payroll.deduction;

        await payroll.save();

        return res.status(200).json({
            success: true,
            message: "Payroll updated successfully",
            payroll,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const deletePayroll = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Payroll Id",
            });
        }

        const payroll = await payrollModel.findById(id);

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: "Payroll not found",
            });
        }

        await payroll.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Payroll deleted successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const monthlyPayrollReport = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: "Month and Year are required",
            });
        }

        const payrolls = await payrollModel
            .find({
                month: Number(month),
                year: Number(year),
            })
            .populate(
                "employee",
                "employeeId fullName department designation"
            )
            .populate(
                "generatedBy",
                "username email"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: payrolls.length,
            payrolls,
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
    generatePayroll,
    getAllPayrolls,
    getPayrollByEmployee,
    updatePayroll,
    deletePayroll,
    monthlyPayrollReport,

}