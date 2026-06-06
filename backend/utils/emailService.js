const nodemailer = require('nodemailer');

const emailEnabled = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (mailOptions) => {
  if (!emailEnabled) {
    console.warn('Email skipped: EMAIL_USER and EMAIL_PASSWORD must be set in .env');
    return { skipped: true };
  }

  return transporter.sendMail({
    from: `"NandiAgro" <${process.env.EMAIL_USER}>`,
    ...mailOptions,
  });
};

const sendCancellationEmail = async (email, orderData) => {
  try {
    await sendMail({
      to: email,
      subject: `Order Cancellation Confirmed - Order #${orderData.orderId}`,
      html: `
        <h2>Order Cancellation Confirmed</h2>
        <p>Your order has been successfully cancelled.</p>
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Refund Amount:</strong> Rs.${orderData.refundAmount}</p>
        <h3>Items Returned to Stock:</h3>
        <ul>
          ${orderData.items
            .map((item) => `<li>${item.name} (Qty: ${item.quantity}) - Rs.${item.price * item.quantity}</li>`)
            .join('')}
        </ul>
        <p><strong>Refund Status:</strong> Your refund of Rs.${orderData.refundAmount} has been initiated and will be processed within 5-7 business days.</p>
        <p>If you have any questions, please contact our support team.</p>
        <p>Thank you for choosing NandiAgro!</p>
      `,
    });
    console.log(`Cancellation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
};

const sendLowStockEmail = async (productData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('Low stock email skipped: ADMIN_EMAIL is not set in .env');
      return;
    }

    await sendMail({
      to: adminEmail,
      subject: `Low Stock Alert - ${productData.name}`,
      html: `
        <h2>Low Stock Alert</h2>
        <p>The following product has low stock levels:</p>
        <h3>Product Details:</h3>
        <p><strong>Product Name:</strong> ${productData.name}</p>
        <p><strong>Product ID:</strong> ${productData.id}</p>
        <p><strong>Brand:</strong> ${productData.brand}</p>
        <p><strong>Current Stock:</strong> ${productData.quantity} units</p>
        <p><strong>Alert Threshold:</strong> 5 units</p>
        <p><strong>Action Required:</strong> Please consider restocking this product.</p>
      `,
    });
    console.log(`Low stock email sent for product: ${productData.name}`);
  } catch (error) {
    console.error('Error sending low stock email:', error);
  }
};

const sendQueryConfirmationEmail = async (email, name, queryMessage) => {
  try {
    await sendMail({
      to: email,
      subject: 'We Received Your Query - NandiAgro Support',
      html: `
        <h2>Thank You for Contacting Us</h2>
        <p>Hi ${name},</p>
        <p>We have received your query and our support team will get back to you within 24 hours.</p>
        <h3>Your Query:</h3>
        <p>${queryMessage}</p>
        <p>We appreciate your interest in NandiAgro!</p>
        <p>Best regards,<br/>NandiAgro Support Team</p>
      `,
    });
    console.log(`Query confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending query confirmation email:', error);
  }
};

const sendAdminQueryNotificationEmail = async (queryData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('Admin query notification skipped: ADMIN_EMAIL is not set in .env');
      return;
    }

    await sendMail({
      to: adminEmail,
      subject: `New Customer Query - ${queryData.name}`,
      html: `
        <h2>New Customer Query</h2>
        <p><strong>Name:</strong> ${queryData.name}</p>
        <p><strong>Email:</strong> ${queryData.email}</p>
        <h3>Query:</h3>
        <p>${queryData.query}</p>
      `,
    });
    console.log(`Admin query notification email sent to ${adminEmail}`);
  } catch (error) {
    console.error('Error sending admin query notification email:', error);
  }
};

const sendQueryReplyEmail = async (email, queryData) => {
  try {
    await sendMail({
      to: email,
      subject: 'Reply to Your NandiAgro Query',
      html: `
        <h2>We Replied to Your Query</h2>
        <p>Hi ${queryData.name},</p>
        <h3>Your Query:</h3>
        <p>${queryData.query}</p>
        <h3>Our Reply:</h3>
        <p>${queryData.reply}</p>
        <p>Thank you for contacting NandiAgro.</p>
      `,
    });
    console.log(`Query reply email sent to ${email}`);
  } catch (error) {
    console.error('Error sending query reply email:', error);
  }
};

const sendOTPCodeEmail = async (email, name, otp) => {
  try {
    await sendMail({
      to: email,
      subject: 'Your Password Reset OTP - NandiAgro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #14532d;">Password Reset Request</h2>
          <p>Hi ${name || 'User'},</p>
          <p>You recently requested to reset your password for your NandiAgro account.</p>
          <p>Use the following OTP code to reset your password:</p>
          <div style="background-color: #f0fdf4; border: 2px solid #14532d; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #14532d; font-size: 32px; letter-spacing: 4px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
          <p>Best regards,<br/>NandiAgro Support Team</p>
        </div>
      `,
    });
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

module.exports = {
  sendCancellationEmail,
  sendLowStockEmail,
  sendQueryConfirmationEmail,
  sendAdminQueryNotificationEmail,
  sendQueryReplyEmail,
  sendOTPCodeEmail,
};
