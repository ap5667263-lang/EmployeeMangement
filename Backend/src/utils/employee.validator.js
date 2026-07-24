const Joi = require("joi");

const createEmployeeSchema = Joi.object({
    employeeId: Joi.string().trim().uppercase().required(),

    fullName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),

    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required(),

    department: Joi.string()
        .trim()
        .required(),

    designation: Joi.string()
        .trim()
        .required(),

    salary: Joi.number()
        .min(0)
        .required(),

    joiningDate: Joi.date()
        .required(),

    employmentType: Joi.string()
        .valid("Full-Time", "Part-Time", "Contract", "Intern"),

    status: Joi.string()
        .valid("Active", "Inactive"),

    address: Joi.string()
        .trim()
        .allow(""),

    profileImage: Joi.string().optional(),
});

const updateEmployeeSchema = Joi.object({
    employeeId: Joi.string().trim().uppercase().optional(),

    fullName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .optional(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .optional(),

    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .optional(),

    department: Joi.string()
        .trim()
        .optional(),

    designation: Joi.string()
        .trim()
        .optional(),

    salary: Joi.number()
        .min(0)
        .optional(),

    joiningDate: Joi.date()
        .optional(),

    employmentType: Joi.string()
        .valid("Full-Time", "Part-Time", "Contract", "Intern")
        .optional(),

    status: Joi.string()
        .valid("Active", "Inactive")
        .optional(),

    address: Joi.string()
        .trim()
        .allow("")
        .optional(),

    profileImage: Joi.string().optional(),
});

module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema,
};