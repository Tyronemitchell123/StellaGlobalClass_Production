/**
 * Multi-Domain MCP Server with White-label Support
 * Extends the production-ready server with domain-specific branding and features
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
import OptimizedAIEngine from "../src/optimized-ai-engine.js";
import OptimizedNeuralNetwork from "../src/optimized-neural-network.js";
import { authMiddleware, generateToken } from "../src/auth.js";

// Import multi-domain configuration
const {
  domainConfigs,
  domainMiddleware,
  generateBrandedContent,
  generateIndexPage,
  generateSubscriptionPage,
  generateDashboardConfig
} = require("./multi-domain-config.js");

// Import production-ready tool registry and utilities
import { ToolRegistry, logger } from "./production_ready_tool_handlers.js";

// Weather constants for API responses
const WEATHER_CONSTANTS = {
  METRIC: {
    DEFAULT_TEMP: 22,
    DEFAULT_WIND_SPEED: 15,
    UNIT: 'C',
    SPEED_UNIT: 'km/h'
  },
  IMPERIAL: {
    DEFAULT_TEMP: 72,
    DEFAULT_WIND_SPEED: 9,
    UNIT: 'F',
    SPEED_UNIT: 'mph'
  },
  DEFAULT_CONDITION: 'Partly cloudy',
  DEFAULT_HUMIDITY: 65
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server configuration constants
const SERVER_CONFIG = {
  NAME: 'multi-domain-mcp-ai-server',
  VERSION: '2.0.0',
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// AI component configuration
const AI_CONFIG = {
  NEURAL_NETWORK: {
    ARCHITECTURE: [4, 8, 6, 2],
    LEARNING_RATE: 0.01,
    EPOCHS: 50
  }
};

// Enhanced security middleware for multi-domain support
const securityMiddleware = {
  /**
   * Rate limiting middleware
   */
  rateLimit: (req, res, next) => {
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
      logger.warn('Rate limit exceeded', { 
        ip: clientIp, 
        count: limits.count,
        domain: req.headers.host
      });
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
      logger.warn('Invalid content type', { 
        method: req.method, 
        contentType: req.get('Content-Type'),
        domain: req.headers.host
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Content-Type must be application/json' 
      });
    }
    
    // Validate request size
    const contentLength = parseInt(req.get('Content-Length')) || 0;
    if (contentLength > 1024 * 1024) { // 1MB limit
      logger.warn('Request too large', { 
        size: contentLength,
        domain: req.headers.host
      });
      return res.status(413).json({ 
        success: false, 
        error: 'Request entity too large' 
      });
    }
    
    next();
  },

  /**
   * Security headers middleware with domain-specific CSP
   */
  securityHeaders: (req, res, next) => {
    const domain = req.headers.host || 'localhost:3001';
    const config = domainConfigs[domain] || domainConfigs['localhost:3001'];
    
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Domain-specific Content Security Policy
    const csp = `default-src 'self'; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; connect-src 'self' wss: ws:;`;
    res.setHeader('Content-Security-Policy', csp);
    
    next();
  }
};

// Enhanced health monitoring with domain tracking
class HealthMonitor {
  constructor() {
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    this.toolExecutionCount = 0;
    this.domainMetrics = new Map();
    this.metrics = {
      cpu: 0,
      memory: 0,
      uptime: 0
    };
  }

  incrementRequest(domain) {
    this.requestCount++;
    const domainMetric = this.domainMetrics.get(domain) || { requests: 0, errors: 0 };
    domainMetric.requests++;
    this.domainMetrics.set(domain, domainMetric);
  }

  incrementError(domain) {
    this.errorCount++;
    const domainMetric = this.domainMetrics.get(domain) || { requests: 0, errors: 0 };
    domainMetric.errors++;
    this.domainMetrics.set(domain, domainMetric);
  }

  incrementToolExecution() {
    this.toolExecutionCount++;
  }

