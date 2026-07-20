const { Router } = require("express");
const leaveController = require("../controllers/leave.controller");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
    applyLeaveSchema,
    updateLeaveSchema,
} = require("../utils/leave.validator");

const leaveRouter = Router();

// Employee Apply Leave
leaveRouter.post(
    "/apply",
    protect,
    validate(applyLeaveSchema),
    leaveController.applyLeave
);

// Admin - Get All Leaves
leaveRouter.get(
    "/",
    protect,
    authorizeRoles("admin"),
    leaveController.getAllLeaves
);

// Admin - Get Single Leave
leaveRouter.get(
    "/:id",
    protect,
    authorizeRoles("admin"),
    leaveController.getLeaveById
);

// Admin - Update Leave
leaveRouter.put(
    "/:id",
    protect,
    authorizeRoles("admin"),
    validate(updateLeaveSchema),
    leaveController.updateLeave
);

// Admin - Delete Leave
leaveRouter.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    leaveController.deleteLeave
);

// Admin - Approve Leave
leaveRouter.put(
    "/approve/:id",
    protect,
    authorizeRoles("admin"),
    leaveController.approveLeave
);

// Admin - Reject Leave
leaveRouter.put(
    "/reject/:id",
    protect,
    authorizeRoles("admin"),
    leaveController.rejectLeave
);

module.exports = leaveRouter;