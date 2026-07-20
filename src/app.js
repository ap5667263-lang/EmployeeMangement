const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const securityMiddleware = require("./middleware/security.middleware");
const authRouter = require("./routers/auth.rout");
const employeeRouter = require("./routers/empolyee.rout");
const attendanceRouter = require("./routers/attendance.rout");
const path = require("path");

const app = express();

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Employee Management API",
            version: "1.0.0",
            description: "Authentication and employee management API documentation",
        },
    },
    apis: ["./src/routers/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
}));
app.use(securityMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Multer error handler
app.use((err, req, res, next) => {
    if (err.name === "MulterError") {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

module.exports = app;