  getHealthStatus() {
    const uptime = Date.now() - this.startTime;
    const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      services: {
        mcp: 'running',
        ai: 'initialized',
        web: 'active',
        multiDomain: 'enabled'
      },
      metrics: {
        totalRequests: this.requestCount,
        totalErrors: this.errorCount,
        errorRate: `${errorRate.toFixed(2)}%`,
        toolExecutions: this.toolExecutionCount,
        uptime: `${Math.floor(uptime / 1000)}s`,
        activeDomains: this.domainMetrics.size,
        domainBreakdown: Object.fromEntries(this.domainMetrics)
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
  }
}

// Create health monitor instance
const healthMonitor = new HealthMonitor();

// PAYG usage tracking with domain separation
let paygUsage = {
  aiQueries: 0,
  cameraMinutes: 0,
  lastReset: new Date(),
  domainUsage: new Map()
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

try {
  logger.info('Initializing AI components');
  aiEngine = new OptimizedAIEngine();
  neuralNetwork = new OptimizedNeuralNetwork(AI_CONFIG.NEURAL_NETWORK);
  
  await aiEngine.initialize();
  await neuralNetwork.initialize();
  
  logger.info('AI components initialized successfully');
} catch (error) {
  logger.error('Failed to initialize AI components', { error: error.message });
  // Continue without AI components if they fail to initialize
  aiEngine = null;
  neuralNetwork = null;
}

// Create and configure the tool registry
const toolRegistry = new ToolRegistry();
toolRegistry.setAIComponents(aiEngine, neuralNetwork);
toolRegistry.initializeDefaultTools();

// Enhanced tool execution with monitoring
server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.info('Listing available tools');
  healthMonitor.incrementRequest('system');
  
  try {
    const tools = toolRegistry.getAllToolDefinitions();
    const stats = toolRegistry.getStats();
    
    logger.info('Tools listed successfully', { 
      toolCount: tools.length,
      stats 
    });
    
    return { tools };
  } catch (error) {
    healthMonitor.incrementError('system');
    logger.error('Failed to list tools', { error: error.message });
    throw error;
  }
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  logger.info('Tool execution requested', { toolName: name });
  healthMonitor.incrementRequest('system');
  healthMonitor.incrementToolExecution();
  
  try {
    const result = await toolRegistry.executeTool(name, args);
    logger.info('Tool execution completed', { toolName: name, success: !result.isError });
    return result;
  } catch (error) {
    healthMonitor.incrementError('system');
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
    const domain = req.headers.host || 'localhost:3001';
    logger.info('HTTP request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      domain
    });
  });
  
  next();
});

// Multi-domain middleware
app.use(domainMiddleware);

// Dynamic domain-specific routes
app.get('/', (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Serving domain-specific main page', { domain, business: config.business.name });
  healthMonitor.incrementRequest(domain);
  
  // Generate branded index page
  const brandedContent = generateBrandedContent(config, 'index');
  res.send(brandedContent);
});

app.use(express.static(path.join(__dirname, '..'), { index: false }));
app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')));

