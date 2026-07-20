const { Router } = require("express");
const attendanceController = require("../controllers/attendance.controller");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const {
    checkInSchema,
    checkOutSchema,
} = require("../utils/attendance.validator");

const attendanceRouter = Router();

attendanceRouter.post(
    "/check-in",
    protect,
    authorizeRoles("admin"),
    validate(checkInSchema),
    attendanceController.checkIn
);

attendanceRouter.put(
    "/check-out/:id",
    protect,
    authorizeRoles("admin"),
    validate(checkOutSchema),
    attendanceController.checkOut
);

module.exports = attendanceRouter;