const { Router } = require("express");
const employeeController = require("../controllers/employee.controller");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const upload = require("../middleware/upload.middleware");
const { createEmployeeSchema, updateEmployeeSchema } = require("../utils/employee.validator");

const employeeRouter = Router();

employeeRouter.post(
    "/createEmpoyee",
    protect,
    authorizeRoles("admin"),
    upload.single("profileImage"),
    validate(createEmployeeSchema),
    employeeController.createEmployee
);
employeeRouter.get(
    "/get",
    protect,
    authorizeRoles("admin"),
    employeeController.getAllEmployees
);
employeeRouter.get(
    "/:id",
    protect,
    authorizeRoles("admin"),
    employeeController.getEmployeeById
);
employeeRouter.put(
    "/:id",
    protect,
    authorizeRoles("admin"),
    upload.single("profileImage"),
    validate(updateEmployeeSchema),
    employeeController.updateEmployee
);
employeeRouter.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    employeeController.deleteEmployee
);
module.exports = employeeRouter;