const { Router } = require("express");
const leaveController = require("../controllers/leave.controller");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const { applyLeaveSchema, updateLeaveSchema } = require("../utils/leave.validator");

const leaveRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Leave management APIs
 */

/**
 * @swagger
 * /api/leave/apply:
 *   post:
 *     summary: Apply for leave
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employee, leaveType, startDate, endDate, totalDays, reason]
 *             properties:
 *               employee:
 *                 type: string
 *                 description: Employee MongoDB ID
 *               leaveType:
 *                 type: string
 *                 enum: [Casual, Sick, Annual, Maternity, Paternity, Unpaid]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               totalDays:
 *                 type: integer
 *                 example: 2
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave applied successfully
 *       400:
 *         description: Duplicate leave request
 */
leaveRouter.post("/apply", protect, validate(applyLeaveSchema), leaveController.applyLeave);

/**
 * @swagger
 * /api/leave/:
 *   get:
 *     summary: Get all leave requests (Admin)
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all leaves
 */
leaveRouter.get("/", protect, authorizeRoles("admin"), leaveController.getAllLeaves);

/**
 * @swagger
 * /api/leave/approve/{id}:
 *   put:
 *     summary: Approve leave request (Admin)
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave approved
 *       400:
 *         description: Already approved
 */
leaveRouter.put("/approve/:id", protect, authorizeRoles("admin"), leaveController.approveLeave);

/**
 * @swagger
 * /api/leave/reject/{id}:
 *   put:
 *     summary: Reject leave request (Admin)
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave rejected
 */
leaveRouter.put("/reject/:id", protect, authorizeRoles("admin"), leaveController.rejectLeave);

/**
 * @swagger
 * /api/leave/{id}:
 *   get:
 *     summary: Get leave by ID
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave details
 *       404:
 *         description: Leave not found
 */
leaveRouter.get("/:id", protect, authorizeRoles("admin"), leaveController.getLeaveById);

/**
 * @swagger
 * /api/leave/{id}:
 *   put:
 *     summary: Update leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave updated
 */
leaveRouter.put("/:id", protect, authorizeRoles("admin"), validate(updateLeaveSchema), leaveController.updateLeave);

/**
 * @swagger
 * /api/leave/{id}:
 *   delete:
 *     summary: Delete leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave deleted
 */
leaveRouter.delete("/:id", protect, authorizeRoles("admin"), leaveController.deleteLeave);

module.exports = leaveRouter;
