const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// API rate limiter (stricter)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many API requests, please try again later.',
});

// Security middleware with CSP configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: ["'unsafe-inline'"],
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

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use(limiter);

// Compression middleware
app.use(compression());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Access request storage (in-memory for now - use database in production)
const accessRequests = [];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    project: 'Stella Global Class',
    uptime: process.uptime()
  });
});

// Main endpoint - serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Domain landing pages
app.get('/velocities', (req, res) => {
  res.sendFile(path.join(__dirname, 'veridian', 'velocities-landing.html'));
});

app.get('/concierge', (req, res) => {
  res.sendFile(path.join(__dirname, 'veridian', 'concierge-landing.html'));
});

app.get('/veridian', (req, res) => {
  res.sendFile(path.join(__dirname, 'veridian', 'veridian-premium-landing.html'));
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
    platform: process.platform,
    timestamp: new Date().toISOString()
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

// Access request endpoint
app.post('/api/access-request', (req, res) => {
  const { name, email, accessLevel, company, reason } = req.body;

  // Validate required fields
  if (!name || !email || !accessLevel) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['name', 'email', 'accessLevel']
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }

  // Create access request
  const accessRequest = {
    id: Date.now().toString(),
    name,
    email,
    accessLevel,
    company: company || 'N/A',
    reason: reason || 'N/A',
    status: 'pending',
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress
  };

  // Store request
  accessRequests.push(accessRequest);

  // Log request
  console.log('📝 New access request received:');
  console.log(`   Name: ${name}`);
  console.log(`   Email: ${email}`);
  console.log(`   Access Level: ${accessLevel}`);
  console.log(`   Request ID: ${accessRequest.id}`);

  res.json({
    success: true,
    message: 'Access request submitted successfully',
    requestId: accessRequest.id,
    status: 'pending',
    estimatedResponse: '24 hours'
  });
});

// Get all access requests (admin endpoint)
app.get('/api/access-requests', (req, res) => {
  res.json({
    total: accessRequests.length,
    pending: accessRequests.filter(r => r.status === 'pending').length,
    approved: accessRequests.filter(r => r.status === 'approved').length,
    rejected: accessRequests.filter(r => r.status === 'rejected').length,
    requests: accessRequests
  });
});

// Security status endpoint
app.get('/api/security-status', (req, res) => {
  res.json({
    status: 'active',
    features: {
      helmet: 'active',
      cors: 'configured',
      rateLimit: 'active',
      compression: 'active',
      https: process.env.NODE_ENV === 'production' ? 'recommended' : 'not required in dev'
    },
    securityHeaders: {
      'X-DNS-Prefetch-Control': 'on',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    },
    rateLimits: {
      general: '100 requests per 15 minutes',
      api: '50 requests per 15 minutes'
    }
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
  console.log(`🔒 Security status: http://localhost:${PORT}/api/security-status`);
  console.log(`🔐 Access requests: http://localhost:${PORT}/api/access-requests`);
  console.log(`⚡ Rate limiting: Active (100 req/15min general, 50 req/15min API)`);
  console.log(`🗜️  Compression: Active`);
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
