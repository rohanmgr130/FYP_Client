const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('./logger');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

/**
 * Email Service
 * Handles sending various types of emails for the application
 */

// Create nodemailer transporter using configuration
const emailServiceConfig = {
    service: 'gmail', // You can replace 'gmail' with other services like 'outlook', 'yahoo', etc.
    auth: {
      user: 'rohanmgr130@gmail.com', // Replace with your email address
      pass: 'dlio lfgs zzyp ahmz' // Replace with your email password (or use OAuth2)
    }
  };

// Verify transporter connection at startup
transporter.verify()
    .then(() => {
        logger.info('Email service is ready to send messages');
    })
    .catch(error => {
        logger.error(`Email configuration error: ${error.message}`);
    });

/**
 * Load email template and compile with handlebars
 * @param {String} templateName - Name of the template file (without extension)
 * @param {Object} data - Data to compile with the template
 * @returns {String} Compiled HTML content
 */
const loadTemplate = (templateName, data) => {
    try {
        const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(templateSource);
        return template(data);
    } catch (error) {
        logger.error(`Error loading email template "${templateName}": ${error.message}`);
        // Fallback to a simple template
        return simpleTemplate(data);
    }
};

/**
 * Simple fallback template when HTML templates are unavailable
 * @param {Object} data - Data to include in the template
 * @returns {String} Simple HTML content
 */
const simpleTemplate = (data) => {
    const { title, content, actionText, actionUrl } = data;

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">${title}</h1>
      <p>${content}</p>
      ${actionText && actionUrl ?
        `<p><a href="${actionUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">${actionText}</a></p>`
        : ''}
    </div>
  `;
};

/**
 * Send email with options
 * @param {Object} options - Email options
 * @returns {Promise} Nodemailer response
 */
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `"${config.appName || 'Food App'}" <${config.emailServiceConfig.auth.user}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            attachments: options.attachments || []
        };

        if (config.env === 'development') {
            logger.debug(`[DEV] Email would be sent to: ${options.to}`);
            logger.debug(`[DEV] Email subject: ${options.subject}`);
        }

        const result = await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${options.to}: ${options.subject}`);
        return result;
    } catch (error) {
        logger.error(`Error sending email: ${error.message}`);
        throw error;
    }
};

/**
 * Send verification email to user
 * @param {String} email - User's email address
 * @param {String} name - User's name
 * @param {String} verificationUrl - URL to verify email
 * @returns {Promise} Email send result
 */
exports.sendVerificationEmail = async (email, name, verificationUrl) => {
    const templateData = {
        title: 'Verify Your Email',
        name: name,
        content: 'Please verify your email address to complete your registration. Click the button below to verify your email.',
        actionText: 'Verify Email',
        actionUrl: verificationUrl,
        company: config.appName || 'Food App',
        supportEmail: config.supportEmail || 'support@foodapp.com',
        year: new Date().getFullYear()
    };

    const html = loadTemplate('verification', templateData);

    return sendEmail({
        to: email,
        subject: 'Verify Your Email Address',
        html
    });
};

/**
 * Send password reset email
 * @param {String} email - User's email address
 * @param {String} name - User's name
 * @param {String} resetUrl - URL to reset password
 * @returns {Promise} Email send result
 */
exports.sendPasswordResetEmail = async (email, name, resetUrl) => {
    const templateData = {
        title: 'Reset Your Password',
        name: name,
        content: 'You requested a password reset. Click the button below to reset your password. If you didn\'t request this, you can safely ignore this email.',
        actionText: 'Reset Password',
        actionUrl: resetUrl,
        company: config.appName || 'Food App',
        supportEmail: config.supportEmail || 'support@foodapp.com',
        year: new Date().getFullYear()
    };

    const html = loadTemplate('password-reset', templateData);

    return sendEmail({
        to: email,
        subject: 'Reset Your Password',
        html
    });
};

/**
 * Send order confirmation email
 * @param {String} email - User's email address
 * @param {String} name - User's name
 * @param {Object} order - Order details
 * @returns {Promise} Email send result
 */
exports.sendOrderConfirmation = async (email, name, order) => {
    const templateData = {
        title: 'Order Confirmation',
        name: name,
        orderId: order._id,
        orderDate: new Date(order.createdAt).toLocaleString(),
        items: order.items,
        total: order.totalAmount,
        shippingAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        estimatedDelivery: order.estimatedDeliveryTime || '35 min',
        company: config.appName || 'Food App',
        supportEmail: config.supportEmail || 'support@foodapp.com',
        orderUrl: `${config.frontendUrl}/orders/${order._id}`,
        year: new Date().getFullYear()
    };

    const html = loadTemplate('order-confirmation', templateData);

    return sendEmail({
        to: email,
        subject: `Order Confirmation #${order._id}`,
        html
    });
};

