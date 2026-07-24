const Joi = require("joi");

const generatePayrollSchema = Joi.object({
    employee: Joi.string().required(),

    basicSalary: Joi.number()
        .min(0)
        .required(),

    workingDays: Joi.number()
        .integer()
        .min(0)
        .required(),

    presentDays: Joi.number()
        .integer()
        .min(0)
        .required(),

    leaveDays: Joi.number()
        .integer()
        .min(0)
        .default(0),

    overtimeHours: Joi.number()
        .min(0)
        .default(0),

    bonus: Joi.number()
        .min(0)
        .default(0),

    deduction: Joi.number()
        .min(0)
        .default(0),

    month: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .required(),

    year: Joi.number()
        .integer()
        .min(2000)
        .required(),
});

const updatePayrollSchema = Joi.object({
    basicSalary: Joi.number()
        .min(0)
        .optional(),

    workingDays: Joi.number()
        .integer()
        .min(0)
        .optional(),

    presentDays: Joi.number()
        .integer()
        .min(0)
        .optional(),

    leaveDays: Joi.number()
        .integer()
        .min(0)
        .optional(),

    overtimeHours: Joi.number()
        .min(0)
        .optional(),

    bonus: Joi.number()
        .min(0)
        .optional(),

    deduction: Joi.number()
        .min(0)
        .optional(),

    month: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .optional(),

    year: Joi.number()
        .integer()
        .min(2000)
        .optional(),

    status: Joi.string()
        .valid("Pending", "Paid", "Cancelled")
        .optional(),
});

module.exports = {
    generatePayrollSchema,
    updatePayrollSchema,
};