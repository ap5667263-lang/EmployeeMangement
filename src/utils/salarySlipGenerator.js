const PDFDocument = require("pdfkit");

const generateSalarySlipPdf = (salarySlip) => {
    return new Promise((resolve, reject) => {

        const doc = new PDFDocument({
            margin: 40,
            size: "A4",
        });

        const buffers = [];

        doc.on("data", (chunk) => buffers.push(chunk));

        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });

        doc.on("error", reject);

        doc.fontSize(22).text("Salary Slip", {
            align: "center",
        });

        doc.moveDown();

        doc.fontSize(14);

        doc.text(`Employee ID : ${salarySlip.employee.employeeId}`);
        doc.text(`Name : ${salarySlip.employee.fullName}`);
        doc.text(`Department : ${salarySlip.employee.department}`);
        doc.text(`Designation : ${salarySlip.employee.designation}`);

        doc.moveDown();

        doc.text(`Month : ${salarySlip.month}`);
        doc.text(`Year : ${salarySlip.year}`);

        doc.moveDown();

        doc.text(`Basic Salary : ₹${salarySlip.payroll.basicSalary}`);
        doc.text(`Bonus : ₹${salarySlip.payroll.bonus}`);
        doc.text(`Deduction : ₹${salarySlip.payroll.deduction}`);
        doc.text(`Net Salary : ₹${salarySlip.payroll.netSalary}`);

        doc.moveDown();

        doc.text("This is a system generated salary slip.",{
            align:"center"
        });

        doc.end();

    });
};

module.exports = generateSalarySlipPdf;