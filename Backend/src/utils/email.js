const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.Email_PASSWORD,
    },
});

const sendVerificationEmail = async (email, token) => {
    const verifyUrl = `http://localhost:4000/api/auth/verify-email/${token}`;

    await transporter.sendMail({
        from: `"Employee Management" <${process.env.EMAIL}>`,
        to: email,
        subject: "Verify Your Email",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2563eb;">Welcome to Employee Management!</h2>
                <p>Thank you for registering. Please verify your email by clicking the button below:</p>
                <a href="${verifyUrl}" 
                   style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    Verify Email
                </a>
                <p style="color: #6b7280; font-size: 13px;">This link expires in 24 hours.</p>
                <p style="color: #6b7280; font-size: 13px;">If you did not register, please ignore this email.</p>
            </div>
        `,
    });
};

const sendLoginOtpEmail = async (email, otp) => {
    await transporter.sendMail({
        from: `"Employee Management" <${process.env.EMAIL}>`,
        to: email,
        subject: "Your Login OTP",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2563eb;">Login OTP</h2>
                <p>Use the OTP below to complete your login:</p>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111827; text-align: center; padding: 20px; background: #f3f4f6; border-radius: 8px; margin: 16px 0;">
                    ${otp}
                </div>
                <p style="color: #6b7280; font-size: 13px;">This OTP expires in 10 minutes.</p>
                <p style="color: #6b7280; font-size: 13px;">If you did not request this, please ignore this email.</p>
            </div>
        `,
    });
};
const sendForgotPasswordOtpEmail = async (email, otp) => {
    await transporter.sendMail({
        from: `"Employee Management" <${process.env.EMAIL}>`,
        to: email,
        subject: "Password Reset OTP",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2563eb;">Password Reset OTP</h2>
                <p>You requested a password reset. Use the OTP below:</p>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111827; text-align: center; padding: 20px; background: #f3f4f6; border-radius: 8px; margin: 16px 0;">
                    ${otp}
                </div>
                <p style="color: #6b7280; font-size: 13px;">This OTP expires in 10 minutes.</p>
                <p style="color: #6b7280; font-size: 13px;">If you did not request this, please ignore this email.</p>
            </div>
        `,
    });
};

const sendSalarySlipEmail = async (email, pdfBuffer) => {
    await transporter.sendMail({
        from: `"Employee Management" <${process.env.EMAIL}>`,
        to: email,
        subject: "Salary Slip",
        html: `
            <h2>Salary Slip</h2>
            <p>Your salary slip is attached with this email.</p>
        `,
        attachments: [
            {
                filename: "SalarySlip.pdf",
                content: pdfBuffer,
            },
        ],
    });
};

module.exports = {
    sendVerificationEmail,
    sendLoginOtpEmail,
    sendForgotPasswordOtpEmail,
    sendSalarySlipEmail,
};


