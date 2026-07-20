const attendanceModel = require("../model/attendance.model");
const employeeModel = require("../model/employee.model");

const checkIn = async (req, res) => {
    try {
        const { employee, date, remarks } = req.body;

        // Check Employee Exists
        const employeeExists = await employeeModel.findById(employee);

        if (!employeeExists) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        // Attendance Date
        const attendanceDate = date ? new Date(date) : new Date();

        // Start & End Of Day
        const startOfDay = new Date(attendanceDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(attendanceDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Duplicate Attendance Check
        const attendanceExists = await attendanceModel.findOne({
            employee,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        if (attendanceExists) {
            return res.status(409).json({
                success: false,
                message: "Attendance already marked for today",
            });
        }

        // Create Attendance
        const attendance = await attendanceModel.create({
            employee,
            date: attendanceDate,
            checkIn: new Date(),
            remarks,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Check-In successful",
            attendance,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const checkOut = async (req, res) => {
    try {
        const { id } = req.params;
        const { remarks } = req.body;

        const attendance = await attendanceModel.findById(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found",
            });
        }

        // Already Checked Out
        if (attendance.checkOut) {
            return res.status(400).json({
                success: false,
                message: "Employee already checked out",
            });
        }

        // Save Check-Out Time
        attendance.checkOut = new Date();

        // Calculate Working Hours
        const workingMilliseconds =
            attendance.checkOut - attendance.checkIn;

        attendance.workingHours =
            Number((workingMilliseconds / (1000 * 60 * 60)).toFixed(2));

        if (remarks) {
            attendance.remarks = remarks;
        }

        await attendance.save();

        return res.status(200).json({
            success: true,
            message: "Check-Out successful",
            attendance,
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
    checkIn,
    checkOut,
};