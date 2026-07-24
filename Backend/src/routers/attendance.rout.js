const { Router } = require("express");
const attendanceController = require("../controllers/attendance.controller");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const { checkInSchema, checkOutSchema, updateAttendanceSchema } = require("../utils/attendance.validator");

const attendanceRouter = Router();

attendanceRouter.post("/check-in", protect, authorizeRoles("admin"), validate(checkInSchema), attendanceController.checkIn);
attendanceRouter.put("/check-out/:id", protect, authorizeRoles("admin"), validate(checkOutSchema), attendanceController.checkOut);
attendanceRouter.get("/get", protect, authorizeRoles("admin"), attendanceController.getAllAttendance);
attendanceRouter.get("/monthly-report", protect, authorizeRoles("admin"), attendanceController.getMonthlyReport);
attendanceRouter.get("/:employeeId", protect, authorizeRoles("admin"), attendanceController.getAttendanceByEmployee);
attendanceRouter.put("/:id", protect, authorizeRoles("admin"), validate(updateAttendanceSchema), attendanceController.updateAttendance);
attendanceRouter.delete("/:id", protect, authorizeRoles("admin"), attendanceController.deleteAttendance);

module.exports = attendanceRouter;
