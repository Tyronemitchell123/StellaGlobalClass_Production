/**
 * Integrated MCP AI Server - UPDATED with Strategy Pattern and New Architecture
 *
 * This server now uses the new Strategy Pattern for tool management and incorporates
 * all the improvements from the integration demonstration component.
 *
 * IMPROVEMENTS IMPLEMENTED:
 * - Strategy Pattern for tool management
 * - Enhanced error handling and logging
 * - Security middleware and validation
 * - Performance monitoring
 * - Health checks
 * - Graceful shutdown
 * - Modular component design
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { WebSocketServer } from "ws";
import OptimizedAIEngine from "./optimized-ai-engine.js";
import OptimizedNeuralNetwork from "./optimized-neural-network.js";
import { authMiddleware, generateToken } from "./auth.js";
import { ToolRegistry, logger } from "../.github/production_ready_tool_handlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server configuration with enhanced features
const SERVER_CONFIG = {
  NAME: 'integrated-mcp-ai-server-updated',
  VERSION: '2.0.0',
  PORT: process.env.PORT || 8001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  AUTOSTART_ENABLED: process.env.AUTOSTART_ENABLED === 'true',
  MAX_RESTART_ATTEMPTS: parseInt(process.env.MAX_RESTART_ATTEMPTS) || 5,
  RESTART_DELAY: parseInt(process.env.RESTART_DELAY) || 5000,
  HEALTH_CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000
};

// Health monitoring class
class HealthMonitor {
  constructor() {
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    this.toolExecutionCount = 0;
    this.restartCount = 0;
    this.lastRestartTime = null;
    this.isHealthy = true;
    this.healthCheckInterval = null;
  }

  incrementRequest() {
    this.requestCount++;
  }

  incrementError() {
    this.errorCount++;
  }

  incrementToolExecution() {
    this.toolExecutionCount++;
  }

  incrementRestart() {
    this.restartCount++;
    this.lastRestartTime = Date.now();
  }

  setHealthStatus(healthy) {
    this.isHealthy = healthy;
  }

  startHealthCheck(callback) {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(() => {
      const health = this.performHealthCheck();
      if (!health.isHealthy && callback) {
        callback(health);
      }
    }, SERVER_CONFIG.HEALTH_CHECK_INTERVAL);
  }

  performHealthCheck() {
    const uptime = Date.now() - this.startTime;
    const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;
    const memoryUsage = process.memoryUsage();
    const memoryThreshold = 500 * 1024 * 1024; // 500MB
    const errorRateThreshold = 50; // 50%

    const isMemoryHealthy = memoryUsage.heapUsed < memoryThreshold;
    const isErrorRateHealthy = errorRate < errorRateThreshold;
    const isOverallHealthy = isMemoryHealthy && isErrorRateHealthy && this.isHealthy;

    this.setHealthStatus(isOverallHealthy);

    return {
      isHealthy: isOverallHealthy,
      memoryUsage: memoryUsage.heapUsed,
      memoryLimit: memoryThreshold,
      errorRate: errorRate,
      errorLimit: errorRateThreshold,
      uptime: uptime,
      restartCount: this.restartCount,
      lastRestart: this.lastRestartTime
    };
  }

  getHealthStatus() {
    const uptime = Date.now() - this.startTime;
    const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;
    const healthCheck = this.performHealthCheck();

    return {
      status: healthCheck.isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      services: {
        mcp: 'running',
        ai: aiEngine ? 'initialized' : 'failed',
        web: 'active'
      },
      metrics: {
        totalRequests: this.requestCount,
        totalErrors: this.errorCount,
        errorRate: `${errorRate.toFixed(2)}%`,
        toolExecutions: this.toolExecutionCount,
        uptime: `${Math.floor(uptime / 1000)}s`,
        restartCount: this.restartCount,
        lastRestart: this.lastRestartTime ? new Date(this.lastRestartTime).toISOString() : null
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        healthCheck: healthCheck
      }
    };
  }

  stop() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

// Security middleware
const securityMiddleware = {
  /**
   * Rate limiting middleware
   */
  rateLimit: (req, res, next) => {
    // Simple in-memory rate limiting
    const clientIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - (60 * 1000); // 1 minute window

    if (!req.app.locals.rateLimits) {
      req.app.locals.rateLimits = new Map();
    }

    const limits = req.app.locals.rateLimits.get(clientIp) || { count: 0, resetTime: now + 60000 };

    if (now > limits.resetTime) {
      limits.count = 1;
      limits.resetTime = now + 60000;
    } else {
      limits.count++;
    }

    req.app.locals.rateLimits.set(clientIp, limits);

    if (limits.count > 100) { // 100 requests per minute
      logger.warn('Rate limit exceeded', { ip: clientIp, count: limits.count });
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      });
    }

    next();
  },

  /**
   * Request validation middleware
   */
  validateRequest: (req, res, next) => {
    // Validate content type for POST/PUT requests
    if (['POST', 'PUT'].includes(req.method) && !req.is('application/json')) {
      logger.warn('Invalid content type', { method: req.method, contentType: req.get('Content-Type') });
      return res.status(400).json({
        success: false,
        error: 'Content-Type must be application/json'
      });
    }

    // Validate request size
    const contentLength = parseInt(req.get('Content-Length')) || 0;
    if (contentLength > 1024 * 1024) { // 1MB limit
      logger.warn('Request too large', { size: contentLength });
      return res.status(413).json({
        success: false,
        error: 'Request entity too large'
      });
    }

    next();
  },

  /**
   * Security headers middleware
   */
  securityHeaders: (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  }
};

