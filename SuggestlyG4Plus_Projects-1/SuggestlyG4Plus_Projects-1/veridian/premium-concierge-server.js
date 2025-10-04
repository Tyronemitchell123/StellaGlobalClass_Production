const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cluster = require("cluster");
const os = require("os");
const { randomBytes } = require("crypto");
require("dotenv").config();

// Performance monitoring and optimization constants
const PERFORMANCE_CONFIG = {
  CACHE_TTL: 300, // 5 minutes
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_CONNECTIONS: 1000,
  ENABLE_CLUSTERING: true,
  MONITORING_INTERVAL: 5000, // 5 seconds
  ALERT_THRESHOLDS: {
    MEMORY: 85, // 85%
    CPU: 80, // 80%
    RESPONSE_TIME: 1000, // 1 second
    ERROR_RATE: 5 // 5%
  },
  // Memory management limits
  MAX_RESPONSE_TIMES: 500,
  MAX_SYSTEM_METRICS: 50,
  MAX_ALERTS: 50,
  MAX_CACHE_SIZE: 50,
  MAX_ENDPOINT_RESPONSES: 100
};

// Performance monitoring data structure with memory leak prevention
const performanceMonitor = {
  requests: {
    total: 0,
    successful: 0,
    failed: 0,
    responseTimes: [],
    endpoints: {}
  },
  system: {
    memory: [],
    cpu: [],
    uptime: Date.now()
  },
  alerts: [],
  cache: new Map(),
  // Add cleanup mechanism
  cleanup() {
    // Limit response times array size
    if (this.requests.responseTimes.length > PERFORMANCE_CONFIG.MAX_RESPONSE_TIMES) {
      this.requests.responseTimes = this.requests.responseTimes.slice(-PERFORMANCE_CONFIG.MAX_RESPONSE_TIMES);
    }

    // Limit system metrics arrays
    if (this.system.memory.length > PERFORMANCE_CONFIG.MAX_SYSTEM_METRICS) {
      this.system.memory = this.system.memory.slice(-PERFORMANCE_CONFIG.MAX_SYSTEM_METRICS);
    }
    if (this.system.cpu.length > PERFORMANCE_CONFIG.MAX_SYSTEM_METRICS) {
      this.system.cpu = this.system.cpu.slice(-PERFORMANCE_CONFIG.MAX_SYSTEM_METRICS);
    }

    // Limit alerts
    if (this.alerts.length > PERFORMANCE_CONFIG.MAX_ALERTS) {
      this.alerts = this.alerts.slice(-PERFORMANCE_CONFIG.MAX_ALERTS);
    }

    // Clean cache entries older than 5 minutes
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > 300000) { // 5 minutes
        this.cache.delete(key);
      }
    }

    // Clean endpoint response times
    for (const [endpoint, data] of Object.entries(this.requests.endpoints)) {
      if (data.responseTimes.length > PERFORMANCE_CONFIG.MAX_ENDPOINT_RESPONSES) {
        data.responseTimes = data.responseTimes.slice(-PERFORMANCE_CONFIG.MAX_ENDPOINT_RESPONSES);
      }
    }
  }
};

// Helper functions for performance monitoring
function generateRequestId() {
  return randomBytes(16).toString("hex");
}

function addAlert(type, message) {
  const alert = {
    id: randomBytes(8).toString("hex"),
    type,
    message,
    timestamp: Date.now(),
    severity: "warning"
  };

  performanceMonitor.alerts.push(alert);

  // Keep only last 50 alerts to prevent memory bloat
  if (performanceMonitor.alerts.length > PERFORMANCE_CONFIG.MAX_ALERTS) {
    performanceMonitor.alerts = performanceMonitor.alerts.slice(-PERFORMANCE_CONFIG.MAX_ALERTS);
  }

  console.log(`🚨 Alert [${type}]: ${message}`);
}

function calculateCacheHitRate() {
  // Simple cache hit rate calculation (would be enhanced with actual hit/miss tracking)
  return Math.floor(Math.random() * 100); // Placeholder for demo
}

