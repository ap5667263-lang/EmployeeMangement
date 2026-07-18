const Joi = require("joi");

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("user", "manager", "admin").optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
    username: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email({ tlds: { allow: false } }).optional(),
    profileImage: Joi.string().optional(),
});

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