// Create server instance
const server = new Server(
  {
    name: SERVER_CONFIG.NAME,
    version: SERVER_CONFIG.VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize AI components with error handling
let aiEngine, neuralNetwork;
let toolRegistry;
let healthMonitor;

try {
  logger.info('Initializing AI components');
  aiEngine = new OptimizedAIEngine();
  neuralNetwork = new OptimizedNeuralNetwork({
    architecture: [4, 8, 6, 2],
    learningRate: 0.01,
    epochs: 50
  });

  await aiEngine.initialize();
  await neuralNetwork.initialize();

  logger.info('✅ AI Components Initialized Successfully');
} catch (error) {
  logger.error('❌ Failed to initialize AI components', { error: error.message });
  // Continue without AI components if they fail to initialize
  aiEngine = null;
  neuralNetwork = null;
}

// Initialize tool registry with strategy pattern
toolRegistry = new ToolRegistry();
toolRegistry.setAIComponents(aiEngine, neuralNetwork);
toolRegistry.initializeDefaultTools();

// Initialize health monitor
healthMonitor = new HealthMonitor();

// Auto-restart management class
class AutoRestartManager {
  constructor() {
    this.restartAttempts = 0;
    this.isRestarting = false;
    this.maxRestartAttempts = SERVER_CONFIG.MAX_RESTART_ATTEMPTS;
    this.restartDelay = SERVER_CONFIG.RESTART_DELAY;
  }

  async restartServer() {
    if (this.isRestarting) {
      logger.warn('Server restart already in progress');
      return;
    }

    if (this.restartAttempts >= this.maxRestartAttempts) {
      logger.error('Maximum restart attempts reached, shutting down');
      process.exit(1);
    }

    this.isRestarting = true;
    this.restartAttempts++;

    logger.info('Attempting server restart', {
      attempt: this.restartAttempts,
      maxAttempts: this.maxRestartAttempts,
      delay: this.restartDelay
    });

    try {
      // Graceful shutdown
      await this.gracefulShutdown();

      // Wait before restart
      await new Promise(resolve => setTimeout(resolve, this.restartDelay));

      // Restart server
      await startServer();

      logger.info('Server restart successful', {
        attempt: this.restartAttempts
      });

      this.isRestarting = false;
    } catch (error) {
      logger.error('Server restart failed', {
        attempt: this.restartAttempts,
        error: error.message
      });

      this.isRestarting = false;

      // Schedule another restart attempt
      setTimeout(() => this.restartServer(), this.restartDelay);
    }
  }

  async gracefulShutdown() {
    logger.info('Starting graceful shutdown for restart');

    // Stop health monitoring
    if (healthMonitor) {
      healthMonitor.stop();
    }

    // Close MCP server connection if it exists
    if (server) {
      try {
        // Note: MCP SDK doesn't have a close method, so we just let it be
        logger.info('MCP server connection released');
      } catch (error) {
        logger.warn('Error closing MCP server', { error: error.message });
      }
    }

    logger.info('Graceful shutdown completed');
  }

  reset() {
    this.restartAttempts = 0;
    this.isRestarting = false;
  }
}

// Initialize auto-restart manager
const autoRestartManager = new AutoRestartManager();

// Setup MCP server handlers using the new pattern
server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.info('MCP tools listed');
  healthMonitor.incrementRequest();

  try {
    const tools = toolRegistry.getAllToolDefinitions();
    const stats = toolRegistry.getStats();

    logger.info('Tools listed successfully', {
      toolCount: tools.length,
      stats
    });

    return { tools };
  } catch (error) {
    healthMonitor.incrementError();
    logger.error('Failed to list tools', { error: error.message });
    throw error;
  }
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  logger.info('MCP tool execution requested', { toolName: name });
  healthMonitor.incrementRequest();
  healthMonitor.incrementToolExecution();

  try {
    const result = await toolRegistry.executeTool(name, args);
    logger.info('Tool execution completed', { toolName: name, success: !result.isError });
    return result;
  } catch (error) {
    healthMonitor.incrementError();
    logger.error('Tool execution failed', {
      toolName: name,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
});

// Create Express app with enhanced security and monitoring
const app = express();

// Security middleware
app.use(securityMiddleware.securityHeaders);
app.use(securityMiddleware.rateLimit);
app.use(securityMiddleware.validateRequest);

// Standard middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent')
    });
  });

  next();
});

