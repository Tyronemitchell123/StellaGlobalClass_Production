/**
 * Integration example showing how to use the refactored ToolRegistry
 * This replaces the massive switch statement in the original server
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

// Import our refactored tool registry and handlers
import { ToolRegistry } from "./refactored_tool_handlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create server instance
const server = new Server(
  {
    name: "integrated-mcp-ai-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize AI components
const aiEngine = new OptimizedAIEngine();
const neuralNetwork = new OptimizedNeuralNetwork({
  architecture: [4, 8, 6, 2],
  learningRate: 0.01,
  epochs: 50
});

// Create and configure the tool registry
const toolRegistry = new ToolRegistry();
toolRegistry.setAIComponents(aiEngine, neuralNetwork);
toolRegistry.initializeDefaultTools();

// List available tools - now much simpler!
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: toolRegistry.getAllToolDefinitions(),
  };
});

// Handle tool calls - the complex switch statement is replaced with this clean approach!
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // Simply delegate to the tool registry - no more massive switch statement!
  return await toolRegistry.executeTool(name, args);
});

// Create Express app for web interface
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/index.html'));
});

app.use(express.static(path.join(__dirname, '..'), { index: false }));
app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      mcp: 'running',
      ai: 'initialized',
      web: 'active'
    }
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') { // Placeholder - use proper auth in production
    const token = generateToken({ username, role: 'admin' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// Start the server
async function main() {
  console.log('🚀 Initializing Integrated MCP AI Server with Refactored Tool Handlers...');

  // Initialize AI components
  await aiEngine.initialize();
  await neuralNetwork.initialize();

  console.log('✅ AI Components Initialized');

  // Start Express server
  const httpServer = app.listen(PORT, () => {
    console.log(`🌐 Web server running on http://localhost:${PORT}`);
  });

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer });
  const clients = [];

  wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('New WebSocket client connected');
    ws.send(JSON.stringify({ type: 'connected', message: 'Welcome to Veridium Concierge Console' }));

    ws.on('close', () => {
      clients = clients.filter(client => client !== ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Broadcast real-time data
  setInterval(() => {
    const metrics = {
      timestamp: new Date().toISOString(),
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      latency: Math.floor(Math.random() * 200),
      alerts: Math.random() > 0.8 ? ['Motion detected in zone 1'] : [],
      detections: Math.random() > 0.5 ? ['Person detected', 'Vehicle detected'] : []
    };

    const data = { type: 'metrics', data: metrics };
    clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }, 5000);

  console.log('✅ WebSocket server ready for real-time updates');

  // Start MCP server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('✅ Integrated MCP AI Server started successfully');
  console.log('🔧 Available Tools: MCP utilities + AI-powered analysis');
  console.log('📡 Full Stack Application Ready!');
  console.log('🎯 Tool handlers refactored using Strategy Pattern!');
}

main().catch(console.error);
