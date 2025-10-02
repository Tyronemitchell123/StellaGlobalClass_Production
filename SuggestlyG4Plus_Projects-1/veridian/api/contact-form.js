/**
 * Veridian Private Concierge - Contact Form Handler (Node.js)
 * Handles form submissions and sends emails to tye3to1@outlook.com
 *
 * @version 1.0.0
 * @author Veridian Development Team
 *
 * Installation:
 * npm install express cors nodemailer express-rate-limit helmet
 */

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: [
        'https://veridianprivate.com',
        'https://www.veridianprivate.com',
        'http://localhost:3000',
        'http://localhost:8000'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1, // 1 request per minute
    message: {
        success: false,
        message: 'Please wait before submitting another request.'
    }
});

// Email transporter configuration
const transporter = nodemailer.createTransporter({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: 'noreply@veridianprivate.com', // Update with actual email
        pass: process.env.EMAIL_PASSWORD || 'your-password-here' // Use environment variable
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

// Validation function
function validateInput(data) {
    const errors = [];

    // Full Name validation
    if (!data.fullName || data.fullName.trim().length === 0) {
        errors.push('Full name is required');
    } else if (data.fullName.length < 2) {
        errors.push('Full name must be at least 2 characters');
    } else if (data.fullName.length > 100) {
        errors.push('Full name must not exceed 100 characters');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || data.email.trim().length === 0) {
        errors.push('Email is required');
    } else if (!emailRegex.test(data.email)) {
        errors.push('Invalid email format');
    }

    // Service Interest validation
    if (!data.serviceInterest || data.serviceInterest.trim().length === 0) {
        errors.push('Service interest is required');
    }

    // Message validation
    if (!data.message || data.message.trim().length === 0) {
        errors.push('Message is required');
    } else if (data.message.length < 10) {
        errors.push('Message must be at least 10 characters');
    } else if (data.message.length > 5000) {
        errors.push('Message must not exceed 5000 characters');
    }

    return errors;
}

// Sanitize input
function sanitizeInput(data) {
    const sanitize = (str) => {
        if (!str) return '';
        return str.toString()
            .trim()
            .replace(/[<>]/g, '')
            .substring(0, 5000);
    };

    return {
        fullName: sanitize(data.fullName),
        email: sanitize(data.email).toLowerCase(),
        serviceInterest: sanitize(data.serviceInterest),
        message: sanitize(data.message),
        phone: sanitize(data.phone || '')
    };
}

// Contact form endpoint
app.post('/api/contact', limiter, async (req, res) => {
    try {
        // Validate input
        const errors = validateInput(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        // Sanitize input
        const data = sanitizeInput(req.body);

        // Create email HTML
        const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #0A1628 0%, #1a2942 100%);
            color: #D4AF37;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-family: "Playfair Display", serif;
        }
        .header p {
            margin: 5px 0 0 0;
            color: #ffffff;
            font-size: 14px;
        }
        .field {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        .field:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #0A1628;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .value {
            color: #333;
            font-size: 16px;
            word-wrap: break-word;
        }
        .message-box {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            border-left: 4px solid #D4AF37;
            white-space: pre-wrap;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #D4AF37;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .badge {
            display: inline-block;
            background-color: #D4AF37;
            color: #0A1628;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👑 Veridian Private Concierge</h1>
            <p>New Contact Form Submission</p>
        </div>

        <div class="field">
            <div class="label">Full Name</div>
            <div class="value">${data.fullName}</div>
        </div>

        <div class="field">
            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${data.email}" style="color: #D4AF37; text-decoration: none;">${data.email}</a></div>
        </div>

        ${data.phone ? `
        <div class="field">
            <div class="label">Phone Number</div>
            <div class="value">${data.phone}</div>
        </div>
        ` : ''}

        <div class="field">
            <div class="label">Service Interest</div>
            <div class="value">
                ${data.serviceInterest}
                <span class="badge">Priority Lead</span>
            </div>
        </div>

        <div class="field">
            <div class="label">Message</div>
            <div class="message-box">${data.message}</div>
        </div>

        <div class="footer">
            <p><strong>Submission Details</strong></p>
            <p>Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US')}</p>
            <p>IP Address: ${req.ip || req.connection.remoteAddress}</p>
            <p>User Agent: ${req.get('user-agent')}</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #999;">This email was sent from the Veridian Private Concierge contact form.</p>
            <p style="color: #999;">Please respond to the client within 24 hours for optimal service.</p>
        </div>
    </div>
</body>
</html>
        `;

        // Email options
        const mailOptions = {
            from: '"Veridian Private Concierge" <noreply@veridianprivate.com>',
            to: 'tye3to1@outlook.com',
            replyTo: data.email,
            subject: 'New Contact Form Submission - Veridian Private Concierge',
            html: emailHTML,
            text: `
New Contact Form Submission

Full Name: ${data.fullName}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
Service Interest: ${data.serviceInterest}

Message:
${data.message}

---
Submission Date: ${new Date().toLocaleString()}
IP Address: ${req.ip || req.connection.remoteAddress}
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Log submission
        console.log(`[${new Date().toISOString()}] Contact form submission from ${data.email} - ${data.serviceInterest}`);

        // Success response
        res.status(200).json({
            success: true,
            message: 'Thank you for your inquiry! Our concierge team will contact you within 24 hours.',
            submissionId: `VPC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });

    } catch (error) {
        console.error('Error processing contact form:', error);

        res.status(500).json({
            success: false,
            message: 'We apologize, but there was an error sending your message. Please try again or contact us directly at concierge@veridianprivate.com'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Veridian Contact Form API'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Veridian Contact Form API running on port ${PORT}`);
    console.log(`📧 Email notifications will be sent to: tye3to1@outlook.com`);
    console.log(`🔒 Security: Helmet enabled, CORS configured, Rate limiting active`);
});

module.exports = app;
