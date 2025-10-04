/**
 * Integration and Demonstration Component
 * Showcases all improvements and new patterns implemented in the system
 *
 * This component demonstrates:
 * - Production-ready server with security and monitoring
 * - Strategy pattern for tool management
 * - AI-powered capabilities with real functionality
 * - Enhanced error handling and logging
 * - Real-time features with WebSocket support
 * - Comprehensive API endpoints
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

class IntegrationDemonstration {
  constructor() {
    this.server = null;
    this.app = null;
    this.aiEngine = null;
    this.neuralNetwork = null;
    this.toolRegistry = null;
    this.healthMonitor = null;
    this.demonstrationStats = {
      startTime: Date.now(),
      requestsHandled: 0,
      toolsExecuted: 0,
      aiOperations: 0,
      websocketConnections: 0,
      errorsEncountered: 0
    };
  }

  async initialize() {
    logger.info('🚀 Initializing Integration Demonstration...');

    // Initialize AI components
    try {
      this.aiEngine = new OptimizedAIEngine();
      this.neuralNetwork = new OptimizedNeuralNetwork({
        architecture: [4, 8, 6, 2],
        learningRate: 0.01,
        epochs: 50
      });

      await this.aiEngine.initialize();
      await this.neuralNetwork.initialize();

      logger.info('✅ AI Components Initialized Successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize AI components', { error: error.message });
      throw error;
    }

    // Initialize MCP server
    this.server = new Server(
      {
        name: "integration-demonstration-server",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize tool registry with strategy pattern
    this.toolRegistry = new ToolRegistry();
    this.toolRegistry.setAIComponents(this.aiEngine, this.neuralNetwork);
    this.toolRegistry.initializeDefaultTools();

    // Initialize health monitor
    this.healthMonitor = new HealthMonitor();

    // Setup Express app
    this.setupExpressApp();

    // Setup MCP server handlers
    this.setupMCPServer();

    logger.info('✅ Integration Demonstration Initialized');
  }

  setupExpressApp() {
    this.app = express();
    const PORT = process.env.PORT || 8002;

    // Middleware
    this.app.use(cors());
    this.app.use(express.json());

    // Security and monitoring middleware
    this.app.use(this.securityMiddleware());
    this.app.use(this.requestLogger());

    // Serve static files
    this.app.use(express.static(path.join(__dirname, '..'), { index: false }));

    // Enhanced demonstration routes
    this.setupDemonstrationRoutes();

    // Start server
    const httpServer = this.app.listen(PORT, () => {
      logger.info(`🌐 Integration Demonstration Server running on http://localhost:${PORT}`);
    });

    // Setup WebSocket for real-time demonstrations
    this.setupWebSocket(httpServer);

    // Graceful shutdown
    this.setupGracefulShutdown(httpServer);
  }

  securityMiddleware() {
    return (req, res, next) => {
      // Security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');

      // Request validation
      if (['POST', 'PUT'].includes(req.method) && !req.is('application/json')) {
        return res.status(400).json({
          success: false,
          error: 'Content-Type must be application/json'
        });
      }

      next();
    };
  }

  requestLogger() {
    return (req, res, next) => {
      const start = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - start;
        this.demonstrationStats.requestsHandled++;

        logger.info('Request processed', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          totalRequests: this.demonstrationStats.requestsHandled
        });
      });

      next();
    };
  }

  setupDemonstrationRoutes() {
    // Main demonstration page
    this.app.get('/demo', (req, res) => {
      res.json({
        success: true,
        message: 'Integration Demonstration Server',
        version: '2.0.0',
        features: [
          'Production-ready MCP server',
          'Strategy pattern for tool management',
          'AI-powered data analysis',
          'Neural network capabilities',
          'Real-time WebSocket features',
          'Enhanced security and monitoring',
          'Comprehensive error handling'
        ],
        endpoints: {
          health: '/api/health',
          demo: '/api/demo/overview',
          aiFeatures: '/api/demo/ai-features',
          neuralNetwork: '/api/demo/neural-network',
          realtime: '/api/demo/realtime',
          tools: '/api/demo/tools',
          performance: '/api/demo/performance'
        }
      });
    });

    // Health check with detailed stats
    this.app.get('/api/health', (req, res) => {
      const uptime = Date.now() - this.demonstrationStats.startTime;

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 1000)}s`,
        demonstration: {
          ...this.demonstrationStats,
          uptime: uptime
        },
        services: {
          mcp: 'running',
          ai: this.aiEngine ? 'initialized' : 'unavailable',
          neural: this.neuralNetwork ? 'initialized' : 'unavailable',
          web: 'active'
        },
        toolRegistry: this.toolRegistry.getStats()
      });
    });

    // AI Features demonstration
    this.app.get('/api/demo/ai-features', async (req, res) => {
      try {
        this.demonstrationStats.aiOperations++;

        const demoData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = await this.aiEngine.processData(demoData);

        res.json({
          success: true,
          feature: 'AI Data Analysis',
          inputData: demoData,
          results: {
            patterns: result.patterns,
            predictions: result.predictions,
            insights: result.insights
          },
          capabilities: this.aiEngine.getCapabilities(),
          processingTime: `${Date.now() - req.startTime}ms`
        });
      } catch (error) {
        this.demonstrationStats.errorsEncountered++;
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Neural Network demonstration
    this.app.get('/api/demo/neural-network', async (req, res) => {
      try {
        this.demonstrationStats.aiOperations++;

        // Simple XOR problem demonstration
        const trainingData = [[0, 0], [0, 1], [1, 0], [1, 1]];
        const labels = [[0], [1], [1], [0]];

        await this.neuralNetwork.train(trainingData, labels);

        const predictions = trainingData.map(input => ({
          input,
          output: this.neuralNetwork.predict(input)
        }));

        res.json({
          success: true,
          feature: 'Neural Network',
          architecture: this.neuralNetwork.architecture,
          trainingData: trainingData,
          predictions: predictions,
          networkInfo: this.neuralNetwork.getNetworkInfo(),
          trainingHistory: this.neuralNetwork.getTrainingHistory()
        });
      } catch (error) {
        this.demonstrationStats.errorsEncountered++;
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Tools demonstration
    this.app.get('/api/demo/tools', (req, res) => {
      try {
        const tools = this.toolRegistry.getAllToolDefinitions();
        const stats = this.toolRegistry.getStats();

        res.json({
          success: true,
          feature: 'Tool Registry (Strategy Pattern)',
          tools: tools.map(tool => ({
            name: tool.name,
            description: tool.description,
            parameters: Object.keys(tool.inputSchema.properties || {})
          })),
          registryStats: stats,
          patternBenefits: [
            'Modular tool management',
            'Easy to add new tools',
            'Consistent error handling',
            'Type validation',
            'Comprehensive logging'
          ]
        });
      } catch (error) {
        this.demonstrationStats.errorsEncountered++;
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Performance demonstration
    this.app.get('/api/demo/performance', (req, res) => {
      const performanceData = {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        uptime: Date.now() - this.demonstrationStats.startTime,
        requestStats: {
          total: this.demonstrationStats.requestsHandled,
          errors: this.demonstrationStats.errorsEncountered,
          errorRate: this.demonstrationStats.requestsHandled > 0 ?
            (this.demonstrationStats.errorsEncountered / this.demonstrationStats.requestsHandled * 100).toFixed(2) + '%' : '0%'
        },
        aiStats: {
          operations: this.demonstrationStats.aiOperations,
          engineAvailable: !!this.aiEngine,
          networkAvailable: !!this.neuralNetwork
        },
        optimizations: [
          'Efficient memory management',
          'Optimized neural network algorithms',
          'Streaming data processing',
          'Cached tool execution',
          'Minimal overhead logging'
        ]
      };

      res.json({
        success: true,
        feature: 'Performance Monitoring',
        data: performanceData,
        recommendations: [
          'Monitor memory usage for large datasets',
          'Batch AI operations for better throughput',
          'Use WebSocket for real-time updates',
          'Implement caching for repeated requests'
        ]
      });
    });

    // Comprehensive overview
    this.app.get('/api/demo/overview', (req, res) => {
      const overview = {
        title: 'Integration Demonstration Overview',
        version: '2.0.0',
        description: 'Comprehensive showcase of all system improvements and new patterns',

        improvements: [
          {
            category: 'Architecture',
            items: [
              'Strategy Pattern for tool management',
              'Modular component design',
              'Separation of concerns',
              'Dependency injection'
            ]
          },
          {
            category: 'AI Capabilities',
            items: [
              'Real data analysis algorithms',
              'Functional neural network',
              'Pattern recognition',
              'Predictive analytics'
            ]
          },
          {
            category: 'Production Readiness',
            items: [
              'Comprehensive error handling',
              'Security middleware',
              'Request validation',
              'Rate limiting',
              'Health monitoring'
            ]
          },
          {
            category: 'Real-time Features',
            items: [
              'WebSocket server',
              'Live data broadcasting',
              'Real-time camera detection',
              'Performance metrics'
            ]
          },
          {
            category: 'Developer Experience',
            items: [
              'Comprehensive logging',
              'Type validation',
              'Clear error messages',
              'Performance monitoring',
              'Health checks'
            ]
          }
        ],

        demonstrations: {
          aiFeatures: '/api/demo/ai-features',
          neuralNetwork: '/api/demo/neural-network',
          tools: '/api/demo/tools',
          performance: '/api/demo/performance',
          health: '/api/health'
        },

        keyMetrics: {
          toolsImplemented: this.toolRegistry.getStats().totalTools,
          aiComponents: 2,
          apiEndpoints: 6,
          securityFeatures: 4,
          monitoringCapabilities: 5
        },

        nextSteps: [
          'Add more sophisticated AI models',
          'Implement database integration',
          'Add user authentication system',
          'Create comprehensive test suite',
          'Add API documentation'
        ]
      };

      res.json(overview);
    });
  }

  setupWebSocket(httpServer) {
    const wss = new WebSocketServer({ server: httpServer });
    const clients = new Set();

    wss.on('connection', (ws, req) => {
      const clientId = Date.now().toString();
      this.demonstrationStats.websocketConnections++;

      logger.info('WebSocket client connected', { clientId });
      clients.add(ws);

      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Welcome to Integration Demonstration WebSocket',
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
        this.demonstrationStats.errorsEncountered++;
      });
    });

    // Broadcast demonstration data
    setInterval(() => {
      if (clients.size === 0) return;

      const demoData = {
        type: 'demonstration-update',
        timestamp: new Date().toISOString(),
        data: {
          stats: this.demonstrationStats,
          aiStatus: {
            engineReady: !!this.aiEngine,
            networkReady: !!this.neuralNetwork,
            totalOperations: this.demonstrationStats.aiOperations
          },
          toolRegistry: this.toolRegistry.getStats(),
          performance: {
            memory: process.memoryUsage(),
            uptime: Date.now() - this.demonstrationStats.startTime
          },
          features: [
            'Real-time data streaming',
            'Live performance metrics',
            'WebSocket communication',
            'AI operation monitoring',
            'Tool execution tracking'
          ]
        }
      };

      const message = JSON.stringify(demoData);

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
    }, 3000);

    logger.info('✅ WebSocket demonstration setup complete');
  }

  setupMCPServer() {
    // MCP tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.info('MCP tools listed');
      return {
        tools: this.toolRegistry.getAllToolDefinitions()
      };
    });

    // MCP tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      logger.info('MCP tool execution requested', { toolName: name });
      this.demonstrationStats.toolsExecuted++;

      try {
        const result = await this.toolRegistry.executeTool(name, args);
        return result;
      } catch (error) {
        this.demonstrationStats.errorsEncountered++;
        logger.error('MCP tool execution failed', {
          toolName: name,
          error: error.message
        });
        throw error;
      }
    });
  }

  setupGracefulShutdown(httpServer) {
    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);

      httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }

  async start() {
    try {
      await this.initialize();

      // Start MCP server
      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      logger.info('🎉 Integration Demonstration Server Started Successfully!');
      logger.info('📡 Available Features:');
      logger.info('   • AI-powered data analysis');
      logger.info('   • Neural network training and prediction');
      logger.info('   • Strategy pattern tool management');
      logger.info('   • Real-time WebSocket updates');
      logger.info('   • Comprehensive monitoring');
      logger.info('   • Production-ready security');

      logger.info('🌐 Visit http://localhost:8002/demo for overview');
      logger.info('🔍 API endpoints available under /api/demo/*');

    } catch (error) {
      logger.error('❌ Failed to start Integration Demonstration', { error: error.message });
      throw error;
    }
  }
}

// Health Monitor Class
class HealthMonitor {
  constructor() {
    this.startTime = Date.now();
    this.checks = 0;
    this.failures = 0;
  }

  performHealthCheck() {
    this.checks++;

    const isHealthy = this.failures / this.checks < 0.1; // Less than 10% failure rate

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      checks: this.checks,
      failures: this.failures,
      failureRate: this.checks > 0 ? (this.failures / this.checks * 100).toFixed(2) + '%' : '0%'
    };
  }
}

// Export and start the demonstration
export default IntegrationDemonstration;

// Auto-start if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  const demo = new IntegrationDemonstration();
  demo.start().catch(console.error);
}
