
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const next = require('next');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: './src' });
const handle = nextApp.getRequestHandler();

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://via.placeholder.com"],
            connectSrc: ["'self'"]
        }
    }
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes from auto-start-production.js
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), project: 'Veridian Private Concierge' });
});

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


nextApp.prepare().then(() => {
    console.log('Next.js app prepared.');

    app.all('*', (req, res) => {
        return handle(req, res);
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    });

    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOST || '0.0.0.0';

    const server = app.listen(PORT, HOST, (err) => {
        if (err) throw err;
        console.log(`🚀 Stella Global Class Production Server running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'production'}`);
        console.log(`🌐 Health check: http://localhost:${PORT}/health`);
        console.log(`💎 Premium features: http://localhost:${PORT}/api/premium`);
        console.log(`📈 Metrics: http://localhost:${PORT}/api/metrics`);
        console.log(`🏗️  Domains: http://localhost:${PORT}/api/domains`);
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down production server gracefully...');
      server.close(() => {
        console.log('✅ Production server closed gracefully');
        process.exit(0);
      });

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

      setTimeout(() => {
        console.log('⚠️  Forcing server shutdown');
        process.exit(1);
      }, 10000);
    });
});
