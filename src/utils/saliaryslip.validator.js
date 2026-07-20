const Joi = require("joi");

const sendSalarySlipSchema = Joi.object({
    payroll: Joi.string().required(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
});

const monthlySalarySlipSchema = Joi.object({
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

module.exports = {
    sendSalarySlipSchema,
    monthlySalarySlipSchema,
};