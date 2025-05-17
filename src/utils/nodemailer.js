const nodemailer = require("nodemailer");

console.log("NODEMAILER_EMAIL", );
console.log("NODEMAILER_APP_PASSWORD", );

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD
    }
});

module.exports = transporter;