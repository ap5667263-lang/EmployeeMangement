const Joi = require("joi");


// Create Performance Validator

const createPerformanceSchema = Joi.object({

    employee: Joi.string()
        .required()
        .messages({
            "any.required":"Employee Id is required"
        }),


    reviewPeriod: Joi.string()
        .required()
        .messages({
            "any.required":"Review period is required"
        }),


    rating: Joi.number()
        .min(1)
        .max(5)
        .required()
        .messages({
            "number.min":"Rating must be between 1 to 5",
            "number.max":"Rating must be between 1 to 5",
            "any.required":"Rating is required"
        }),


    goals: Joi.string()
        .required()
        .messages({
            "any.required":"Goals are required"
        }),


    achievements: Joi.string()
        .allow("")
        .optional(),


    feedback: Joi.string()
        .allow("")
        .optional()

});


module.exports = {
    createPerformanceSchema
};