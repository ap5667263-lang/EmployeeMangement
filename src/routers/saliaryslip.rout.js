const { Router } = require("express");
const salarySlipController = require("../controllers/saliaryslip.controller");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const { sendSalarySlipSchema } = require("../utils/saliaryslip.validator");

const salarySlipRouter = Router();

// Generate Salary Slip
salarySlipRouter.post(
    "/generate",
    protect,
    authorizeRoles("admin"),
    salarySlipController.generateSalarySlip
);

// Monthly Salary Slip Report
salarySlipRouter.get(
    "/month/report",
    protect,
    authorizeRoles("admin"),
    salarySlipController.monthlySalarySlip
);

// Download Salary Slip PDF
salarySlipRouter.get(
    "/download/:id",
    protect,
    authorizeRoles("admin"),
    salarySlipController.downloadSalarySlip
);

// Send Salary Slip Email
salarySlipRouter.post(
    "/send-email",
    protect,
    authorizeRoles("admin"),
    validate(sendSalarySlipSchema),
    salarySlipController.sendEmail
);

// Get Employee Salary Slips
salarySlipRouter.get(
    "/:employeeId",
    protect,
    authorizeRoles("admin"),
    salarySlipController.getSalarySlip
);

module.exports = salarySlipRouter;
