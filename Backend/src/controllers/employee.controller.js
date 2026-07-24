const mongoose = require("mongoose");
const employeeModel = require("../model/employee.model");
const uploadImage = require("../utils/uploadImage");

const createEmployee = async (req, res) => {
    try {
        const {
            employeeId,
            fullName,
            email,
            phone,
            department,
            designation,
            salary,
            joiningDate,
            employmentType,
            status,
            address,
        } = req.body;

        // Check Employee ID
        const employeeExists = await employeeModel.findOne({ employeeId });

        if (employeeExists) {
            return res.status(409).json({
                success: false,
                message: "Employee ID already exists",
            });
        }

        // Check Email
        const emailExists = await employeeModel.findOne({ email });

        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Upload Profile Image
        let profileImage = process.env.DEFAULT_PROFILE_IMAGE;

        if (req.file) {
            const uploadedImage = await uploadImage(req.file);
            profileImage = uploadedImage.url;
        }

        // Create Employee
        const employee = await employeeModel.create({
            employeeId,
            fullName,
            email,
            phone,
            department,
            designation,
            salary,
            joiningDate,
            employmentType,
            status,
            address,
            profileImage,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employee,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeModel
            .find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: employees.length,
            employees,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await employeeModel.findById(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        return res.status(200).json({
            success: true,
            employee,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Employee Id",
            });
        }

        const employee = await employeeModel.findById(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        const {
            employeeId,
            fullName,
            email,
            phone,
            department,
            designation,
            salary,
            joiningDate,
            employmentType,
            status,
            address,
        } = req.body;

        // Duplicate Employee ID
        if (employeeId && employeeId !== employee.employeeId) {
            const employeeExists = await employeeModel.findOne({
                employeeId,
            });

            if (employeeExists) {
                return res.status(409).json({
                    success: false,
                    message: "Employee ID already exists",
                });
            }
        }

        // Duplicate Email
        if (email && email !== employee.email) {
            const emailExists = await employeeModel.findOne({
                email,
            });

            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists",
                });
            }
        }

        // Upload New Image
        if (req.file) {
            const uploadedImage = await uploadImage(req.file);
            employee.profileImage = uploadedImage.url;
        }

        employee.employeeId = employeeId ?? employee.employeeId;
        employee.fullName = fullName ?? employee.fullName;
        employee.email = email ?? employee.email;
        employee.phone = phone ?? employee.phone;
        employee.department = department ?? employee.department;
        employee.designation = designation ?? employee.designation;
        employee.salary = salary ?? employee.salary;
        employee.joiningDate = joiningDate ?? employee.joiningDate;
        employee.employmentType = employmentType ?? employee.employmentType;
        employee.status = status ?? employee.status;
        employee.address = address ?? employee.address;
        await employee.save();

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            employee,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Employee Id",
            });
        }

        const employee = await employeeModel.findById(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        await employee.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
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
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};