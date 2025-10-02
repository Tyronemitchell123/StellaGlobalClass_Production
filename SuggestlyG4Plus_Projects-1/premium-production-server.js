const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Create Express app
const app = express();

// Security and performance middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            scriptSrcAttr: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://via.placeholder.com"],
            connectSrc: ["'self'"],
        },
    },
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors());

// Static file serving with caching
app.use(express.static(path.join(__dirname, 'veridian'), {
    maxAge: '1h',
    etag: true,
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// API Routes for contact form and services
app.use(express.json());

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, serviceInterest, message } = req.body;

    // Log the contact request (in production, this would send email or save to database)
    console.log('Contact Form Submission:', {
        name,
        email,
        serviceInterest,
        message,
        timestamp: new Date().toISOString()
    });

    // Send success response
    res.json({
        success: true,
        message: 'Thank you for your inquiry. Our concierge team will contact you within 24 hours.',
        referenceId: `VRD-${Date.now()}`
    });
});

// Membership request endpoint
app.post('/api/membership', (req, res) => {
    const { name, email, membership } = req.body;

    // Log the membership request
    console.log('Membership Request:', {
        name,
        email,
        membership,
        timestamp: new Date().toISOString()
    });

    // Send success response
    res.json({
        success: true,
        message: `Thank you for your interest in our ${membership} membership. Our team will contact you shortly.`,
        referenceId: `VRD-MEM-${Date.now()}`
    });
});

// Service status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'operational',
        services: {
            'Luxury Transportation': 'available',
            'Premium Courier': 'available',
            'Web Design': 'available',
            'Healthcare Management': 'available',
            'Travel & Hospitality': 'available',
            'Real Estate': 'available',
            'Education Platform': 'available',
            'E-commerce Solutions': 'available'
        },
        uptime: '99.9%',
        lastUpdated: new Date().toISOString()
    });
});

// Serve the main landing page for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'veridian', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`🚀 Veridian Private Concierge Production Server`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log(`🌐 Server running at: http://${HOST}:${PORT}`);
    console.log(`📱 Serving premium landing page with full functionality`);
    console.log(`🔒 Security: Helmet, CORS, and CSP enabled`);
    console.log(`⚡ Performance: Compression and caching enabled`);
    console.log(`📊 API endpoints: /api/contact, /api/membership, /api/status`);
    console.log(`✨ Premium AI Concierge Services Active`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});
