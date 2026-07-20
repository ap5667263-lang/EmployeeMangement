const { Router } = require("express");
const payrollController = require("../controllers/payroll.controller");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
    generatePayrollSchema,
    updatePayrollSchema,
} = require("../utils/payroll.validator");

const payrollRouter = Router();

// Generate Payroll
payrollRouter.post(
    "/generate",
    protect,
    authorizeRoles("admin"),
    validate(generatePayrollSchema),
    payrollController.generatePayroll
);

// Get All Payrolls
payrollRouter.get(
    "/",
    protect,
    authorizeRoles("admin"),
    payrollController.getAllPayrolls
);

// Monthly Payroll Report
payrollRouter.get(
    "/month/report",
    protect,
    authorizeRoles("admin"),
    payrollController.monthlyPayrollReport
);

// Get Employee Payroll History
payrollRouter.get(
    "/:employeeId",
    protect,
    authorizeRoles("admin"),
    payrollController.getPayrollByEmployee
);

// Update Payroll
payrollRouter.put(
    "/:id",
    protect,
    authorizeRoles("admin"),
    validate(updatePayrollSchema),
    payrollController.updatePayroll
);

// Delete Payroll
payrollRouter.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    payrollController.deletePayroll
);

module.exports = payrollRouter;