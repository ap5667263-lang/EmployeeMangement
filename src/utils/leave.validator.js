const Joi = require("joi");

const applyLeaveSchema = Joi.object({
    employee: Joi.string().required(),

    leaveType: Joi.string()
        .valid(
            "Casual",
            "Sick",
            "Annual",
            "Maternity",
            "Paternity",
            "Unpaid"
        )
        .required(),

    startDate: Joi.date().required(),

    endDate: Joi.date()
        .min(Joi.ref("startDate"))
        .required(),

    totalDays: Joi.number()
        .integer()
        .min(1)
        .required(),

    reason: Joi.string()
        .max(500)
        .required(),
});

const updateLeaveSchema = Joi.object({
    leaveType: Joi.string()
        .valid(
            "Casual",
            "Sick",
            "Annual",
            "Maternity",
            "Paternity",
            "Unpaid"
        )
        .optional(),

    startDate: Joi.date().optional(),

    endDate: Joi.date()
        .min(Joi.ref("startDate"))
        .optional(),

    totalDays: Joi.number()
        .integer()
        .min(1)
        .optional(),

    reason: Joi.string()
        .max(500)
        .optional(),

    remarks: Joi.string()
        .max(500)
        .optional(),
});

module.exports = {
    applyLeaveSchema,
    updateLeaveSchema,
};