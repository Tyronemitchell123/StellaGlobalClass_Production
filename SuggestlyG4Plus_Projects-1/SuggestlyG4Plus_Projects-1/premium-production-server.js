const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan'); // You can keep morgan for logging all requests
const next = require('next');

// Determine if the environment is development or production
const dev = process.env.NODE_ENV !== 'production';
// Create the Next.js app instance
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Create Express app
const app = express();

// Security and performance middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"], // Next.js needs 'unsafe-inline' for styles in dev
            fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://via.placeholder.com"],
            connectSrc: ["'self'"],
        },
    },
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors());

// Next.js will handle static file serving.

// Prepare the Next.js app and start the server
nextApp.prepare().then(() => {
    console.log('Next.js app prepared.');

    // Let Next.js handle all other routes
    app.all('*', (req, res) => {
        return handle(req, res);
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

    app.listen(PORT, HOST, (err) => {
        if (err) throw err;
        console.log(`🚀 Veridian Private Concierge Production Server (with Next.js)`);
        console.log(`📅 Started at: ${new Date().toISOString()}`);
        console.log(`🌐 Server running at: http://${HOST}:${PORT}`);
        console.log(`🔒 Security: Helmet, CORS, and CSP enabled`);
        console.log(`⚡ Performance: Compression and caching enabled`);
        console.log(`📊 All API endpoints are now handled by Next.js.`);
        console.log(`✨ Next.js app and API routes are now active.`);
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
});
