const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"EduBudget" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Reset Your Password - EduBudget',
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-weight: bold; font-size: 24px;">E</span>
            </div>
            <h1 style="color: #333; margin: 0; font-size: 28px;">Password Reset</h1>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
            Hello <strong>${user.name}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            You requested to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              Reset Password
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              EduBudget · Smart Finance Tracking for Students
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

const sendPasswordResetConfirmation = async (user) => {
  const mailOptions = {
    from: `"EduBudget" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Reset Successful - EduBudget',
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 4px solid #10B981;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-weight: bold; font-size: 28px;">✓</span>
            </div>
            <h1 style="color: #333; margin: 0; font-size: 28px;">Password Reset Successful</h1>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
            Hello <strong>${user.name}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          
          <div style="background: #F0F9FF; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #0369A1; font-size: 14px; margin: 0;">
              💡 <strong>Tip:</strong> Use a password manager to keep your passwords secure and unique.
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              If you did not make this change, please contact our support team immediately.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Confirmation email error:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
};