const mongoose = require("mongoose");
const leaveModel = require("../model/leave.model");
const employeeModel = require("../model/employee.model");

const applyLeave = async (req, res) => {
    try {
        const {
            employee,
            leaveType,
            startDate,
            endDate,
            totalDays,
            reason,
        } = req.body;

        // Check Employee Exists
        const employeeExists = await employeeModel.findById(employee);

        if (!employeeExists) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        // Check Duplicate Leave
        const existingLeave = await leaveModel.findOne({
            employee,
            startDate,
            endDate,
        });

        if (existingLeave) {
            return res.status(400).json({
                success: false,
                message: "Leave request already exists",
            });
        }

        // Create Leave
        const leave = await leaveModel.create({
            employee,
            leaveType,
            startDate,
            endDate,
            totalDays,
            reason,
        });

        return res.status(201).json({
            success: true,
            message: "Leave applied successfully",
            leave,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const getAllLeaves = async (req, res) => {
    try {

        const leaves = await leaveModel
            .find()
            .populate(
                "employee",
                "employeeId fullName email department designation"
            )
            .populate(
                "approvedBy",
                "username email"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: leaves.length,
            leaves,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getLeaveById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Leave Id",
            });
        }

        const leave = await leaveModel
            .findById(id)
            .populate(
                "employee",
                "employeeId fullName email department designation"
            )
            .populate(
                "approvedBy",
                "username email"
            );

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found",
            });
        }

        return res.status(200).json({
            success: true,
            leave,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const updateLeave = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Leave Id",
            });
        }

        const {
            leaveType,
            startDate,
            endDate,
            totalDays,
            reason,
            remarks,
        } = req.body;

        const leave = await leaveModel.findById(id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found",
            });
        }

        leave.leaveType = leaveType ?? leave.leaveType;
        leave.startDate = startDate ?? leave.startDate;
        leave.endDate = endDate ?? leave.endDate;
        leave.totalDays = totalDays ?? leave.totalDays;
        leave.reason = reason ?? leave.reason;
        leave.remarks = remarks ?? leave.remarks;

        await leave.save();

        return res.status(200).json({
            success: true,
            message: "Leave updated successfully",
            leave,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const deleteLeave = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Leave Id",
            });
        }

        const leave = await leaveModel.findById(id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found",
            });
        }

        await leave.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Leave deleted successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const approveLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { remarks } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Leave Id",
            });
        }

        const leave = await leaveModel.findById(id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found",
            });
        }

        if (leave.status === "Approved") {
            return res.status(400).json({
                success: false,
                message: "Leave is already approved",
            });
        }

        leave.status = "Approved";
        leave.approvedBy = req.user._id;
        leave.remarks = remarks ?? leave.remarks;

        await leave.save();

        return res.status(200).json({
            success: true,
            message: "Leave approved successfully",
            leave,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const rejectLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { remarks } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Leave Id",
            });
        }

        const leave = await leaveModel.findById(id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found",
            });
        }

        if (leave.status === "Rejected") {
            return res.status(400).json({
                success: false,
                message: "Leave is already rejected",
            });
        }

        leave.status = "Rejected";
        leave.approvedBy = req.user._id;
        leave.remarks = remarks ?? leave.remarks;

        await leave.save();

        return res.status(200).json({
            success: true,
            message: "Leave rejected successfully",
            leave,
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
    applyLeave,
    getAllLeaves,
    getLeaveById,
    updateLeave,
    deleteLeave,
    approveLeave,
    rejectLeave,
};