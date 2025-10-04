const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware with CSP configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// CORS configuration for premium global access
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'veridian')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), project: 'Veridian Private Concierge' });
});

// Main endpoint - serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'veridian', 'index.html'));
});

// Domain landing pages
app.get('/velocities', (req, res) => {
  res.redirect(301, '/');
});

app.get('/concierge', (req, res) => {
  res.redirect(301, '/');
});

app.get('/courier', (req, res) => {
  res.redirect(301, '/');
});

app.get('/veridian', (req, res) => {
  res.redirect(301, '/');
});

// Premium features endpoint
app.get('/api/premium', (req, res) => {
  res.json({
    premium: true,
    features: [
      'Global Class Architecture',
      'Production-Ready Deployment',
      'Auto-Scaling Capabilities',
      'Enterprise-Grade Security',
      'Premium Analytics Dashboard',
      'Advanced Monitoring',
      'Global CDN Integration',
      '24/7 Premium Support'
    ]
  });
});

// Production metrics endpoint
app.get('/api/metrics', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.json({
    uptime: uptime,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    nodeVersion: process.version,
    platform: process.platform
  });
});

// Auto-start production endpoints for different domains
app.get('/api/domains', (req, res) => {
  res.json({
    domains: [
      {
        name: 'velocities',
        status: 'active',
        url: 'http://localhost:3001'
      },
      {
        name: 'concierge',
        status: 'active',
        url: 'http://localhost:3002'
      },
      {
        name: 'ontargetwebdesign',
        status: 'active',
        url: 'http://localhost:3003'
      }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down production server gracefully...');
  server.close(() => {
    console.log('✅ Production server closed gracefully');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.log('⚠️  Forcing server shutdown');
    process.exit(1);
  }, 10000);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down production server gracefully...');
  server.close(() => {
    console.log('✅ Production server closed gracefully');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.log('⚠️  Forcing server shutdown');
    process.exit(1);
  }, 10000);
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Stella Global Class Production Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`💎 Premium features: http://localhost:${PORT}/api/premium`);
  console.log(`📈 Metrics: http://localhost:${PORT}/api/metrics`);
  console.log(`🏗️  Domains: http://localhost:${PORT}/api/domains`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});