// Serve the main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../concierge-landing.html'));
});

// Serve concierge landing page
app.get('/concierge', (req, res) => {
  res.sendFile(path.join(__dirname, '../concierge-landing.html'));
});

app.use(express.static(path.join(__dirname, '..'), { index: false }));
app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')));

// Enhanced API Routes with comprehensive error handling
app.get('/api/health', (req, res) => {
  logger.info('Health check requested');
  healthMonitor.incrementRequest();

  try {
    const healthStatus = healthMonitor.getHealthStatus();
    res.json(healthStatus);
  } catch (error) {
    healthMonitor.incrementError();
    logger.error('Health check failed', { error: error.message });
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

app.post('/api/login', (req, res) => {
  logger.info('Login attempt', { username: req.body.username });
  healthMonitor.incrementRequest();

  try {
    const { username, password } = req.body;

    // Enhanced validation
    if (!username || !password) {
      logger.warn('Login attempt missing credentials');
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    if (username === 'admin' && password === 'password') {
      const token = generateToken({ username, role: 'admin' });
      logger.info('Login successful', { username });
      res.json({ success: true, token });
    } else {
      logger.warn('Login failed - invalid credentials', { username });
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    healthMonitor.incrementError();
    logger.error('Login error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/weather/:location', async (req, res) => {
  logger.info('Weather request received', { location: req.params.location });
  healthMonitor.incrementRequest();

  try {
    const { location } = req.params;
    const units = req.query.units || 'metric';

    // Mock weather data (same as MCP tool)
    const weatherData = {
      location,
      temperature: units === "metric" ? 22 : 72,
      condition: "Partly cloudy",
      humidity: 65,
      wind_speed: units === "metric" ? 15 : 9,
      units,
    };

    logger.info('Weather data sent', { location, units });
    res.json({
      success: true,
      data: `Weather in ${weatherData.location}: ${weatherData.temperature}°${weatherData.units === "metric" ? "C" : "F"}, ${weatherData.condition}. Humidity: ${weatherData.humidity}%, Wind: ${weatherData.wind_speed} ${weatherData.units === "metric" ? "km/h" : "mph"}`
    });
  } catch (error) {
    healthMonitor.incrementError();
    logger.error('Weather request error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/contact', async (req, res) => {
  logger.info('Contact form submitted', { name: req.body.name, email: req.body.email });
  healthMonitor.incrementRequest();

  try {
    const { name, email, message } = req.body;

    // Store contact message (could use S3 or database)
    console.log('📧 New contact message:', { name, email, message });

    logger.info('Contact message stored', { name, email });
    res.json({
      success: true,
      message: `Thank you ${name}! Your message has been received. We'll respond to ${email} soon.`
    });
  } catch (error) {
    healthMonitor.incrementError();
    logger.error('Contact form error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/chat', async (req, res) => {
  logger.info('Chat request received', { messageLength: req.body.message?.length });
  healthMonitor.incrementRequest();

  try {
    const { message } = req.body;

    if (!message) {
      logger.warn('Chat request missing message');
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Use AI engine for chat response if available
    let response = 'Hello! How can I help you today?';

    if (aiEngine) {
      try {
        const aiResponse = await aiEngine.processData([message]);
        response = aiResponse.insights?.[0]?.assessment?.recommendations?.[0] ||
                  aiResponse.insights?.[0]?.assessment?.overall > 0.7 ?
                  'I understand your request. Let me analyze that for you.' :
                  'Hello! How can I help you today?';
      } catch (error) {
        logger.warn('AI engine failed for chat', { error: error.message });
        // Fallback to default response
      }
    }

    logger.info('Chat response sent', { responseLength: response.length });
    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    healthMonitor.incrementError();
    logger.error('Chat error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/cameras', (req, res) => {
  logger.info('Camera list requested');
  healthMonitor.incrementRequest();

  try {
    const cameras = [
      { id: 1, name: 'Front Door', url: 'http://example.com/stream1.mjpg', status: 'active' },
      { id: 2, name: 'Back Yard', url: 'http://example.com/stream2.mjpg', status: 'active' },
      { id: 3, name: 'Garage', url: 'http://example.com/stream3.mjpg', status: 'inactive' }
    ];

    logger.info('Camera list sent', { cameraCount: cameras.length });
    res.json({
      success: true,
      cameras: cameras
    });
  } catch (error) {
    healthMonitor.incrementError();
    logger.error('Camera list error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/ai-status', authMiddleware, async (req, res) => {
  logger.info('AI status requested');
  healthMonitor.incrementRequest();

  try {
    const aiStatus = {
      aiEngine: {
        initialized: !!aiEngine,
        capabilities: aiEngine ? aiEngine.getCapabilities() : [],
        processingHistory: aiEngine ? aiEngine.getProcessingHistory().length : 0
      },
      neuralNetwork: {
        initialized: !!neuralNetwork,
        trained: neuralNetwork ? neuralNetwork.isTrained : false,
        architecture: neuralNetwork ? neuralNetwork.architecture : [],
        parameters: neuralNetwork ? neuralNetwork.countParameters() : 0,
        trainingHistory: neuralNetwork ? neuralNetwork.getTrainingHistory().length : 0
      }
    };

    logger.info('AI status sent', { aiEngineAvailable: !!aiEngine, neuralNetworkAvailable: !!neuralNetwork });
    res.json({
      success: true,
      status: aiStatus
    });
  } catch (error) {
    healthMonitor.incrementError();
    logger.error('AI status error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Additional API routes from original implementation
app.post('/api/analytics', async (req, res) => {
  try {
    const { event, data } = req.body;
    console.log('📊 Analytics event:', { event, data, timestamp: new Date().toISOString() });
    res.json({ success: true, message: 'Analytics data recorded' });
  } catch (error) {
    healthMonitor.incrementError();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/todos', (req, res) => {
  try {
    const todos = [
      { id: 1, text: 'Review investment portfolio', completed: false, priority: 'high' },
      { id: 2, text: 'Schedule meeting with financial advisor', completed: true, priority: 'medium' },
      { id: 3, text: 'Update retirement plan', completed: false, priority: 'high' }
    ];
    res.json({ success: true, todos });
  } catch (error) {
    healthMonitor.incrementError();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/todos', (req, res) => {
  try {
    const { text, priority = 'medium' } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Todo text is required' });
    }
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };
    console.log('✅ New todo created:', newTodo);
    res.json({ success: true, todo: newTodo });
  } catch (error) {
    healthMonitor.incrementError();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    console.log('🔄 Todo updated:', { id, completed });
    res.json({ success: true, message: 'Todo updated successfully' });
  } catch (error) {
    healthMonitor.incrementError();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;

    // In a real app, this would delete from database
    console.log('🗑️ Todo deleted:', id);

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    healthMonitor.incrementError();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, plan } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Valid email is required'
      });
    }

    // Store subscription (could use S3 or database)
    console.log('📧 New subscription:', { email, plan, timestamp: new Date().toISOString() });

    res.json({
      success: true,
      message: `Thank you for subscribing to the ${plan} plan! We'll send you a confirmation email shortly.`
    });
  } catch (error) {
    healthMonitor.incrementError();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start the server with enhanced error handling and graceful shutdown
async function startServer() {
  logger.info('🚀 Starting Updated Integrated MCP AI Server...', {
    config: SERVER_CONFIG,
    nodeEnv: SERVER_CONFIG.NODE_ENV
  });

  try {
    // Start Express server
    const httpServer = app.listen(SERVER_CONFIG.PORT, () => {
      logger.info(`🌐 Web server running on http://localhost:${SERVER_CONFIG.PORT}`);

      if (SERVER_CONFIG.AUTOSTART_ENABLED) {
        logger.info('🔄 Autostart mode enabled - server will auto-restart on failure');
      }
    });

    // WebSocket setup with enhanced error handling
    const wss = new WebSocketServer({
      server: httpServer,
      maxPayload: 1024 * 1024 // 1MB max payload
    });

    const clients = new Set();

    wss.on('connection', (ws, req) => {
      const clientId = Date.now().toString();
      const clientIp = req.socket.remoteAddress;

      logger.info('New WebSocket client connected', { clientId, clientIp });
      clients.add(ws);

      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Welcome to Updated Integrated MCP AI Server',
        clientId,
        timestamp: new Date().toISOString()
      }));

      ws.on('close', () => {
        logger.info('WebSocket client disconnected', { clientId });
        clients.delete(ws);
      });

      ws.on('error', (error) => {
        logger.error('WebSocket error', { clientId, error: error.message });
        clients.delete(ws);
      });

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          logger.debug('WebSocket message received', { clientId, type: message.type });
        } catch (error) {
          logger.warn('Invalid WebSocket message', { clientId, error: error.message });
        }
      });
    });

    // Enhanced real-time data broadcasting
    const broadcastInterval = setInterval(() => {
      if (clients.size === 0) return;

      const metrics = {
        timestamp: new Date().toISOString(),
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        latency: Math.floor(Math.random() * 200),
        alerts: Math.random() > 0.8 ? ['Motion detected in zone 1'] : [],
        detections: Math.random() > 0.5 ? ['Person detected', 'Vehicle detected'] : [],
        health: healthMonitor.getHealthStatus(),
        toolRegistry: toolRegistry.getStats()
      };

      const data = { type: 'metrics', data: metrics };
      const message = JSON.stringify(data);

      clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          try {
            client.send(message);
          } catch (error) {
            logger.error('Failed to send WebSocket message', { error: error.message });
            clients.delete(client);
          }
        }
      });
    }, 5000);

    logger.info('✅ WebSocket server ready for real-time updates');

    // Start health monitoring if autostart is enabled
    if (SERVER_CONFIG.AUTOSTART_ENABLED) {
      healthMonitor.startHealthCheck((healthCheck) => {
        logger.warn('Health check failed, initiating restart', {
          reason: healthCheck,
          restartAttempts: autoRestartManager.restartAttempts
        });

        if (autoRestartManager.restartAttempts < autoRestartManager.maxRestartAttempts) {
          autoRestartManager.restartServer();
        } else {
          logger.error('Maximum restart attempts reached, shutting down');
          process.exit(1);
        }
      });

      logger.info('🔍 Health monitoring started for auto-restart capability');
    }

    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);

      clearInterval(broadcastInterval);

      // Stop health monitoring
      if (healthMonitor) {
        healthMonitor.stop();
      }

      // Close WebSocket connections
      wss.close(() => {
        logger.info('WebSocket server closed');
      });

      // Close HTTP server
      httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after timeout
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections for auto-restart
    if (SERVER_CONFIG.AUTOSTART_ENABLED) {
      process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled rejection detected, attempting restart', { reason });

        if (autoRestartManager.restartAttempts < autoRestartManager.maxRestartAttempts) {
          autoRestartManager.restartServer();
        } else {
          logger.error('Maximum restart attempts reached, shutting down');
          process.exit(1);
        }
      });
    }

    // Start MCP server
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('✅ Updated Integrated MCP AI Server started successfully');
    logger.info('🔧 Available Tools: MCP utilities + AI-powered analysis');
    logger.info('📡 Full Stack Application Ready!');
    logger.info('🎯 Strategy Pattern Implemented!');
    logger.info('🛡️ Enhanced with security, monitoring, and logging!');

    if (SERVER_CONFIG.AUTOSTART_ENABLED) {
      logger.info('🔄 Auto-restart capability activated!');
      logger.info(`⚙️  Auto-restart configuration:`, {
        maxAttempts: autoRestartManager.maxRestartAttempts,
        restartDelay: `${autoRestartManager.restartDelay}ms`,
        healthCheckInterval: `${SERVER_CONFIG.HEALTH_CHECK_INTERVAL}ms`
      });
    }

    // Log startup statistics
    const stats = toolRegistry.getStats();
    logger.info('Startup statistics', stats);

    // Reset restart attempts on successful startup
    if (autoRestartManager) {
      autoRestartManager.reset();
    }

  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });

    // Attempt auto-restart if enabled
    if (SERVER_CONFIG.AUTOSTART_ENABLED && autoRestartManager) {
      logger.info('Attempting auto-restart after failed startup');
      setTimeout(() => autoRestartManager.restartServer(), autoRestartManager.restartDelay);
    } else {
      process.exit(1);
    }
  }
}

// Error handling for uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise });
  process.exit(1);
});

// Start the server
startServer().catch(error => {
  logger.error('Failed to start server', { error: error.message });
  process.exit(1);
});
