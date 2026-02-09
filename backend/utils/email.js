const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password or app password
    }
});

const sendEmail = async (options) => {
    const mailOptions = {
        from: `"AI Resume Builder" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${options.email}`);
    } catch (error) {
        console.error('Email sending error:', error);
        // Don't throw error to prevent auth flow interruption, but log it
    }
};

module.exports = sendEmail;
