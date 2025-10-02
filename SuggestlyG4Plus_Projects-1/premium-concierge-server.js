const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: '.env.production' });

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

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
app.use(express.static(path.join(__dirname, 'public')));

// Premium Concierge Landing Page
app.get('/', (req, res) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Veridian Private Concierge - Premium Multi-Service AI Concierge</title>
    <meta name="description" content="Veridian Private Concierge offers comprehensive AI-powered concierge services covering technology, healthcare, education, real estate, travel, e-commerce, and luxury lifestyle management for elite clients worldwide.">
    <meta name="keywords" content="concierge services, AI assistance, luxury lifestyle, technology solutions, healthcare management, education platform, real estate services, travel planning, e-commerce solutions, premium service">
    <meta name="author" content="Veridian Private Concierge">

    <!-- Open Graph / Social Media -->
    <meta property="og:title" content="Veridian Private Concierge - Premium Multi-Service AI Concierge">
    <meta property="og:description" content="Comprehensive AI-powered concierge services covering technology, healthcare, education, real estate, travel, and luxury lifestyle management">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://veridianprivate.com">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Fonts -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700&display=swap"></noscript>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer">

    <style>
        /* Premium Design System */
        :root {
            --primary-gold: #FFD700;
            --secondary-gold: #FFA500;
            --deep-black: #0a0a0a;
            --charcoal: #1a1a1a;
            --silver: #C0C0C0;
            --white: #ffffff;
            --gradient-gold: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--deep-black);
            color: var(--white);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Navigation */
        .luxury-nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(20px);
            z-index: 1000;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-logo {
            display: flex;
            align-items: center;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .gold-icon {
            color: var(--primary-gold);
            font-size: 1.5rem;
        }

        .logo-text {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--white);
        }

        .logo-subtitle {
            font-size: 0.8rem;
            color: var(--silver);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
            align-items: center;
        }

        .nav-link {
            color: var(--white);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-link:hover {
            color: var(--primary-gold);
        }

        .btn-primary-gold {
            background: var(--gradient-gold);
            color: var(--deep-black);
            border: none;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .btn-primary-gold:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        }

        /* Hero Section */
        .hero-luxury {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            margin-top: 80px;
        }

        .hero-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        .animated-bg {
            position: relative;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(255, 165, 0, 0.1) 0%, transparent 50%),
                        var(--deep-black);
        }

        .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 215, 0, 0.1);
            padding: 0.5rem 1rem;
            border-radius: 50px;
            border: 1px solid rgba(255, 215, 0, 0.3);
            margin-bottom: 1rem;
        }

        .hero-title {
            font-family: 'Playfair Display', serif;
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1rem;
        }

        .title-line {
            display: block;
        }

        .gold-text {
            color: var(--primary-gold);
        }

        .hero-subtitle {
            font-size: 1.2rem;
            color: var(--silver);
            margin-bottom: 2rem;
            line-height: 1.8;
        }

        .hero-metrics {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .metric-item {
            text-align: center;
        }

        .metric-value {
            display: block;
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-gold);
        }

        .metric-label {
            font-size: 0.9rem;
            color: var(--silver);
        }

        .hero-actions {
            display: flex;
            gap: 1rem;
        }

        .btn-secondary {
            background: transparent;
            color: var(--white);
            border: 2px solid var(--primary-gold);
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            background: var(--primary-gold);
            color: var(--deep-black);
        }

        .hero-visual {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .hero-image {
            width: 100%;
            height: auto;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(255, 215, 0, 0.2);
        }

        /* Services Section */
        .services-section {
            padding: 5rem 0;
            background: var(--charcoal);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .section-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 215, 0, 0.1);
            padding: 0.5rem 1rem;
            border-radius: 50px;
            border: 1px solid rgba(255, 215, 0, 0.3);
            margin-bottom: 1rem;
        }

        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1rem;
        }

        .section-subtitle {
            font-size: 1.2rem;
            color: var(--silver);
            max-width: 600px;
            margin: 0 auto;
        }

        .service-content {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            backdrop-filter: blur(10px);
        }

        .service-icon {
            font-size: 2rem;
            color: var(--primary-gold);
            margin-bottom: 1rem;
        }

        .service-content h3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--white);
        }

        .service-features {
            list-style: none;
            margin-top: 1rem;
        }

        .service-features li {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
            color: var(--silver);
        }

        .service-features i {
            color: var(--primary-gold);
        }

        /* Server Status */
        .server-status {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid var(--primary-gold);
            border-radius: 10px;
            padding: 1rem;
            z-index: 1000;
            backdrop-filter: blur(10px);
        }

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }

        .status-dot {
            width: 10px;
            height: 10px;
            background: #00ff00;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .hero-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            .hero-title {
                font-size: 2.5rem;
            }

            .nav-menu {
                display: none;
            }

            .hero-metrics {
                flex-direction: column;
                gap: 1rem;
            }

            .hero-actions {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="luxury-nav">
        <div class="nav-container">
            <div class="nav-logo">
                <div class="logo-container">
                    <i class="fas fa-crown gold-icon"></i>
                    <div>
                        <div class="logo-text">Veridian</div>
                        <div class="logo-subtitle">Private Concierge</div>
                    </div>
                </div>
            </div>
            <ul class="nav-menu">
                <li><a href="#services" class="nav-link">Services</a></li>
                <li><a href="#premium" class="nav-link">Premium</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="nav-cta">
                <button type="button" class="btn-primary-gold" onclick="requestAccess()">
                    Exclusive Access
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-luxury">
        <div class="hero-background">
            <div class="animated-bg"></div>
        </div>
        <div class="hero-content">
            <div class="hero-main">
                <div class="hero-info">
                    <div class="hero-badge">
                        <i class="fas fa-gem"></i>
                        <span>Premium Multi-Service Concierge</span>
                    </div>
                    <h1 class="hero-title">
                        <span class="title-line">Comprehensive AI Concierge</span>
                        <span class="title-line gold-text">For Every Aspect of Your Life</span>
                    </h1>
                    <p class="hero-subtitle">
                        Experience the future of premium lifestyle management with cutting-edge AI technology
                        covering technology, healthcare, education, real estate, travel, e-commerce, and luxury services.
                    </p>
                    <div class="hero-metrics">
                        <div class="metric-item">
                            <span class="metric-value">15+</span>
                            <span class="metric-label">AI Service Categories</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-value">99.9%</span>
                            <span class="metric-label">Automation Rate</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-value">24/7</span>
                            <span class="metric-label">AI Operations</span>
                        </div>
                    </div>
                    <div class="hero-actions">
                        <button type="button" class="btn-primary-gold" onclick="requestAccess()">
                            <i class="fas fa-lock"></i>
                            Request Access
                        </button>
                        <button type="button" class="btn-secondary" onclick="viewDemo()">
                            <i class="fas fa-play"></i>
                            View Demo
                        </button>
                    </div>
                </div>
            </div>
            <div class="hero-visual">
                <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" alt="AI-powered comprehensive concierge services dashboard" class="hero-image">
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services-section">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">
                    <i class="fas fa-concierge-bell"></i>
                    <span>Exclusive Services</span>
                </div>
                <h2 class="section-title">
                    <span class="title-line">Premium Services</span>
                    <span class="title-line gold-text">Tailored for Excellence</span>
                </h2>
                <p class="section-subtitle">
                    Comprehensive AI-powered solutions across 15+ service categories,
                    all automated and delivered with white-glove service excellence.
                </p>
            </div>

            <div class="service-content">
                <div class="service-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h3>Complete Automation Suite</h3>
                <p>Our flagship service offering comprehensive automation across all 15+ service categories,
                   eliminating human intervention while maintaining premium quality standards.</p>
                <ul class="service-features">
                    <li><i class="fas fa-check"></i> Zero human intervention required</li>
                    <li><i class="fas fa-check"></i> 99.9% automation success rate</li>
                    <li><i class="fas fa-check"></i> Real-time AI optimization</li>
                    <li><i class="fas fa-check"></i> Cross-platform integration</li>
                </ul>
            </div>

            <div class="service-content">
                <div class="service-icon">
                    <i class="fas fa-brain"></i>
                </div>
                <h3>Neural Network Processing</h3>
                <p>Advanced neural network systems that process and optimize all services simultaneously,
                   learning and improving without any human programming or intervention.</p>
                <ul class="service-features">
                    <li><i class="fas fa-check"></i> Self-learning algorithms</li>
                    <li><i class="fas fa-check"></i> Predictive optimization</li>
                    <li><i class="fas fa-check"></i> Cross-service intelligence</li>
                    <li><i class="fas fa-check"></i> Autonomous improvement</li>
                </ul>
            </div>

            <div class="service-content">
                <div class="service-icon">
                    <i class="fas fa-infinity"></i>
                </div>
                <h3>Infinite Scalability</h3>
                <p>Fully autonomous service scaling that grows with your needs, handling unlimited requests
                   across all service categories without any human oversight or intervention.</p>
                <ul class="service-features">
                    <li><i class="fas fa-check"></i> Unlimited capacity</li>
                    <li><i class="fas fa-check"></i> Instant scaling</li>
                    <li><i class="fas fa-check"></i> Zero downtime</li>
                    <li><i class="fas fa-check"></i> Global availability</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Server Status Widget -->
    <div class="server-status">
        <div class="status-indicator">
            <div class="status-dot"></div>
            <span>Production Server Active</span>
        </div>
        <div>Port: ${PORT}</div>
        <div>Environment: Production</div>
        <div>Uptime: <span id="uptime">0s</span></div>
    </div>

    <script>
        // Interactive functionality
        function requestAccess() {
            alert('Exclusive access request submitted. Our premium concierge team will contact you within 24 hours.');
        }

        function viewDemo() {
            alert('Demo access requires premium membership. Please request exclusive access first.');
        }

        // Server uptime counter
        let startTime = Date.now();
        function updateUptime() {
            const uptime = Math.floor((Date.now() - startTime) / 1000);
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = uptime % 60;

            let uptimeText = '';
            if (hours > 0) uptimeText += hours + 'h ';
            if (minutes > 0) uptimeText += minutes + 'm ';
            uptimeText += seconds + 's';

            document.getElementById('uptime').textContent = uptimeText;
        }

        setInterval(updateUptime, 1000);
        updateUptime();

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll effect to navigation
        window.addEventListener('scroll', function() {
            const nav = document.querySelector('.luxury-nav');
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(10, 10, 10, 0.98)';
                nav.style.backdropFilter = 'blur(30px)';
            } else {
                nav.style.background = 'rgba(10, 10, 10, 0.95)';
                nav.style.backdropFilter = 'blur(20px)';
            }
        });
    </script>