// Enhanced API Routes with domain-specific features
app.get('/api/health', (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  logger.info('Health check requested', { domain });
  healthMonitor.incrementRequest(domain);
  
  try {
    const healthStatus = healthMonitor.getHealthStatus();
    res.json(healthStatus);
  } catch (error) {
    healthMonitor.incrementError(domain);
    logger.error('Health check failed', { error: error.message, domain });
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

app.get('/subscription.html', (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Serving domain-specific subscription page', { domain, business: config.business.name });
  healthMonitor.incrementRequest(domain);
  
  // Generate branded subscription page
  const brandedContent = generateBrandedContent(config, 'subscription');
  res.send(brandedContent);
});

app.post('/api/login', (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Login attempt', { 
    username: req.body.username, 
    domain, 
    business: config.business.name 
  });
  healthMonitor.incrementRequest(domain);
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      logger.warn('Login attempt missing credentials', { domain });
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }
    
    if (username === 'admin' && password === 'password') {
      const token = generateToken({ username, role: 'admin', domain, business: config.business.name });
      logger.info('Login successful', { username, domain });
      res.json({ success: true, token });
    } else {
      logger.warn('Login failed - invalid credentials', { username, domain });
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    healthMonitor.incrementError(domain);
    logger.error('Login error', { error: error.message, domain });
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

app.post('/api/chat', async (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Chat request received', { 
    messageLength: req.body.message?.length, 
    domain, 
    business: config.business.name 
  });
  healthMonitor.incrementRequest(domain);
  
  try {
    const { message } = req.body;
    
    if (!message) {
      logger.warn('Chat request missing message', { domain });
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }
    
    // Check if AI chat is enabled for this domain
    if (!config.features.aiChat) {
      logger.warn('AI chat feature disabled for domain', { domain });
      return res.status(403).json({ 
        success: false, 
        error: 'AI chat feature is not available for this domain' 
      });
    }
    
    // Use AI engine for chat response if available
    let response = `Hello! I'm ${config.business.name}'s AI assistant. How can I help you today?`;
    
    if (aiEngine) {
      try {
        const aiResponse = await aiEngine.processData([message]);
        response = aiResponse.insights?.[0]?.assessment?.recommendations?.[0] || 
                  aiResponse.insights?.[0]?.assessment?.overall > 0.7 ? 
                  `I understand your request. Let me analyze that for you as ${config.business.name}'s AI assistant.` : 
                  `Hello! I'm ${config.business.name}'s AI assistant. How can I help you today?`;
      } catch (error) {
        logger.warn('AI engine failed for chat', { error: error.message, domain });
        // Fallback to domain-specific default response
      }
    }
    
    logger.info('Chat response sent', { responseLength: response.length, domain });
    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    healthMonitor.incrementError(domain);
    logger.error('Chat error', { error: error.message, domain });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/cameras', (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Camera list requested', { domain, business: config.business.name });
  healthMonitor.incrementRequest(domain);
  
  try {
    if (!config.features.cameraBot) {
      logger.warn('Camera bot feature disabled for domain', { domain });
      return res.status(403).json({ 
        success: false, 
        error: 'Camera features are not available for this domain' 
      });
    }
    
    const cameras = [
      { id: 1, name: `${config.business.name} Main Entrance`, url: 'http://example.com/stream1.mjpg', status: 'active' },
      { id: 2, name: `${config.business.name} Secondary Entrance`, url: 'http://example.com/stream2.mjpg', status: 'active' },
      { id: 3, name: `${config.business.name} Monitoring Room`, url: 'http://example.com/stream3.mjpg', status: 'inactive' }
    ];
    
    logger.info('Camera list sent', { cameraCount: cameras.length, domain });
    res.json({
      success: true,
      cameras: cameras
    });
  } catch (error) {
    healthMonitor.incrementError(domain);
    logger.error('Camera list error', { error: error.message, domain });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/weather/:location', async (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Weather request received', { 
    location: req.params.location, 
    domain, 
    business: config.business.name 
  });
  healthMonitor.incrementRequest(domain);
  
  try {
    if (!config.features.weather) {
      logger.warn('Weather feature disabled for domain', { domain });
      return res.status(403).json({ 
        success: false, 
        error: 'Weather features are not available for this domain' 
      });
    }
    
    const { location } = req.params;
    const units = req.query.units || 'metric';

    const weatherData = {
      location,
      temperature: units === "metric" ? 22 : 72,
      condition: "Partly cloudy",
      humidity: 65,
      wind_speed: units === "metric" ? 15 : 9,
      units,
    };

    const unitSystem = units === "metric" ? WEATHER_CONSTANTS.METRIC : WEATHER_CONSTANTS.IMPERIAL;
    const responseText = `Weather in ${weatherData.location}: ${weatherData.temperature}°${unitSystem.UNIT}, ${weatherData.condition}. Humidity: ${weatherData.humidity}%, Wind: ${weatherData.wind_speed} ${unitSystem.SPEED_UNIT}`;

    logger.info('Weather data sent', { location, units, domain });
    res.json({
      success: true,
      data: responseText
    });
  } catch (error) {
    healthMonitor.incrementError(domain);
    logger.error('Weather request error', { error: error.message, domain });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/contact', async (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Contact form submitted', { 
    name: req.body.name, 
    email: req.body.email, 
    domain, 
    business: config.business.name 
  });
  healthMonitor.incrementRequest(domain);
  
  try {
    const { name, email, message } = req.body;

    console.log('📧 New contact message:', { 
      name, 
      email, 
      message, 
      domain, 
      business: config.business.name 
    });

    logger.info('Contact message stored', { name, email, domain });
    res.json({
      success: true,
      message: `Thank you ${name}! Your message has been received by ${config.business.name}. We'll respond to ${email} soon.`
    });
  } catch (error) {
    healthMonitor.incrementError(domain);
    logger.error('Contact form error', { error: error.message, domain });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/ai-status', authMiddleware, async (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('AI status requested', { domain, business: config.business.name });
  healthMonitor.incrementRequest(domain);
  
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
      },
      domain: {
        name: config.business.name,
        enabledFeatures: config.features
      }
    };

    logger.info('AI status sent', { 
      aiEngineAvailable: !!aiEngine, 
      neuralNetworkAvailable: !!neuralNetwork,
      domain 
    });
    res.json({
      success: true,
      status: aiStatus
    });
  } catch (error) {
    healthMonitor.incrementError(domain);
    logger.error('AI status error', { error: error.message, domain });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/dashboard-config', (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Dashboard config requested', { domain, business: config.business.name });
  healthMonitor.incrementRequest(domain);
  
  try {
    const dashboardConfig = generateDashboardConfig(config);
    
    logger.info('Dashboard config sent', { domain });
    res.json({
      success: true,
      config: dashboardConfig
    });
  } catch (error) {
    healthMonitor.incrementError(domain);
    logger.error('Dashboard config error', { error: error.message, domain });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Enhanced server startup with graceful shutdown
async function startServer() {
  logger.info('🚀 Starting Multi-Domain MCP AI Server...', {
    config: SERVER_CONFIG,
    nodeEnv: SERVER_CONFIG.NODE_ENV,
    availableDomains: Object.keys(domainConfigs)
  });

  try {
    // Start Express server
    const httpServer = app.listen(SERVER_CONFIG.PORT, () => {
      logger.info(`🌐 Multi-domain web server running on http://localhost:${SERVER_CONFIG.PORT}`);
      logger.info('📋 Available domains:', Object.keys(domainConfigs).join(', '));
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
      const domain = req.headers.host || 'localhost:3001';
      
      logger.info('New WebSocket client connected', { clientId, clientIp, domain });
      clients.add(ws);
      
      ws.send(JSON.stringify({ 
        type: 'connected', 
        message: `Welcome to ${domainConfigs[domain]?.business.name || 'Veridian'} Concierge Console`,
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

      // Simulate camera detection events
      if (Math.random() > 0.7) { // 30% chance to send detection
        const detections = ['person', 'vehicle', 'motion'];
        const randomDetection = detections[Math.floor(Math.random() * detections.length)];
        const detectionData = {
          type: 'camera-detection',
          detection: {
            type: randomDetection,
            confidence: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
            timestamp: new Date().toISOString(),
            position: { x: Math.floor(Math.random() * 640), y: Math.floor(Math.random() * 480) }
          }
        };
        const detectionMessage = JSON.stringify(detectionData);
        clients.forEach(client => {
          if (client.readyState === client.OPEN) {
            try {
              client.send(detectionMessage);
            } catch (error) {
/**
 * Multi-Domain MCP Server with White-label Support
 * Extends the production-ready server with domain-specific branding and features
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
import OptimizedAIEngine from "../src/optimized-ai-engine.js";
import OptimizedNeuralNetwork from "../src/optimized-neural-network.js";
import { authMiddleware, generateToken } from "../src/auth.js";

// Import multi-domain configuration
const {
  domainConfigs,
  domainMiddleware,
  generateBrandedContent,
  generateIndexPage,
  generateSubscriptionPage,
  generateDashboardConfig
} = require("./multi-domain-config.js");

// Import production-ready tool registry and utilities
import { ToolRegistry, logger } from "./production_ready_tool_handlers.js";

// Weather constants for API responses
const WEATHER_CONSTANTS = {
  METRIC: {
    DEFAULT_TEMP: 22,
    DEFAULT_WIND_SPEED: 15,
    UNIT: 'C',
    SPEED_UNIT: 'km/h'
  },
  IMPERIAL: {
    DEFAULT_TEMP: 72,
    DEFAULT_WIND_SPEED: 9,
    UNIT: 'F',
    SPEED_UNIT: 'mph'
  },
  DEFAULT_CONDITION: 'Partly cloudy',
  DEFAULT_HUMIDITY: 65
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server configuration constants
const SERVER_CONFIG = {
  NAME: 'multi-domain-mcp-ai-server',
  VERSION: '2.0.0',
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// AI component configuration
const AI_CONFIG = {
  NEURAL_NETWORK: {
    ARCHITECTURE: [4, 8, 6, 2],
    LEARNING_RATE: 0.01,
    EPOCHS: 50
  }
};

// Enhanced security middleware for multi-domain support
const securityMiddleware = {
  /**
   * Rate limiting middleware
   */
  rateLimit: (req, res, next) => {
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
      logger.warn('Rate limit exceeded', { 
        ip: clientIp, 
        count: limits.count,
        domain: req.headers.host
      });
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
      logger.warn('Invalid content type', { 
        method: req.method, 
        contentType: req.get('Content-Type'),
        domain: req.headers.host
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Content-Type must be application/json' 
      });
    }
    
    // Validate request size
    const contentLength = parseInt(req.get('Content-Length')) || 0;
    if (contentLength > 1024 * 1024) { // 1MB limit
      logger.warn('Request too large', { 
        size: contentLength,
        domain: req.headers.host
      });
      return res.status(413).json({ 
        success: false, 
        error: 'Request entity too large' 
      });
    }
    
    next();
  },

  /**
   * Security headers middleware with domain-specific CSP
   */
  securityHeaders: (req, res, next) => {
    const domain = req.headers.host || 'localhost:3001';
    const config = domainConfigs[domain] || domainConfigs['localhost:3001'];
    
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Domain-specific Content Security Policy
    const csp = `default-src 'self'; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; connect-src 'self' wss: ws:;`;
    res.setHeader('Content-Security-Policy', csp);
    
    next();
  }
};

// Enhanced health monitoring with domain tracking
class HealthMonitor {
  constructor() {
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    this.toolExecutionCount = 0;
    this.domainMetrics = new Map();
    this.metrics = {
      cpu: 0,
      memory: 0,
      uptime: 0
    };
  }

  incrementRequest(domain) {
    this.requestCount++;
    const domainMetric = this.domainMetrics.get(domain) || { requests: 0, errors: 0 };
    domainMetric.requests++;
    this.domainMetrics.set(domain, domainMetric);
  }

  incrementError(domain) {
    this.errorCount++;
    const domainMetric = this.domainMetrics.get(domain) || { requests: 0, errors: 0 };
    domainMetric.errors++;
    this.domainMetrics.set(domain, domainMetric);
  }

  incrementToolExecution() {
    this.toolExecutionCount++;
  }

  getHealthStatus() {
    const uptime = Date.now() - this.startTime;
    const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      services: {
        mcp: 'running',
        ai: 'initialized',
        web: 'active',
        multiDomain: 'enabled'
      },
      metrics: {
        totalRequests: this.requestCount,
        totalErrors: this.errorCount,
        errorRate: `${errorRate.toFixed(2)}%`,
        toolExecutions: this.toolExecutionCount,
        uptime: `${Math.floor(uptime / 1000)}s`,
        activeDomains: this.domainMetrics.size,
        domainBreakdown: Object.fromEntries(this.domainMetrics)
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
  }
}

// Create health monitor instance
const healthMonitor = new HealthMonitor();

// PAYG usage tracking with domain separation
let paygUsage = {
  aiQueries: 0,
  cameraMinutes: 0,
  lastReset: new Date(),
  domainUsage: new Map()
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

try {
  logger.info('Initializing AI components');
  aiEngine = new OptimizedAIEngine();
  neuralNetwork = new OptimizedNeuralNetwork(AI_CONFIG.NEURAL_NETWORK);
  
  await aiEngine.initialize();
  await neuralNetwork.initialize();
  
  logger.info('AI components initialized successfully');
} catch (error) {
  logger.error('Failed to initialize AI components', { error: error.message });
  // Continue without AI components if they fail to initialize
  aiEngine = null;
  neuralNetwork = null;
}

// Create and configure the tool registry
const toolRegistry = new ToolRegistry();
toolRegistry.setAIComponents(aiEngine, neuralNetwork);
toolRegistry.initializeDefaultTools();

// Enhanced tool execution with monitoring
server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.info('Listing available tools');
  healthMonitor.incrementRequest('system');
  
  try {
    const tools = toolRegistry.getAllToolDefinitions();
    const stats = toolRegistry.getStats();
    
    logger.info('Tools listed successfully', { 
      toolCount: tools.length,
      stats 
    });
    
    return { tools };
  } catch (error) {
    healthMonitor.incrementError('system');
    logger.error('Failed to list tools', { error: error.message });
    throw error;
  }
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  logger.info('Tool execution requested', { toolName: name });
  healthMonitor.incrementRequest('system');
  healthMonitor.incrementToolExecution();
  
  try {
    const result = await toolRegistry.executeTool(name, args);
    logger.info('Tool execution completed', { toolName: name, success: !result.isError });
    return result;
  } catch (error) {
    healthMonitor.incrementError('system');
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
    const domain = req.headers.host || 'localhost:3001';
    logger.info('HTTP request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      domain
    });
  });
  
  next();
});

// Multi-domain middleware
app.use(domainMiddleware);

// Dynamic domain-specific routes
app.get('/', (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Serving domain-specific main page', { domain, business: config.business.name });
  healthMonitor.incrementRequest(domain);
  
  // Generate branded index page
  const brandedContent = generateBrandedContent(config, 'index');
  res.send(brandedContent);
});

app.use(express.static(path.join(__dirname, '..'), { index: false }));
app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')));

// Enhanced API Routes with domain-specific features
app.get('/api/health', (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  logger.info('Health check requested', { domain });
  healthMonitor.incrementRequest(domain);
  
  try {
    const healthStatus = healthMonitor.getHealthStatus();
    res.json(healthStatus);
  } catch (error) {
    healthMonitor.incrementError(domain);
    logger.error('Health check failed', { error: error.message, domain });
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

app.get('/subscription.html', (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Serving domain-specific subscription page', { domain, business: config.business.name });
  healthMonitor.incrementRequest(domain);
  
  // Generate branded subscription page
  const brandedContent = generateBrandedContent(config, 'subscription');
  res.send(brandedContent);
});

app.post('/api/login', (req, res) => {
  const domain = req.headers.host || 'localhost:3001';
  const config = req.domainConfig;
  
  logger.info('Login attempt', { 
    username: req.body.username, 
    domain, 
    business: config.business.name 
  });
  healthMonitor.incrementRequest(domain);
  
  try {
    const { username, password } = req.body;
    
    if (!username || !