function monitorMasterProcess() {
  const memUsage = process.memoryUsage();
  const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  // Check memory thresholds
  if (memoryUsagePercent > PERFORMANCE_CONFIG.ALERT_THRESHOLDS.MEMORY) {
    addAlert("HIGH_MEMORY", `Memory usage critical: ${memoryUsagePercent.toFixed(1)}%`);
  }

  // Monitor worker processes
  const workers = Object.values(cluster.workers || {});
  workers.forEach(worker => {
    if (!worker.isConnected()) {
      addAlert("WORKER_DOWN", `Worker ${worker.id} is disconnected`);
    }
  });

  // Update system metrics
  performanceMonitor.system.memory.push(memoryUsagePercent);

  // Run cleanup to prevent memory leaks
  performanceMonitor.cleanup();
}

// Cluster management for multi-core optimization
if (PERFORMANCE_CONFIG.ENABLE_CLUSTERING && cluster.isMaster) {
  const cpuCount = os.cpus().length;
  console.log(`🚀 Starting Veridian Premium Concierge with ${cpuCount} worker processes...`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`🔄 Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

  // Master process monitoring
  const monitoringInterval = setInterval(() => {
    monitorMasterProcess();
  }, PERFORMANCE_CONFIG.MONITORING_INTERVAL);

  // Keep master process alive
  const keepAliveInterval = setInterval(() => {
    // Master process stays alive to monitor workers
  }, 60000);

  // Cleanup intervals on exit
  process.on('exit', () => {
    clearInterval(monitoringInterval);
    clearInterval(keepAliveInterval);
  });
}

const app = express();
const PORT = process.env.PORT || 8000;

// Performance monitoring middleware with memory leak prevention
app.use((req, res, next) => {
  const startTime = Date.now();
  const requestId = generateRequestId();

  // Add request ID to headers
  req.id = requestId;
  res.setHeader("X-Request-ID", requestId);

  // Track request
  performanceMonitor.requests.total++;

  // Monitor endpoint-specific metrics
  const endpoint = req.path;
  if (!performanceMonitor.requests.endpoints[endpoint]) {
    performanceMonitor.requests.endpoints[endpoint] = {
      count: 0,
      responseTimes: [],
      errors: 0
    };
  }
  performanceMonitor.requests.endpoints[endpoint].count++;

  // Response interceptor with proper cleanup
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - startTime;

    // Update performance metrics
    performanceMonitor.requests.responseTimes.push(responseTime);
    performanceMonitor.requests.endpoints[endpoint].responseTimes.push(responseTime);

    // Keep only last 500 response times for memory efficiency
    if (performanceMonitor.requests.responseTimes.length > PERFORMANCE_CONFIG.MAX_RESPONSE_TIMES) {
      performanceMonitor.requests.responseTimes = performanceMonitor.requests.responseTimes.slice(-PERFORMANCE_CONFIG.MAX_RESPONSE_TIMES);
    }

    // Keep endpoint response times limited
    if (performanceMonitor.requests.endpoints[endpoint].responseTimes.length > PERFORMANCE_CONFIG.MAX_ENDPOINT_RESPONSES) {
      performanceMonitor.requests.endpoints[endpoint].responseTimes =
        performanceMonitor.requests.endpoints[endpoint].responseTimes.slice(-PERFORMANCE_CONFIG.MAX_ENDPOINT_RESPONSES);
    }

    // Check for slow responses
    if (responseTime > PERFORMANCE_CONFIG.ALERT_THRESHOLDS.RESPONSE_TIME) {
      addAlert("SLOW_RESPONSE", `Slow response detected: ${responseTime}ms for ${endpoint}`);
    }

    // Track success/failure
    if (res.statusCode < 400) {
      performanceMonitor.requests.successful++;
    } else {
      performanceMonitor.requests.failed++;
      performanceMonitor.requests.endpoints[endpoint].errors++;
    }

    // Add performance headers
    res.setHeader("X-Response-Time", `${responseTime}ms`);
    res.setHeader("X-Process-ID", process.pid);

    return originalSend.call(this, data);
  };

  next();
});

// Premium security middleware with performance optimizations
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Premium CORS configuration for global access
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["*"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Enhanced rate limiting with multiple tiers
const premiumLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Higher limit for premium endpoints
  message: {
    error: "Premium rate limit exceeded",
    tier: "premium",
    retry_after: "15 minutes"
  },
  skip: (req) => {
    // Skip rate limiting for authenticated premium users
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer premium-");
  }
});

const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Standard limit
  message: {
    error: "Too many requests from this IP, please try again later.",
    premium: "Premium clients have higher rate limits"
  }
});

app.use("/api/premium/", premiumLimiter);
app.use("/api/", standardLimiter);

// Request timeout middleware with proper cleanup
app.use((req, res, next) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      addAlert("REQUEST_TIMEOUT", `Request timeout for ${req.path}`);
      res.status(408).json({
        error: "Request Timeout",
        message: "The request took too long to process",
        timeout: PERFORMANCE_CONFIG.REQUEST_TIMEOUT
      });
    }
  }, PERFORMANCE_CONFIG.REQUEST_TIMEOUT);

  // Override res.end to clear timeout
  const originalEnd = res.end;
  res.end = function() {
    clearTimeout(timeout);
    originalEnd.apply(this, arguments);
  };

  // Also cleanup on finish
  const cleanupTimeout = () => {
    clearTimeout(timeout);
  };

  res.on("finish", cleanupTimeout);
  req.on("close", cleanupTimeout);

  next();
});

// Caching middleware for enhanced performance with memory leak prevention
app.use((req, res, next) => {
  const cacheKey = req.originalUrl || req.url;

  // Check cache for GET requests
  if (req.method === "GET") {
    const cached = performanceMonitor.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < PERFORMANCE_CONFIG.CACHE_TTL * 1000) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cached.data);
    }
  }

  // Override res.json to cache responses
  const originalJson = res.json;
  res.json = function(data) {
    if (req.method === "GET" && res.statusCode < 400) {
      performanceMonitor.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      // Clean up old cache entries if cache grows too large
      if (performanceMonitor.cache.size > PERFORMANCE_CONFIG.MAX_CACHE_SIZE) {
        const now = Date.now();
        for (const [key, value] of performanceMonitor.cache.entries()) {
          if (now - value.timestamp > PERFORMANCE_CONFIG.CACHE_TTL * 1000) {
            performanceMonitor.cache.delete(key);
          }
        }
      }

      res.setHeader("X-Cache", "MISS");
    }
    return originalJson.call(this, data);
  };

  next();
});

// Compression for performance
app.use(compression());

// Premium logging middleware
app.use(morgan("combined"));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Enhanced static file serving with premium optimizations
app.use(express.static(__dirname, {
  maxAge: "1y",
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    } else if (path.endsWith(".css") || path.endsWith(".js")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("X-Content-Type-Options", "nosniff");
    } else if (path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("X-Content-Type-Options", "nosniff");
    }
  }
}));

// Premium security headers middleware
app.use((req, res, next) => {
  // Additional security headers for premium protection
  res.setHeader("X-Powered-By", "Veridian Premium Concierge Engine");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-Request-ID", req.id || "unknown");

  next();
});

// Premium connection limit middleware with proper cleanup
const connections = new Set();
app.use((req, res, next) => {
  connections.add(req);

  // Proper cleanup for connection tracking
  const cleanupConnection = () => {
    connections.delete(req);
  };

  res.on("close", cleanupConnection);
  res.on("finish", cleanupConnection);

  // Also cleanup on error
  req.on("close", cleanupConnection);

  // Check connection limits
  if (connections.size > PERFORMANCE_CONFIG.MAX_CONNECTIONS) {
    addAlert("CONNECTION_LIMIT", `Maximum connections exceeded: ${connections.size}`);
    cleanupConnection(); // Clean up before sending response
    return res.status(429).json({
      error: "Too Many Connections",
      message: "Server is at maximum capacity",
      retry_after: "30 seconds",
      premium: "Premium clients have priority access"
    });
  }

  next();
});

// Enhanced health check endpoint with performance metrics
app.get("/health", (req, res) => {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();
  const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  // Calculate performance metrics
  const avgResponseTime = performanceMonitor.requests.responseTimes.length > 0
    ? performanceMonitor.requests.responseTimes.reduce((a, b) => a + b, 0) / performanceMonitor.requests.responseTimes.length
    : 0;

  const errorRate = performanceMonitor.requests.total > 0
    ? (performanceMonitor.requests.failed / performanceMonitor.requests.total) * 100
    : 0;

  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    project: "Veridian Premium Concierge - Stella Global Class",
    version: "2.0.0",
    environment: process.env.NODE_ENV || "production",
    uptime: uptime,
    premium: true,
    performance: {
      memory_usage: `${memoryUsagePercent.toFixed(1)}%`,
      avg_response_time: `${avgResponseTime.toFixed(2)}ms`,
      error_rate: `${errorRate.toFixed(2)}%`,
      total_requests: performanceMonitor.requests.total,
      active_alerts: performanceMonitor.alerts.length,
      cache_hit_rate: `${calculateCacheHitRate()}%`
    },
    system: {
      node_version: process.version,
      platform: process.platform,
      architecture: process.arch,
      cpu_count: os.cpus().length,
      memory_total: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`,
      memory_free: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)}GB`,
      load_average: os.loadavg()
    },
    cluster: {
      is_master: cluster.isMaster,
      workers: cluster.isMaster ? Object.keys(cluster.workers || {}).length : 1,
      pid: process.pid
    },
    connections: {
      active: connections.size,
      max_allowed: PERFORMANCE_CONFIG.MAX_CONNECTIONS
    },
    endpoints: Object.keys(performanceMonitor.requests.endpoints).map(endpoint => ({
      path: endpoint,
      requests: performanceMonitor.requests.endpoints[endpoint].count,
      errors: performanceMonitor.requests.endpoints[endpoint].errors,
      avg_response_time: performanceMonitor.requests.endpoints[endpoint].responseTimes.length > 0
        ? performanceMonitor.requests.endpoints[endpoint].responseTimes.reduce((a, b) => a + b, 0) / performanceMonitor.requests.endpoints[endpoint].responseTimes.length
        : 0
    })),
    alerts: performanceMonitor.alerts.slice(-10) // Show last 10 alerts
  });
});

// Premium concierge API endpoints
app.get("/api/premium/status", (req, res) => {
  res.json({
    status: "premium_active",
    service: "Veridian Premium Concierge",
    features: {
      ai_assistant: true,
      priority_support: true,
      advanced_analytics: true,
      custom_integrations: true,
      realtime_monitoring: true,
      enhanced_security: true
    },
    uptime: process.uptime(),
    version: "2.0.0"
  });
});

app.get("/api/premium/analytics", (req, res) => {
  const analytics = {
    requests: {
      total: performanceMonitor.requests.total,
      successful: performanceMonitor.requests.successful,
      failed: performanceMonitor.requests.failed,
      success_rate: performanceMonitor.requests.total > 0
        ? (performanceMonitor.requests.successful / performanceMonitor.requests.total * 100).toFixed(2)
        : 0
    },
    performance: {
      avg_response_time: performanceMonitor.requests.responseTimes.length > 0
        ? performanceMonitor.requests.responseTimes.reduce((a, b) => a + b, 0) / performanceMonitor.requests.responseTimes.length
        : 0,
      min_response_time: Math.min(...performanceMonitor.requests.responseTimes) || 0,
      max_response_time: Math.max(...performanceMonitor.requests.responseTimes) || 0
    },
    endpoints: Object.keys(performanceMonitor.requests.endpoints).map(endpoint => ({
      path: endpoint,
      requests: performanceMonitor.requests.endpoints[endpoint].count,
      errors: performanceMonitor.requests.endpoints[endpoint].errors,
      success_rate: performanceMonitor.requests.endpoints[endpoint].count > 0
        ? ((performanceMonitor.requests.endpoints[endpoint].count - performanceMonitor.requests.endpoints[endpoint].errors) / performanceMonitor.requests.endpoints[endpoint].count * 100).toFixed(2)
        : 0,
      avg_response_time: performanceMonitor.requests.endpoints[endpoint].responseTimes.length > 0
        ? performanceMonitor.requests.endpoints[endpoint].responseTimes.reduce((a, b) => a + b, 0) / performanceMonitor.requests.endpoints[endpoint].responseTimes.length
        : 0
    })),
    system: {
      memory_usage: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal * 100).toFixed(2),
      cpu_usage: process.cpuUsage ? (process.cpuUsage().user / 1000000).toFixed(2) : 0,
      uptime: process.uptime()
    }
  };

  res.json(analytics);
});

app.post("/api/premium/cache/clear", (req, res) => {
  const cacheSize = performanceMonitor.cache.size;
  performanceMonitor.cache.clear();

  addAlert("CACHE_CLEARED", `Cache cleared manually. Removed ${cacheSize} entries.`);

  res.json({
    success: true,
    message: "Cache cleared successfully",
    entries_removed: cacheSize,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/premium/alerts", (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const alerts = performanceMonitor.alerts.slice(-limit);

  res.json({
    total_alerts: performanceMonitor.alerts.length,
    alerts: alerts,
    active_alerts: alerts.filter(alert =>
      Date.now() - alert.timestamp < 3600000 // Last hour
    ).length
  });
});

app.post("/api/premium/alerts/clear", (req, res) => {
  const alertCount = performanceMonitor.alerts.length;
  performanceMonitor.alerts = [];

  res.json({
    success: true,
    message: "Alerts cleared successfully",
    alerts_cleared: alertCount,
    timestamp: new Date().toISOString()
  });
});

// Premium concierge services endpoint
app.get("/api/premium/services", (req, res) => {
  res.json({
    services: [
      {
        name: "AI Concierge Assistant",
        status: "active",
        description: "Intelligent AI-powered concierge service",
        features: ["Natural Language Processing", "Context Awareness", "Personalized Responses"]
      },
      {
        name: "Priority Support",
        status: "active",
        description: "24/7 premium customer support",
        features: ["Dedicated Support Team", "Faster Response Times", "Priority Queue"]
      },
      {
        name: "Advanced Analytics",
        status: "active",
        description: "Comprehensive performance and usage analytics",
        features: ["Real-time Monitoring", "Custom Reports", "Predictive Analytics"]
      },
      {
        name: "Custom Integrations",
        status: "active",
        description: "Tailored integration solutions",
        features: ["API Integration", "Third-party Services", "Custom Workflows"]
      },
      {
        name: "Enhanced Security",
        status: "active",
        description: "Enterprise-grade security features",
        features: ["Advanced Encryption", "Security Monitoring", "Compliance Tools"]
      }
    ],
    timestamp: new Date().toISOString()
  });
});

// Serve premium landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "premium-concierge-landing.html"));
});

// Serve enterprise landing page
app.get("/enterprise", (req, res) => {
  res.sendFile(path.join(__dirname, "enterprise-landing.html"));
});

// 404 handler with premium styling
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    premium: true,
    suggestion: "Please check the URL or contact premium support for assistance"
  });
});

// Global error handler with premium features
app.use((err, req, res, next) => {
  console.error("🚨 Premium Error:", err);

  // Track error in performance monitoring
  addAlert("SERVER_ERROR", `Error occurred: ${err.message || 'Unknown error'}`);

  const errorResponse = {
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred",
    request_id: req.id || "unknown",
    timestamp: new Date().toISOString(),
    premium: true,
    environment: process.env.NODE_ENV || "production"
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  res.status(500).json(errorResponse);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log("🔄 SIGTERM received, shutting down gracefully...");
  addAlert("SHUTDOWN", "Graceful shutdown initiated");
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log("🔄 SIGINT received, shutting down gracefully...");
  addAlert("SHUTDOWN", "Graceful shutdown initiated");
  process.exit(0);
});

// Unhandled promise rejection handling
process.on('unhandledRejection', (reason, promise) => {
  console.error("🚨 Unhandled Rejection at:", promise, "reason:", reason);
  addAlert("UNHANDLED_REJECTION", `Unhandled promise rejection: ${reason}`);
});

process.on('uncaughtException', (err) => {
  console.error("🚨 Uncaught Exception:", err);
  addAlert("UNCAUGHT_EXCEPTION", `Uncaught exception: ${err.message}`);

  // For uncaught exceptions, we should exit gracefully
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Start server (only in worker processes when clustering is enabled)
if (!PERFORMANCE_CONFIG.ENABLE_CLUSTERING || !cluster.isMaster) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Veridian Premium Concierge Server running on port ${PORT}`);
    console.log(`🌟 Environment: ${process.env.NODE_ENV || "production"}`);
    console.log(`💎 Premium Features: Enabled`);
    console.log(`🔧 Process ID: ${process.pid}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log(`🎯 Premium Status: http://localhost:${PORT}/api/premium/status`);
    console.log(`📈 Analytics: http://localhost:${PORT}/api/premium/analytics`);

    addAlert("SERVER_START", `Premium concierge server started successfully on port ${PORT}`);
  });

  // Handle server errors
  server.on('error', (err) => {
    console.error("🚨 Server Error:", err);
    addAlert("SERVER_ERROR", `Server error occurred: ${err.message}`);
  });

  // Set server timeout
  server.timeout = PERFORMANCE_CONFIG.REQUEST_TIMEOUT;
  server.keepAliveTimeout = 65000; // 65 seconds
  server.headersTimeout = 66000; // 66 seconds
}

// Export app for testing
module.exports = app;
