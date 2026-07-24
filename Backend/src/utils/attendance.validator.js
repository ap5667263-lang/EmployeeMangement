const Joi = require("joi");

const checkInSchema = Joi.object({
    employee: Joi.string()
        .hex()
        .length(24)
        .required(),

    date: Joi.date().optional(),

    remarks: Joi.string()
        .trim()
        .allow("")
        .optional(),
});

const checkOutSchema = Joi.object({
    remarks: Joi.string()
        .trim()
        .allow("")
        .optional(),
});
const updateAttendanceSchema = Joi.object({
    checkIn: Joi.date().optional(),

    checkOut: Joi.date().optional(),

    status: Joi.string()
        .valid("Present", "Absent", "Half-Day", "Leave")
        .optional(),

    remarks: Joi.string()
        .allow("")
        .optional(),
});
module.exports = {
    checkInSchema,
    checkOutSchema,
    updateAttendanceSchema
};