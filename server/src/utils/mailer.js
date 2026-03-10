import nodemailer from "nodemailer";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "mkalyan8400@gmail.com",
    pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD,
  },
});

/**
 * Send email verification link
 */
export const sendVerificationEmail = async (to, userName, verificationToken) => {
  try {
    const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "mkalyan8400@gmail.com",
      to: to,
      subject: "Verify Your Email - EcoMap",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10B981; margin-bottom: 20px;">Welcome to EcoMap, ${userName}!</h2>
            
            <p>Thank you for registering with EcoMap. To complete your registration and start reporting environmental issues, please verify your email address.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #10B981; word-break: break-all; font-size: 14px;">
              ${verificationUrl}
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This verification link will expire in 24 hours. If you didn't create an account with EcoMap, please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.response);
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email for new report submission
 */
export const sendReportConfirmationEmail = async (to, reportData) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER || "mkalyan8400@gmail.com",
      to: to,
      subject: `Report Submitted Successfully - ${reportData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10B981; margin-bottom: 20px;">Report Submitted Successfully!</h2>
            
            <p>Thank you for reporting this environmental issue. Your report has been received and will be reviewed by our team.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Report Details:</h3>
              <p><strong>Title:</strong> ${reportData.title}</p>
              <p><strong>Description:</strong> ${reportData.description}</p>
              <p><strong>Location:</strong> ${reportData.location}</p>
              <p><strong>Department:</strong> ${
                reportData.department || "Pending"
              }</p>
              <p><strong>Severity:</strong> ${
                reportData.severityLevel || "Not yet classified"
              }</p>
              <p><strong>Status:</strong> ${reportData.status}</p>
              <p><strong>Report ID:</strong> ${reportData._id}</p>
              <p><strong>Date:</strong> ${new Date(
                reportData.createdAt
              ).toLocaleDateString()}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              You will receive updates about your report as it progresses through our system. If you have any questions, please contact us.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email for status update
 */
export const sendStatusUpdateEmail = async (to, reportData, newStatus) => {
  try {
    const statusMessages = {
      pending: "Your report is pending review",
      in_progress: "We are currently working on your report",
      resolved: "Your report has been resolved",
      rejected: "Your report has been reviewed",
    };

    const statusColors = {
      pending: "#F59E0B",
      in_progress: "#3B82F6",
      resolved: "#10B981",
      rejected: "#EF4444",
    };

    const mailOptions = {
      from: process.env.GMAIL_USER || "mkalyan8400@gmail.com",
      to: to,
      subject: `Report Status Update - ${reportData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10B981; margin-bottom: 20px;">Report Status Update</h2>
            
            <div style="background-color: ${
              statusColors[newStatus]
            }; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="margin: 0; font-size: 18px;">${
                statusMessages[newStatus]
              }</h3>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Report Information:</h3>
              <p><strong>Title:</strong> ${reportData.title}</p>
              <p><strong>Report ID:</strong> ${reportData._id}</p>
              <p><strong>Current Status:</strong> <span style="color: ${
                statusColors[newStatus]
              }; font-weight: bold;">${newStatus
        .replace(/_/g, " ")
        .toUpperCase()}</span></p>
              <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Thank you for your patience. We will continue to work on resolving this issue and keep you updated.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Status update email sent:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending status update email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send admin notification for new report
 */
export const sendAdminNotificationEmail = async (reportData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "mkalyan8400@gmail.com";

    const mailOptions = {
      from: process.env.GMAIL_USER || "mkalyan8400@gmail.com",
      to: adminEmail,
      subject: `New Report Submitted - ${reportData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #EF4444; margin-bottom: 20px;">⚠️ New Report Submitted</h2>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>A new environmental issue has been reported and requires attention.</strong></p>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Report Details:</h3>
              <p><strong>Title:</strong> ${reportData.title}</p>
              <p><strong>Description:</strong> ${reportData.description}</p>
              <p><strong>Location:</strong> ${reportData.location}</p>
              <p><strong>Severity Score:</strong> ${
                reportData.severityScore
                  ? (reportData.severityScore * 100).toFixed(0) + "%"
                  : "N/A"
              }</p>
              <p><strong>Severity Level:</strong> ${
                reportData.severityLevel || "Pending AI Classification"
              }</p>
              <p><strong>Department:</strong> ${
                reportData.department || "Pending Classification"
              }</p>
              <p><strong>SLA Deadline:</strong> ${
                reportData.slaDeadline
                  ? new Date(reportData.slaDeadline).toLocaleString()
                  : "N/A"
              }</p>
              <p><strong>Report ID:</strong> ${reportData._id}</p>
              <p><strong>Submitted by:</strong> ${
                reportData.user?.name || "Unknown"
              } (${reportData.user?.email || "N/A"})</p>
              <p><strong>Submitted at:</strong> ${new Date(
                reportData.createdAt
              ).toLocaleString()}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Please log in to the admin panel to review and assign this report to the appropriate department.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px;">
                This is an automated notification. Please do not reply to this message.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent:", info.response);
    return { success: true, message: "Admin notified" };
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Test email function
 */
export const sendTestEmail = async (testEmail) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER || "mkalyan8400@gmail.com",
      to: testEmail,
      subject: "Test Email - Citizen Grievance System",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10B981;">Email System is Working!</h2>
            <p>This is a test email from the Citizen Grievance Management System.</p>
            <p style="color: #666; font-size: 14px;">If you received this email, the nodemailer configuration is working correctly.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Test email sent:", info.response);
    return { success: true, message: "Test email sent successfully" };
  } catch (error) {
    console.error("Error sending test email:", error);
    return { success: false, error: error.message };
  }
};

export default transporter;
