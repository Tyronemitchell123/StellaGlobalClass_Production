/**
 * Veridian Private Concierge - Simplified Contact Form Handler
 * This version starts reliably and handles form submissions
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Veridian Contact Form API',
        version: '1.0.0'
    });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    try {
        const { fullName, email, serviceInterest, message, phone } = req.body;

        // Basic validation
        if (!fullName || !email || !serviceInterest || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                required: ['fullName', 'email', 'serviceInterest', 'message']
            });
        }

        // Log the submission
        console.log('\n=== NEW CONTACT FORM SUBMISSION ===');
        console.log(`Name: ${fullName}`);
        console.log(`Email: ${email}`);
        console.log(`Service: ${serviceInterest}`);
        console.log(`Message: ${message}`);
        if (phone) console.log(`Phone: ${phone}`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log('===================================\n');

        // In production, this would send an email to tye3to1@outlook.com
        // For now, we're logging and returning success

        res.status(200).json({
            success: true,
            message: 'Thank you for your inquiry! Our concierge team will contact you within 24 hours.',
            submissionId: `VPC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            note: 'Email delivery requires SMTP configuration in production'
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Veridian Private Concierge API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            contact: 'POST /api/contact'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong'
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🚀 Veridian Contact Form API');
    console.log('========================================');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
    console.log(`📬 Email recipient: tye3to1@outlook.com`);
    console.log('========================================\n');
});

// Error handling
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.error('Please stop the other server or use a different port');
    } else {
        console.error('❌ Server error:', error);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed gracefully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed gracefully');
        process.exit(0);
    });
});

module.exports = app;