</body>
</html>
`;
  res.send(htmlContent);
});

// API routes for premium concierge services
app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    service: 'Veridian Private Concierge',
    environment: 'production',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: [
      'Technology Solutions',
      'Healthcare Management',
      'Education Platform',
      'Real Estate Services',
      'Travel & Hospitality',
      'E-commerce Solutions',
      'Logistics Management',
      'Chauffeur Services',
      'Web Design Services',
      'Content Creation',
      'Legal & Compliance',
      'Financial Automation',
      'Security Automation'
    ]
  });
});

// Premium access request endpoint
app.post('/api/access-request', (req, res) => {
  const { name, email, company, services } = req.body;

  // Log the access request (in production, this would save to database)
  console.log('Premium Access Request:', {
    name,
    email,
    company,
    services,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'Access request received. Our premium concierge team will contact you within 24 hours.',
    requestId: Date.now().toString()
  });
});

// Service status monitoring endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'production',
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong with our premium concierge service'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested premium concierge service is not available'
  });
});

// Start production server
app.listen(PORT, () => {
  console.log(`🚀 Veridian Private Concierge Premium Server running on port ${PORT}`);
  console.log(`🌐 Environment: Production`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Main Application: http://localhost:${PORT}`);
  console.log(`⚡ Premium Services: Active`);
  console.log(`🔒 Security: Enabled`);
  console.log(`📈 Monitoring: Active`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Auto-restart functionality for production
const restartServer = () => {
  console.log('🔄 Auto-restarting production server...');
  process.exit(1); // Exit with error code to trigger restart
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  restartServer();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  restartServer();
});

module.exports = app;