/**
 * Send welcome email after registration
 * @param {String} email - User's email address
 * @param {String} name - User's name
 * @returns {Promise} Email send result
 */
exports.sendWelcomeEmail = async (email, name) => {
    const templateData = {
        title: 'Welcome to Food App!',
        name: name,
        content: 'Thank you for joining Food App. We\'re excited to have you as a member!',
        actionText: 'Start Ordering',
        actionUrl: `${config.frontendUrl}/menu`,
        company: config.appName || 'Food App',
        supportEmail: config.supportEmail || 'support@foodapp.com',
        year: new Date().getFullYear()
    };

    const html = loadTemplate('welcome', templateData);

    return sendEmail({
        to: email,
        subject: 'Welcome to Food App!',
        html
    });
};

/**
 * Send notification about today's special menu
 * @param {String} email - User's email address
 * @param {String} name - User's name
 * @param {Array} specialItems - Today's special items
 * @returns {Promise} Email send result
 */
exports.sendTodaysSpecialNotification = async (email, name, specialItems) => {
    const templateData = {
        title: 'Today\'s Special Menu',
        name: name,
        content: 'Check out our special items for today!',
        specialItems: specialItems.map(item => ({
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            url: `${config.frontendUrl}/product/${item._id}`
        })),
        actionText: 'View All Specials',
        actionUrl: `${config.frontendUrl}/todays-special`,
        company: config.appName || 'Food App',
        supportEmail: config.supportEmail || 'support@foodapp.com',
        year: new Date().getFullYear()
    };

    const html = loadTemplate('todays-special', templateData);

    return sendEmail({
        to: email,
        subject: 'Today\'s Special Menu - Don\'t Miss Out!',
        html
    });
};

/**
 * Send notification about order status update
 * @param {String} email - User's email address
 * @param {String} name - User's name
 * @param {Object} order - Order details
 * @param {String} status - New status
 * @returns {Promise} Email send result
 */
exports.sendOrderStatusUpdate = async (email, name, order, status) => {
    let statusMessage = '';
    let subject = '';

    switch(status) {
        case 'confirmed':
            statusMessage = 'Your order has been confirmed and is being prepared.';
            subject = 'Order Confirmed';
            break;
        case 'preparing':
            statusMessage = 'Good news! Your order is now being prepared.';
            subject = 'Your Order is Being Prepared';
            break;
        case 'ready':
            statusMessage = 'Your order is ready for pickup/delivery.';
            subject = 'Your Order is Ready';
            break;
        case 'delivered':
            statusMessage = 'Your order has been delivered. Enjoy your meal!';
            subject = 'Order Delivered';
            break;
        case 'cancelled':
            statusMessage = 'Your order has been cancelled. If you didn\'t request this, please contact our support team.';
            subject = 'Order Cancelled';
            break;
        default:
            statusMessage = `Your order status has been updated to: ${status}`;
            subject = 'Order Status Update';
    }

    const templateData = {
        title: subject,
        name: name,
        orderId: order._id,
        orderDate: new Date(order.createdAt).toLocaleString(),
        status: status,
        statusMessage: statusMessage,
        items: order.items,
        orderUrl: `${config.frontendUrl}/orders/${order._id}`,
        company: config.appName || 'Food App',
        supportEmail: config.supportEmail || 'support@foodapp.com',
        year: new Date().getFullYear()
    };

    const html = loadTemplate('order-status', templateData);

    return sendEmail({
        to: email,
        subject: `${subject} - Order #${order._id}`,
        html
    });
};

/**
 * Send promo code to user
 * @param {String} email - User's email address
 * @param {String} name - User's name
 * @param {Object} promoCode - Promo code details
 * @returns {Promise} Email send result
 */
exports.sendPromoCode = async (email, name, promoCode) => {
    const templateData = {
        title: 'Special Offer Just for You!',
        name: name,
        code: promoCode.code,
        discount: promoCode.discountType === 'percentage' ?
            `${promoCode.discountValue}%` :
            `$${promoCode.discountValue}`,
        expiryDate: new Date(promoCode.expiryDate).toLocaleDateString(),
        description: promoCode.description,
        minOrderAmount: promoCode.minOrderAmount,
        actionText: 'Order Now',
        actionUrl: `${config.frontendUrl}/menu`,
        company: config.appName || 'Food App',
        supportEmail: config.supportEmail || 'support@foodapp.com',
        year: new Date().getFullYear()
    };

    const html = loadTemplate('promo-code', templateData);

    return sendEmail({
        to: email,
        subject: 'Special Discount Code Inside!',
        html
    });
};